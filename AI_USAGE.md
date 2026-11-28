# AI Usage

## Summary

I treated AI as a junior pair-programmer that I direct and check, not as an author. I made the design decisions and owned the architecture. Claude (Anthropic, in chat) proposed options, drafted code and tests, and explained concepts when I asked. Everything it produced was run, tested and, where it was wrong, corrected by me before it stayed in the repository. My own estimate: about 70% of the design was mine and about 30% came from the AI.

---

## 1. Which tools I used, and for which parts

**Claude (Anthropic), chat.** Used as a design sounding board, a code and test drafter, a debugging aid, and a documentation helper.

| Area                              | My part                                                                                                                                                                                                                                                                                 | Claude's part                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Authentication                    | Designed and built all of it myself: users, registration, login, refresh and logout, tokens. Claude never saw this code and wrote none of it.                                                                                                                                           | None                                                                                              |
| Authorization                     | Chose the approach in my own plan before involving the AI: a role guard on the admin controllers, an ownership check on sessions, and a test that calls every admin route as a student. Wrote the `@Roles()` decorator on my own `Role` enum, and wired the guards and my JWT strategy. | Drafted the guard, the `@CurrentUser()` decorator and the 401/403 test for me to review and adapt |
| Architecture and scope            | Chose the stack, the 6-table data model, module boundaries and one-way dependencies, the schedule and the cut order. Made the final call on every decision.                                                                                                                             | Set out options and trade-offs for each decision                                                  |
| Exams module                      | Built and tested it myself                                                                                                                                                                                                                                                              | Reviewed                                                                                          |
| Timer, grading, sessions, shuffle | Decided the rules: server-only clock, a 10-second grace window, a whole-number pass check, session start as one transaction, a row lock on submit. Created the files, wired the modules, ran every call and fixed what broke.                                                           | Drafted the services and the unit tests                                                           |
| Debugging                         | Checked every suggestion against the real error, the real code and the database                                                                                                                                                                                                         | Proposed possible causes for errors I pasted in                                                   |
| Documentation                     | Corrected the facts and checked every command and name                                                                                                                                                                                                                                  | Helped structure the README and this file                                                         |

---

## 2. How I kept AI output under control

These were my working rules. They are how I caught the problems in section 3.

1. **Explanation before code.** I asked for what the code does and how, step by step, before accepting any code. This kept me in charge of the design and let me spot wrong assumptions early.
2. **My code is the source of truth.** I pushed back when the AI structured things differently from my project. For example, I kept my generated `CommonService` as the clock instead of a new `Clock` class, and the AI adapted to my structure.
3. **Assumptions must be visible.** I made the AI mark guessed names, and I verified each one against my files. It had guessed my exam class name and written import paths for files it had never seen.
4. **Trust the database, not the code.** After entity changes I checked the real tables in Neon, and I read the generated SQL in error logs.
5. **Test before moving on.** Each step was exercised with real requests, then with automated tests: unit tests for the timer, grading, clock and shuffle, and an end-to-end test that calls every admin route without a token (401) and as a student (403). **[FILL IN: add the required tests 1 and 4 here once they exist.]**
6. **Check dependencies against my versions.** The AI told me to install a package that does not support my TypeORM version. I caught it from the install error, and documented the workaround in the README instead of hiding it.

---

## 3. A specific example where the AI gave buggy code, and how I caught and fixed it

### What happened

My first test of `POST /exams/:id/questions` returned a 500. The server log showed:

```
null value in column "exam_id" of relation "questions" violates not-null constraint
INSERT INTO "questions"("id", "examId", "text", "options", "correctIndex", "position", "exam_id") ...
```

### What was wrong

The AI's `QuestionEntity` described the link to an exam in two unconnected ways: a plain `examId` column, and a `@ManyToOne` relation to the exam. TypeORM did not know they were one thing, so it created **two columns**, `examId` and `exam_id`. My service filled one, and the database required the other, so every insert failed.

The same log showed a second fault: the columns were camelCase (`examId`, `correctIndex`) when the plan said snake_case. The naming strategy we had agreed on had never been switched on.

### How I caught it

I read the failing `INSERT` itself and saw `"examId"` and `"exam_id"` in the same statement. I asked why the entity held what looked like the same field twice, and that question exposed the mistake. A shallower read of the error would have treated it as a missing value in my service and sent me looking in the wrong place.

### How I fixed it

1. Gave the plain column and the relation the same database column name, so TypeORM treats them as one: `@Column({ name: 'exam_id' })` on the field and `@JoinColumn({ name: 'exam_id' })` on the relation.
2. Turned on `SnakeNamingStrategy`. The package refused to install because it declares support only for TypeORM 0.x, so I added `backend/.npmrc` with `legacy-peer-deps=true`, and documented the trade-off in the README.
3. The old camelCase columns were still in the development database, and the server failed on start with `column "duration_minutes" of relation "exams" contains null values`. Schema sync cannot rename columns, so I dropped and recreated the development schema in the Neon SQL editor, then confirmed the `questions` table had one `exam_id` and one `correct_index` and no camelCase columns.
4. Re-ran the six question checks (create, list, bad input, edit, locked exam, delete) until all passed.

### What it changed in my practice

I now verify the real schema after every entity change, and I treat any AI-supplied class, file or method name as unverified until I have matched it against my code. Later steps went faster and cleaner because of it. The AI's marked assumptions in the sessions code were each checked before I ran it.

### A second, smaller catch

The AI assumed my JWT strategy was already registered. My `AuthModule` had no strategy at all, because my public routes never needed one. I found this by comparing its advice with my module file, and registered the strategy before the first guarded route could fail with "Unknown authentication strategy".

---

## 4. What I would do differently

- Ask for my real files to be read before any entity or module code is written, so guesses never get written in the first place.
- Run a short schema check in Neon after every entity change, as a habit from the first day.
- Write the end-to-end tests for the required behaviours earlier, next to the features, and not after them.

---

## 5. My view on using AI

AI sped up the structural work: module wiring, test scaffolding and documentation. It was weakest where it could not see my real code, because it filled the gaps with confident guesses that looked plausible. The approach that worked was to keep the design in my hands, ask for explanations before code, make assumptions visible, and verify each step against the real database and real tests. I am comfortable explaining and defending every part of this codebase, including the parts the AI drafted.
