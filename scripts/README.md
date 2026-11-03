# Live smoke checks

`live-smoke-test.py` uses Python's standard library. It checks public routes,
username login, profile syncing, member isolation, staff API rejection, gallery
reads, and denied member writes. It must use a dedicated disposable **member**
account, never a customer's account. The test updates that fixture's first name.

Create an untracked `fixture.smoke.json` with these fields:

```json
{
  "base": "https://YOUR_PROJECT.supabase.co",
  "key": "YOUR_PUBLIC_PUBLISHABLE_KEY",
  "username": "YOUR_QA_MEMBER_USERNAME",
  "password": "YOUR_QA_MEMBER_PASSWORD",
  "id": "YOUR_QA_MEMBER_AUTH_UUID"
}
```

Run `python scripts/live-smoke-test.py --credentials-file /path/to/fixture.smoke.json`.
Use `--site` to select the matching deployment. The script refreshes the fixture
file with its test session token; do not share or commit that file.

Run the SQL checks in `supabase/tests/` separately as a database administrator.
They roll back their fixtures. The live script does not create/delete accounts;
remove only the dedicated test account and its fixture records after testing.
