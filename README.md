# WorkZone — Goal-to-Task Planner SaaS

> Turn your yearly goals into daily routines — with AI assistance, secure multi-device sessions, and a streak system that keeps you honest.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-workzone--todo.vercel.app-0F6E56?style=flat&logo=vercel)](https://workzone-todo.vercel.app/)

---

## Why I Built This

Most productivity apps are just lists with due dates. You add tasks, check them off, and wonder two weeks later why nothing actually changed. The missing piece is the connection between what you *want long-term* and what you *do today*.

WorkZone is built around one idea: a goal without a daily routine is just a wish. So instead of a flat task list, it has a three-level hierarchy — yearly goals break down into routines, routines sync into today's tasks automatically. The structure forces the connection.

I also used this project to understand how real SaaS applications handle session security — not just "store a JWT in localStorage and call it done", but rotating refresh tokens, reuse detection, and multi-device caps that would hold up in production.

---

## Live Demo

🔗 [workzone-todo.vercel.app](https://workzone-todo.vercel.app/)

> Dashboard  
![Dashboard](./screenshots/dashboard.png)

> Daily Routine  
![Routine](./screenshots/routine.png)

> Yearly Goals  
![Goals](./screenshots/goals.png)

> Login  
![Login](./screenshots/login.png)

---

## Features

### Goal → Routine → Today pipeline
- Three-level task hierarchy: **Yearly Goals → Daily Routines → Today Tasks**
- Routines linked to a goal sync automatically into today's task list on each day boundary
- The hierarchy is enforced at the data model level, not just the UI — so the structure is consistent regardless of how the API is called

### Authentication & session security
- JWT access tokens delivered via httpOnly cookies — not localStorage
- **Rotating refresh tokens** — every successful refresh issues a new token and immediately invalidates the previous one
- **Reuse detection** — if a token that's already been rotated is replayed, the entire session is invalidated. This closes the window on token theft without requiring server-side session storage
- Refresh tokens are **SHA-256 hashed** before being stored in MongoDB — raw tokens are never persisted anywhere
- **3-device session cap** — a fourth login evicts the oldest active session, enforced server-side
- Proper 401 / 403 separation: expired token vs. insufficient permissions are distinct error states

### AI-powered routine generation
- Converts a yearly goal into a structured daily routine using the **Gemini API**
- Controlled prompt engineering with structured JSON output constraints
- Fallback handling for malformed or off-topic responses
- Auto-links generated routines back to their parent goal

### Productivity tracking
- 7-day productivity indicator with daily progress bars
- 30-day history aggregation
- Monthly streak calendar

### Email verification *(dev-ready)*
- Verification tokens are SHA-256 hashed before storage — raw token sent once via email, never persisted
- Expiry validated server-side on the verification endpoint
- Fully functional in development; disabled in production pending email provider setup

---

## Architecture decisions

**Why rotating refresh tokens instead of long-lived sessions?**

A standard refresh token that never changes is a liability — if it leaks, an attacker has indefinite access until the user explicitly logs out. Rotation limits the window: each token is valid for exactly one use. The cost is slightly more complexity in the refresh flow; the benefit is that a stolen token becomes useless the moment the legitimate user makes any request.

The reuse detection layer adds the second half: if a rotated (already-used) token is replayed, the server knows something is wrong and invalidates the entire session. This is the difference between detecting a theft after the fact versus closing the door in real time.

**Why Gemini over other LLM providers?**

Practical reason: Gemini has a free tier that's generous enough for a self-funded side project at early stage. The Anthropic API has no free tier, and OpenAI's free quota runs out fast. For a feature that makes one AI call per goal-to-routine generation, Gemini was the right tool for the current stage — not a permanent decision, but a deliberate one.

**Why hash refresh tokens in MongoDB?**

If the database is ever compromised, plain-text refresh tokens give an attacker the ability to impersonate any logged-in user until those tokens expire. Hashing them means a database dump yields nothing usable. The raw token exists only in transit, in the httpOnly cookie on the client — never on disk anywhere.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Redux Toolkit + RTK Query |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, httpOnly cookies, rotating refresh tokens, SHA-256 hashed storage |
| AI | Gemini API |
| Email | Resend |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Author

**Aravind A** — MERN Stack Developer  
📧 aravind.workzone@gmail.com  
🌐 [Portfolio](https://aravind-mern.vercel.app) · [LinkedIn](https://linkedin.com/in/aravind-a-dev) · [GitHub](https://github.com/aravindworkzone)
