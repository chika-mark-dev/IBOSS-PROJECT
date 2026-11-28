# IBOSS CBT: Computer-Based Test Platform

A web app where an admin creates timed multiple-choice exams and students take them. The server owns the clock, the grading and the answer key. The browser only displays.

- **Backend:** NestJS + TypeScript, PostgreSQL (Neon), TypeORM
- **Frontend:** React + Vite + TypeScript
- **Repo layout:** `backend/` and `frontend/`, each with its own README. This file is the overview and the quick start.

**[VERIFY]** or **[TODO]**

---

## 1. What it does

**Admin**

- Creates an exam (title, duration, pass mark) and adds, edits and deletes questions while it is a draft.
- Releases the exam to students. Drafts are never visible to students.
- Sees every student's result for an exam.

**Student**

- Sees released exams and starts one.
- Gets the questions in a personal shuffled order, with a countdown that comes from the server.
- Saves answers as they go, and can change them until time is up.
- Refreshing the page or losing the connection loses nothing: the session, the saved answers and the remaining time are restored from the server.
- Is auto-submitted at 00:00, or submits manually.
- Sees a result: score, percentage, pass or fail, and a per-question breakdown.

---

## 2. How the required behaviours are met

| Requirement                                 | How it is done                                                                                                                                                                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correct answers never reach the student     | Students only ever receive `StudentQuestionDto` (`id`, `text`, `options`), built field by field with no object spread. The stored `correctIndex` never appears in a student response.                                                                                           |
| Server-side timer                           | Every time check reads the server clock through one service (`CommonService.now()`). `expires_at` is set once at session start and never changes. The browser countdown is display only and re-syncs from `serverTime` and `remainingSeconds` on load and on every answer save. |
| Survives refresh and connection loss        | The session, its question order and every saved answer live in PostgreSQL. `GET /sessions/:id` rebuilds the full screen state. Starting again returns the existing session with the original `expires_at`.                                                                      |
| Auto-submit at 00:00                        | The browser submits when the countdown reaches zero. The server then decides on time or late (see below). Sessions never submitted are closed as `expired` the next time anyone reads them.                                                                                     |
| Question navigator (answered vs unanswered) | `answers` in the session response maps each answered question id to the chosen option. The frontend marks every question by looking it up.                                                                                                                                      |
| Server-side grading                         | `GradingService` is a pure function. It runs on the server when a session is submitted or its result is read. The browser never computes a score.                                                                                                                               |
| Results summary                             | Score, total, percentage, pass or fail, status, and a per-question breakdown.                                                                                                                                                                                                   |

### Time rules

- A save after `expires_at` is rejected with 409.
- A submit within **10 seconds** after `expires_at` (the grace window, `GRACE_SECONDS`) is `submitted`.
- A later submit is accepted but stored as `submitted_late`.
- A session never submitted becomes `expired` when next read, and is graded on whatever was saved.

### Grading rules (deliberate simplifications)

- **Equal marks:** every question is worth 1 point.
- Score is the number of correct answers. An unanswered question counts as wrong.
- Percentage is `score / total * 100`, rounded to 2 decimals for display only.
- Pass is decided with whole numbers: `score * 100 >= passMarkPercent * totalQuestions`. No floating-point comparison, so an exact pass mark always passes.

---

## 3. Architecture

```
backend/src
  common/     CommonService (the one clock), error filter, health check
  users/      users
  auth/       login, tokens, JwtAuthGuard, RolesGuard, @Roles, @CurrentUser
  exams/      exams (admin and student views)
  questions/  questions (admin only), student-safe projection
  sessions/   sessions, answers, submit, results
  timer/      TimerService: expiry, grace window, remaining time
  grading/    GradingService: pure scoring
  tokens/     Issuing tokens, token rotation
```

**Dependencies run one way, with no cycles:**
`sessions → timer, grading, exams, questions`, `questions → exams`, `timer → common`.
Controllers hold no business rules. Time rules live only in `TimerService`, and scoring only in `GradingService`, so both are unit-tested with no database.

**Data model (6 tables):** `users`, `exams`, `questions`, `exam_sessions`, `answers`, `refresh_tokens`.

- `exams.is_released` controls student visibility. New exams are drafts.
- `exams.is_locked` becomes true when the first session starts, and freezes the exam and its questions.
- `exam_sessions` has `UNIQUE(user_id, exam_id)`: one attempt per student per exam. It also stores `question_order` (shuffled once, at start) and `total_questions`.
- `answers` has `UNIQUE(session_id, question_id)`: saving again overwrites.

**Transactions:** session start (check questions, lock exam, create session) is one transaction, so an exam is never locked without a session or the reverse. Save-answer and submit take a row lock on the session, so a late answer cannot slip in while grading, and a repeated submit returns the same result.

---

## 4. Prerequisites

- Node.js 20 or newer **[VERIFY version]** and npm
- A PostgreSQL database. This project uses [Neon](https://neon.tech) with two branches: `main` for development and a separate `test` branch for automated tests.

---

## 5. Install and run locally

### 5.1 Clone and install

```bash
git clone <repo-url> iboss-cbt
cd iboss-cbt

cd backend
npm install
cd ../frontend
npm install
```

`backend/.npmrc` sets `legacy-peer-deps=true` on purpose: `typeorm-naming-strategies` declares peer support only for TypeORM 0.x, while this project uses TypeORM 1.x. It works, and the flag lets a clean clone install without extra arguments.

### 5.2 Configure the backend

Create `backend/.env` (it is git-ignored, and must never be committed):

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require   # Neon "main" branch
DB_SYNC=true
JWT_ACCESS_SECRET=<long random string>        # [VERIFY variable names]
JWT_REFRESH_SECRET=<another long random string>
```

Generate secrets with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

`DB_SYNC=true` makes TypeORM create the tables on startup. This is an MVP trade-off: there are no migrations (see Known limitations).

### 5.3 Run the backend

```bash
cd backend
npm run start:dev
```

The API runs at `http://localhost:3000`. Check it with `GET /health`.

### 5.4 Run the frontend

```bash
cd frontend
npm run dev
```

The app runs at `http://localhost:5173` **[VERIFY port]**. The API base URL is set in `frontend/.env` as `VITE_API_URL=http://localhost:3000` **[VERIFY]**.

### 5.5 Create an admin

Registration always creates a **student**. To make an admin, register normally, then promote the account in the Neon SQL editor (on the branch your app uses):

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Log in again afterwards. The role is stored in the access token, so an old token keeps the old role.

### 5.6 Optional: seed sample questions

`backend/scripts/seed-questions.mjs` posts 10 sample questions to an exam. Create an exam as admin, then:

```bash
cd backend
TOKEN="<admin access token>" EXAM_ID="<exam id>" node scripts/seed-questions.mjs
```

Do this before any student starts the exam, because the first session locks it.

---

## 6. Run the tests

```bash
cd backend
npm test            # unit tests, no database needed
npm run test:e2e    # end-to-end tests, need the test database  [VERIFY script name]
```

**End-to-end tests run against the separate Neon `test` branch.** Point `DATABASE_URL` at the test branch for the test run, for example through `backend/.env.test` **[VERIFY how the project does this]**. Never run them against your development data.

### What is covered

| Required test                                | File                                                  | What it proves                                                                                          |
| -------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1. Answers stripped from the student payload | **[TODO]**                                            | No `correctIndex` anywhere in the start and reload responses                                            |
| 2. Accurate grading                          | `src/grading/grading.service.spec.ts`                 | All correct, none correct, unanswered, exact pass mark, one point under, 57 of 100 float case, rounding |
| 3. Late submission rejected or flagged       | `src/timer/timer.service.spec.ts` plus **[TODO e2e]** | On time, edge of the grace window, one second past is `submitted_late`, save after expiry is rejected   |
| 4. Invalid input                             | **[TODO]**                                            | Unknown question, out-of-range `selectedIndex`, already-submitted session, bad UUID                     |

Other tests: the clock and its test double (`src/common`), the shuffle (`src/sessions/shuffle.util.spec.ts`), and `test/authorization.e2e-spec.ts`, which calls every admin route with no token (expects 401) and with a student token (expects 403), and checks that an admin gets through.

---

## 7. API summary

| Method and path                                                       | Who     | Purpose                                                   |
| --------------------------------------------------------------------- | ------- | --------------------------------------------------------- |
| `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | public  | account and tokens                                        |
| `GET /exams`                                                          | student | released exams only                                       |
| `POST /exams/:id/sessions`                                            | student | start, or resume the existing attempt (404 if unreleased) |
| `GET /sessions/:id`                                                   | student | reload: questions in order, saved answers, time left      |
| `PUT /sessions/:id/answers/:questionId`                               | student | save or change an answer                                  |
| `POST /sessions/:id/submit`                                           | student | submit (repeat submit returns the same result)            |
| `GET /sessions/:id/result`                                            | student | score and breakdown, after submit or expiry               |
| `POST /exams`, `GET /exams/admin`, `GET /exams/:id/admin`             | admin   | create, list all, details                                 |
| `PATCH /exams/:id`, `PATCH /exams/:id/release`, `DELETE /exams/:id`   | admin   | edit, release, delete (draft only)                        |
| `POST /exams/:examId/questions`, `GET /exams/:examId/questions`       | admin   | add, list with correct answers                            |
| `PATCH /questions/:id`, `DELETE /questions/:id`                       | admin   | edit, delete (409 once the exam is locked)                |
| `GET /exams/:id/results`                                              | admin   | every student's result **[TODO: confirm built]**          |

Someone else's session returns **404**, not 403, so session ids cannot be probed.

---

## 8. Usage walk-through

1. Register an account, promote it to admin (5.5), and log in.
2. Create an exam, add questions, and release it.
3. Register a second account (a student) and log in.
4. The student opens the released exam and starts it. The countdown begins.
5. Answer some questions. Reload the page: the answers, the navigator state and the remaining time are restored.
6. Submit, or wait for 00:00. The result page shows the score, percentage, pass or fail, and the breakdown.

### Screenshots **[TODO: add after the frontend is built]**

```
docs/screenshots/admin-create-exam.png
docs/screenshots/student-exam-navigator.png
docs/screenshots/result-summary.png
```

---

## 9. Security decisions

- The answer key is never in any student response. Student question objects are built field by field.
- Admin routes are protected by a role guard at controller level, so routes added later are covered automatically. A test calls every admin route as a student and without a token.
- Students can only read and write their own sessions: every lookup uses session id and user id together.
- All id parameters are validated as UUIDs and return a clean 400 for bad input. Request bodies are validated, and unknown fields are stripped.
- Secrets live in `.env`, which is git-ignored. Only the variable names are documented here.
- The clock is the server's only. Nothing the browser sends can change the deadline.

---

## 10. Known limitations and trade-offs

- **`DB_SYNC=true`, no migrations.** Fine for an MVP and a take-home. A production system needs migrations.
- **Lazy expiry, no background job.** A session left open is marked `expired` when next read, not exactly at 00:00. Deadlines are always checked against the clock, so grading is unaffected. Only the status label is late.
- **Admin edits are not row-locked.** An admin edit checks `is_locked` without a row lock, so an edit at the exact moment a session starts can race it. The window is milliseconds.
- **Equal marks only.** Every question counts 1 point.
- **Options are not shuffled**, only the question order.
- **Access token role.** The role is read from the token, so a demoted admin keeps access until the token expires (short-lived access token **[VERIFY lifetime]**).
- **Token storage in the browser:** **[TODO: state the decision, localStorage or cookie, and the reason]**.
- No pagination on list endpoints.

---

## 11. Project documents

- `project_plan.md`: scope, decisions, schedule and real hours
- `AI_USAGE.md`: AI tools used, and a real example of AI error that I caught
