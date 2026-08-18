# StudyFlow Authentication setup

Authentication was added without introducing a new npm dependency.

## Required environment variable

Add this to the project's `.env.local` (do not commit it):

```env
AUTH_SECRET=replace-this-with-a-random-secret-at-least-32-characters-long
```

The existing `MONGODB_URI` and optional `MONGODB_DB` remain unchanged.

## Added routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `/login`
- `/register`

The session is stored in an HttpOnly cookie. Passwords are hashed with Node's built-in `scrypt`.

## Existing topics

Every topic is private to its authenticated owner via `ownerId`. Existing legacy topics without an `ownerId` are migrated once to the currently authenticated account when login occurs, so the original dataset becomes that account's data. Newly registered users start with an empty workspace and can only access topics whose `ownerId` matches their authenticated user ID. Delete/update operations never accept a client-supplied user ID.

For production, use a long random `AUTH_SECRET`, enable HTTPS, and keep secrets outside source control.
