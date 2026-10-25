# fast-studentvue

A small StudentVUE client. The package entry point in `src/index.ts` discovers
a district's StudentVUE endpoint from an email address and sends requests to
the StudentVUE web service.

`src/pusd-test.ts` is a separate, PUSD-specific terminal script. It displays
grades and read-only attendance, past attendance, class schedule, calendar,
school messages, the first inbox page, and document listings. It also offers a
local hypothetical-grade estimate; it does not submit changes to StudentVUE.
Districts may disable individual API features, in which case the affected
section reports an error while the remaining sections continue.

## Run the website

The ZenFlow Next.js app in `public/ZenFlow` is a frontend-only demo. It uses
fictional sample grades, attendance, schedule, calendar, messages, and
documents. Login is local to the browser; no credentials or dashboard requests
are sent to StudentVUE or to an application API. There are no website API
routes. Downloaded sample documents are generated locally as text files.

Run it with:

```sh
cd public/ZenFlow
pnpm install
pnpm dev
```

Open the local URL printed by Next.js and sign in with the demo credentials:
ID `demo`, password `zenflow`. All sample information is fictional.

The repository-root package and `src/pusd-test.ts` remain separate StudentVUE
client tools; they are not used by the ZenFlow website.

## Run the PUSD script

Requires Node.js 22.6 or newer. Install the project dependencies, then run:

```sh
npm install
STUDENT_EMAIL="student@example.com" STUDENT_PASSWORD="your-password" \
  node --experimental-strip-types src/pusd-test.ts
```

The script prompts for any missing credentials in an interactive terminal.
`STUDENT_USERNAME` is optional and defaults to `STUDENT_EMAIL`. This script
connects to PUSD; it is not the district-discovery client described above.

The script filters common sensitive fields from API output and does not echo
the password. It does print the login email in its connection status line.
Avoid sharing terminal output that contains account information.
