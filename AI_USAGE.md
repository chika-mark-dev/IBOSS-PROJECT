# AI Usage

I am responsible for every line in this repository. This file records which AI tools I used, what for, and how I checked their output.

## 1. Tools used and what for

| Tool                     | Used for                                                                                                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Claude (Anthropic, chat) | Acting as a mentor and project manager: laying out options and trade-offs for each design decision (stack, data model, auth, API, timer rules, shuffling, tests, folder layout); drafting `project_plan.md` from the decisions I made; explaining commands and concepts during setup |

<!-- TODO: add any other tool you actually used (Copilot, ChatGPT, Cursor...) and what for. Remove this line when done. -->
<!-- TODO: as code gets written with AI help, add a row or a note per area (for example: auth module, sessions module, grading, React screens). Be specific. -->

### How I used it

I made each decision myself after hearing the options. Claude proposed, I accepted, rejected, or changed.

Two design suggestions I pushed back on and changed:

- **Stack choice.** The first recommendation (Express with SQLite) was justified mostly by convenience. I challenged it, because a stack choice should follow what the project needs, not the developer's comfort. We redid the reasoning from the requirements (validation, safe errors, a controllable clock for timer tests, row locking for double submits) and moved to NestJS and PostgreSQL.
- **Authentication.** The first design used a shared admin key and no student accounts, because the brief does not mention login. I raised that the company puts strong weight on authentication and authorization, so the design changed to registered users, JWT, role guard and a per-session ownership check.

## 2. One example of weak or unsafe AI output, and how I caught it

<!-- TODO: fill this with a REAL code-level example that actually happened while building. Do not invent one. -->

**What the AI produced:**

**Why it was wrong (suboptimal, buggy, or insecure):**

**How I caught it (a test failing, code review, running the app, reading the output):**

**The fix:**

**What I do differently now:**

## 3. How I verified AI output

<!-- TODO: write this at the end, only with things you really did. For example: ran the code, wrote tests for the rules, read every file, rewrote parts I could not explain. -->
