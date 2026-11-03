# Database maintenance

The production site uses the existing `dardan-barbershop` Supabase project.
The November 3, 2026 investigation found 17 Auth accounts, 15 profiles, 41 visits,
and 3 gallery records. The database had not been deleted.

## Applied recovery

`repair_profiles.sql` is the exact incremental SQL applied through the tracked
Supabase migration `repair_profile_sync_and_loyalty_realtime`.

- Restores missing profiles from Auth, preserving existing rows and staff roles.
- Creates usernames inside the Auth transaction instead of a second browser write.
- Syncs name, phone, and email changes from Auth into the customer profile.
- Prevents user metadata or browser profile writes from assigning staff roles.
- Adds indexes for visits and gallery queries and publishes visits to Realtime.

Verification after the repair: 17 accounts, 17 profiles, 41 visits, 3 gallery
records, no missing profiles or metadata-backed usernames, and visits published.
`reconcile_profile_contacts.sql` then reconciles historical profile edits from
Auth metadata without changing roles or identifiers.
`tests/profile_repair.sql` verifies signup, metadata synchronization, preservation
of legitimate staff roles, rejection of self-promotion, contact edits, and
Realtime configuration. Its test account is rolled back, leaving no test data.

The account-creation app code now relies on the Auth trigger. Apply the repair
before deploying those app changes. Do not use the old setup files to rebuild a
project: they are partial historical scripts, including unsafe public policies.

## Environment

Use `.env.example` as the template for an untracked `.env.local`. Configure the
same variables in the hosting provider. Public Supabase values are embedded in
the frontend at build time, so changing them requires redeployment. Keep the
service-role key server-only. Never commit actual credentials.

## Staff access and customer isolation

Deploy the verified-session app changes before applying `secure_customer_access.sql`.
That tracked migration removes public customer-data access and anonymous writes.
Members can read their own profiles/visits. The barber panel uses the requested
`0101` PIN at `/barber`, without requiring an account login. The server validates
the PIN and issues a signed HttpOnly cookie for eight hours. Protected panel
operations go through `/api/barber/data`; customer tables remain private. Lock
clears that session. Existing verified barber tokens also remain supported by
the account/password APIs. PIN sessions do not identify an individual barber,
so visits entered with the shared PIN have no individual `barber_id` attribution.

The visit trigger serializes reward accounting per customer, rejects unearned
redemptions, and fills customer identity fields from the database. Ten paid visits
earn one reward; two simultaneous redemption attempts cannot spend it twice.
Existing customer rows and visit history are preserved.

## Live verification on November 3, 2026

- 29 member/public/security HTTP checks passed using a disposable test account.
- 19 staff HTTP checks passed: account creation, duplicate rejection, password
  reset, staff-target reset rejection, ten paid visits, concurrent redemption,
  attribution, and photo upload/publication/view/delete.
- Browser checks passed for member login, QR rendering, profile edit/save,
  member rejection from the staff panel, sign-out, staff login, and translations.
- The member loyalty display changed from 0/10 to 1/10 without a page reload
  after a staff API visit insert, confirming Realtime delivery through RLS.
- `tests/customer_access.sql` checks customer isolation, denied forgery,
  staff capabilities, immutable visit history, and earned-reward accounting.

Username-only customers now receive explicit shop-assisted recovery guidance.
Legacy email accounts have a recovery form for choosing a new password after the
recovery link. Email delivery and physical phone-camera scanning still require
manual acceptance checks; neither is established by the API tests.
Leaked-password protection remains disabled in Auth and should be enabled when
available on the project's plan.

## Rollback and recovery

Git commits separate the SQL repair, app compatibility changes, and documentation.
Reverting a Git commit does **not** roll back an applied database migration.
Preserve the recovered profiles; prefer a new corrective migration rather than
deleting customer rows or restoring the vulnerable trigger. Back up the project
before further database changes.

## Daily database health check

The `Database health` GitHub Action reads at most one public gallery ID daily at
07:17 UTC and can also be run manually. It requires repository variables
`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`; no service-role key is used.
An empty gallery is healthy too. It never inserts test data or logs customer data.
Failures appear in GitHub Actions; configure GitHub notification preferences to
receive workflow-failure alerts.

This generates database activity, but does not guarantee a Free project will stay
active or resume one that is already paused. Scheduled workflows can be delayed;
GitHub can disable public-repository schedules after 60 days without repository
activity. For client uptime requirements, use a paid Supabase plan, which is not
subject to inactivity pausing. See [Supabase's pausing guide](https://supabase.com/docs/guides/platform/free-project-pausing)
and [GitHub's schedule limits](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
