# Netlify Identity Bookmarks

A minimal example site demonstrating [@netlify/identity](https://www.npmjs.com/package/@netlify/identity) authentication with [Netlify Blobs](https://docs.netlify.com/blobs/overview/) for data persistence.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/identity-demo)

## Features

- Email/password signup and login
- OAuth login (GitHub)
- Protected routes with server-side auth checks
- Password recovery flow
- Bookmark CRUD with Netlify Blobs
- Session hydration and auth callback handling

## Tech Stack

- [TanStack Start](https://tanstack.com/start) + React
- [Tailwind CSS 4](https://tailwindcss.com/)
- [@netlify/identity](https://www.npmjs.com/package/@netlify/identity) — authentication
- [@netlify/blobs](https://docs.netlify.com/blobs/overview/) — data persistence

## Getting Started

### Deploy to Netlify

Click the deploy button above, or fork this repo and connect it to Netlify.

Identity is enabled automatically when you deploy.

### Local Development

```bash
git clone https://github.com/netlify-templates/identity-demo.git
cd identity-demo
npm install
netlify dev
```

> **Note:** Authentication requires a deployed Netlify site. `netlify dev` proxies your site but does not run the Identity backend locally. Deploy a branch preview to test auth flows.

### Enable OAuth Providers

1. Go to **Project configuration > Identity > Registration**
2. Under **External providers**, enable GitHub (or Google, GitLab, etc.)

## Project Structure

```
src/
├── components/
│   └── CallbackHandler.tsx       # Handles OAuth/email/recovery URL hashes
├── lib/
│   ├── auth.ts                    # getServerUser server function
│   ├── bookmarks.ts               # Bookmark CRUD with Netlify Blobs
│   └── identity-context.tsx      # React context for client-side auth state
└── routes/
    ├── __root.tsx                 # Root layout with IdentityProvider + branding
    ├── index.tsx                  # Landing page
    ├── login.tsx                  # Email/password + OAuth login
    ├── signup.tsx                 # Account creation
    ├── bookmarks.tsx              # Protected: bookmark list with add/delete
    ├── forgot-password.tsx        # Password recovery request
    └── reset-password.tsx         # Set new password after recovery
```

## How It Works

### Authentication

- Login and signup happen browser-side via `@netlify/identity`
- `getUser()` runs server-side in route loaders to protect pages
- OAuth and email callbacks are handled by `CallbackHandler` in the root layout
- Full page navigations after auth changes ensure cookies are sent to the server

### Data Storage

- Bookmarks are stored in Netlify Blobs, namespaced by user ID
- Server functions handle all reads and writes via `@netlify/blobs`

## Learn More

- [@netlify/identity README](https://www.npmjs.com/package/@netlify/identity)
- [Netlify Blobs docs](https://docs.netlify.com/blobs/overview/)
- [TanStack Start docs](https://tanstack.com/start/latest/docs/overview)
- [Netlify docs](https://docs.netlify.com/)
