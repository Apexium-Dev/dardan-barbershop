"""Live member checks. Pass a local fixture file; never use customer credentials.

Fixture JSON: base (Supabase URL), key (publishable key), username, password, id.
Does not create or delete accounts. Writes are negative authorization tests only.
"""
import argparse
import base64
import json
from pathlib import Path
import secrets
import urllib.error
import urllib.request

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--credentials-file", type=Path, required=True)
parser.add_argument("--site", default="https://dardanbarber.mk")
args = parser.parse_args()
fixture = json.loads(args.credentials_file.read_text())
base = fixture["base"].rstrip("/")
results = []


def request(url, method="GET", data=None, token=None, content_type="application/json"):
    headers = {"apikey": fixture["key"], "Content-Type": content_type}
    if token:
        headers["Authorization"] = "Bearer " + token
    payload = data if isinstance(data, bytes) else json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(url, headers=headers, method=method, data=payload)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            if "application/json" not in response.headers.get("Content-Type", ""):
                response.read(1024)
                return response.status, None
            return response.status, json.load(response)
    except urllib.error.HTTPError as error:
        try:
            return error.code, json.load(error)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return error.code, None
    except (urllib.error.URLError, TimeoutError):
        return 0, None


def check(name, condition):
    results.append((name, bool(condition)))
    print(("PASS " if condition else "FAIL ") + name)


for route in ["/", "/auth", "/profile", "/barber", "/gallery", "/terms", "/privacy"]:
    status, _ = request(args.site + route)
    check("Page " + route, status == 200)

status, body = request(args.site + "/api/auth/login", "POST", {
    "identifier": fixture["username"].upper(), "password": fixture["password"],
})
check("Username login is case insensitive", status == 200 and bool(body.get("session") if body else False))
if not body or not body.get("session"):
    raise SystemExit(1)
token = body["session"]["access_token"]
fixture["token"] = token
args.credentials_file.write_text(json.dumps(fixture))
status, _ = request(args.site + "/api/auth/login", "POST", {
    "identifier": fixture["username"], "password": secrets.token_urlsafe(24),
})
check("Wrong password rejected", status == 401)
status, _ = request(args.site + "/api/auth/login", "POST", {"identifier": [], "password": "invalid"})
check("Malformed login rejected", status == 400)

status, rows = request(base + "/rest/v1/profiles?id=eq." + fixture["id"] + "&select=id,role", token=token)
check("Member reads own profile", status == 200 and rows == [{"id": fixture["id"], "role": "member"}])
status, _ = request(base + "/auth/v1/user", "PUT", {"data": {"first_name": "QA Smoke Updated"}}, token)
check("Member edits profile metadata", status == 200)
status, rows = request(base + "/rest/v1/profiles?id=eq." + fixture["id"] + "&select=first_name", token=token)
check("Edited name reaches profile table", status == 200 and rows == [{"first_name": "QA Smoke Updated"}])
status, _ = request(base + "/rest/v1/profiles?id=eq." + fixture["id"], "PATCH", {"role": "barber"}, token)
check("Member cannot assign staff role", status == 403)

for table, owner in [("profiles", "id"), ("visits", "user_id")]:
    status, _ = request(base + "/rest/v1/" + table + "?select=id&limit=1")
    check("Anonymous cannot read " + table, status in (401, 403))
    status, rows = request(base + "/rest/v1/" + table + "?select=id&" + owner + "=neq." + fixture["id"], token=token)
    check("Member cannot read another customer's " + table, status == 200 and rows == [])

status, _ = request(base + "/rest/v1/visits", "POST", {"user_id": fixture["id"]}, token)
check("Member cannot forge visit", status == 403)
fixture["negative_photo_path"] = "qa-denied-" + secrets.token_hex(8) + ".png"
args.credentials_file.write_text(json.dumps(fixture))
status, _ = request(base + "/rest/v1/gallery_photos", "POST", {"storage_path": fixture["negative_photo_path"]}, token)
check("Member cannot publish photo metadata", status == 403)
image = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=")
status, error = request(base + "/storage/v1/object/gallery/" + fixture["negative_photo_path"],
    "POST", image, token, "image/png")
check("Member cannot upload gallery image", status in (401, 403)
    or (status == 400 and "row-level security" in str(error).lower()))

for route in ["create-account", "reset-password"]:
    url = args.site + "/api/barber/" + route
    status, _ = request(url, "POST", {})
    check("Anonymous denied staff " + route, status == 401)
    status, _ = request(url, "POST", {"pin": "0101"})
    check("Legacy PIN denied staff " + route, status == 401)
    status, _ = request(url, "POST", {}, token)
    check("Member denied staff " + route, status == 403)

status, rows = request(base + "/rest/v1/gallery_photos?select=id,storage_path&limit=1")
check("Public gallery metadata available", status == 200 and isinstance(rows, list))
if rows:
    status, _ = request(base + "/storage/v1/object/public/gallery/" + rows[0]["storage_path"])
    check("Public gallery image available", status == 200)

passed = sum(ok for _, ok in results)
print(f"{passed}/{len(results)} checks passed")
raise SystemExit(0 if passed == len(results) else 1)
