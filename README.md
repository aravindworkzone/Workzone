# Todo SaaS – MERN Stack

A full-stack Todo SaaS application built to demonstrate clean architecture,
authentication flow, and scalable backend design using the MERN stack.

## Purpose
This project is created for **code review and interview discussion**.
It focuses on how the application is structured and how problems are solved.

## Tech Stack
- React.js + Tailwind CSS
- Redux Toolkit (RTK Query)
- Node.js + Express.js
- MongoDB
- JWT Authentication using HTTP-only cookies

## Key Features
- User registration and login
- Secure authentication & protected routes
- Create, update, delete tasks
- Daily routines and goal management
- Productivity tracking logic

## Architecture Overview
- Frontend communicates with backend using REST APIs
- JWT is issued on login and stored in HTTP-only cookies
- Middleware validates authentication for protected routes
- RTK Query manages API calls, caching, and loading states
- MongoDB stores user-specific task data

## Challenges & Learnings
- Handling authentication using cookies instead of localStorage
- Managing API state efficiently using RTK Query
- Designing MongoDB schemas for multiple task types
- Handling token expiry and unauthorized access

## Project Status
This is a **working MVP (v1)** and can be extended with:
- Email verification
- Forgot password
- Role-based access
- Advanced analytics

## Notes
Environment variables and runtime configuration are intentionally excluded.
This repository is intended for **viewing and discussion only**.

## Author
Aravind A