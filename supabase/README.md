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

## Follow-up work

The recovery deliberately preserves the legacy PIN-based barber workflow until
its separate review. It does **not** resolve the following existing issues:

- Anonymous profile/visit reads and visit/gallery writes are currently allowed.
- Staff APIs use a PIN visible in the browser bundle instead of verified staff
  authentication. Password-reset authorization needs particular attention.
- Username-only accounts cannot receive email password-reset links at their
  synthetic addresses. Recovery needs an explicit supported customer flow.
- Loyalty redemption is calculated in the browser and needs transactional
  database validation before concurrent or forged redemptions can be trusted.
- Leaked-password protection is disabled in Auth.

Do not call the entire site production-ready based only on the SQL checks. Verify
real signup/login, profile editing, staff actions, storage uploads, and Realtime
using a controlled test account after deployment.

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
