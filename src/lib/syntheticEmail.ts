// Username-only accounts register with `${username}@SYNTHETIC_EMAIL_DOMAIN`
// under the hood, since Supabase Auth requires an email. This address is
// never real and never shown to the user — anywhere the UI would display
// "email", check isSyntheticEmail() first and show the username instead.
export const SYNTHETIC_EMAIL_DOMAIN = "dardan-user.local";

export function isSyntheticEmail(email: string | null | undefined): boolean {
  return !!email && email.endsWith(`@${SYNTHETIC_EMAIL_DOMAIN}`);
}

const USERNAME_RE = /^[a-z0-9_.-]{3,20}$/;

export function isValidUsername(username: string): boolean {
  return USERNAME_RE.test(username);
}
