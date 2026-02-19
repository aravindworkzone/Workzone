##Todo SaaS – MERN Stack

I built this full-stack Todo SaaS to understand how real applications handle authentication, scalability, and clean architecture — not just CRUD operations.

What started as a simple productivity app turned into a deeper exploration of secure authentication, session handling, and backend structure.

This isn’t just a todo app. It’s my attempt to build something that behaves like a real SaaS product.

##What It Does

Users can register and log in securely.
Tasks can be created, updated, deleted, and organized as daily routines or yearly goals.
Daily tasks can automatically sync from routines.
There’s logic to track 7-day productivity and maintain a 30-day history.

The goal was to connect structure with meaningful logic — not just store tasks, but build relationships between them.

How It’s Built

Frontend:
React, Tailwind CSS, Redux Toolkit (RTK Query)

Backend:
Node.js, Express, MongoDB

Authentication:
JWT stored in HTTP-only cookies (no localStorage)

Access tokens are short-lived.
Refresh tokens are rotated on every use.
If a refresh token is reused or mismatched, the session is invalidated.

That part was important to me — I wanted to understand how real applications prevent token replay attacks instead of just copying basic auth logic.

##What I Focused On

Secure cookie-based authentication

Refresh token rotation and session validation

Clean middleware-based route protection

MongoDB schema design for multi-type tasks

Efficient API state management using RTK Query

Handling unauthorized states properly

This project pushed me to think more like a backend engineer, not just a frontend developer.

##Current Status

Working MVP.

Built with scalability in mind and ready to expand with:

Email verification

Forgot password

Role-based access

Analytics dashboard

AI-driven routine suggestions

##Author

Aravind A

Aravind A