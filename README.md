# Study Progress Next.js App

This project is a study notes manager for developers and students. It stores each topic as a single notes document with theory and code together in a clean, grouped workflow.

## Features

- Add study topics with grouped categories and notes
- Keep theory and code together in one notes document per topic
- Review notes in a dedicated all-notes view and topic detail panel
- Store topic data in MongoDB Atlas through Next.js API routes
- MVC-style backend separation with models and controllers

## Setup

1. Create a `.env.local` file in the project root.
2. Add your MongoDB Atlas connection settings:

```env
MONGODB_URI="your-mongodb-connection-string"
MONGODB_DB=studyProgress
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy this app to Vercel and add the same environment variables in the Vercel project settings:

- `MONGODB_URI`
- `MONGODB_DB`

## Project structure

- `src/app` — app router pages, layouts, and API routes
- `src/components` — reusable UI components
- `src/controllers` — backend logic and validation
- `src/models` — MongoDB data access
- `src/lib` — shared utilities and MongoDB connection

## Notes

The app requires `MONGODB_URI` to connect to MongoDB Atlas. If this environment variable is missing, the API routes will return a clear error message.
