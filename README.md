# Todo SaaS – MERN Stack

This is a full-stack Todo SaaS built to understand how real applications handle authentication, session security, and scalable backend structure — not just CRUD operations.

The focus of this project was building production-style authentication and structured task relationships rather than a simple task list.

## Features

### Authentication & Security

    JWT-based authentication using HTTP-only cookies

    Short-lived access tokens

    Refresh token rotation on every use

    Refresh token reuse detection (prevents replay attacks)

    Session invalidation on token mismatch

    Middleware-protected routes

    Proper 401 / 403 handling

### Task System

    Create, update, delete tasks

#### Task types:

    Today Tasks

    Daily Routines

    Yearly Goals

    Routine → Today automatic sync

    Goal-linked task relationships

    Soft delete support

    7-day productivity tracking

    30-day history aggregation

## Tech Stack

### Frontend:

    React (Vite)

    Tailwind CSS

    Redux Toolkit + RTK Query

### Backend:

    Node.js

    Express

    MongoDB (Mongoose)

## Email Verification

    Email verification is fully implemented with:

    Secure random token generation

    SHA256 hashed token storage

    Expiry validation

    Dedicated verification endpoint

    Frontend verification flow

#### Deployment Status:

    Currently disabled in production because it requires a paid email service provider. The feature works in development and can be enabled in production once an email provider is configured.

## AI-Powered Routine Generation 

    Converts yearly goals into structured daily routines using AI  

    Uses controlled prompt engineering  

    Parses structured JSON responses  

    Automatically links generated routines to goals  

## Current Status

    Working MVP.
    Architecture designed for future expansion, including:

    Forgot password flow

    Role-based access

    Analytics dashboard

    AI-driven routine suggestions

## Author

Aravind A