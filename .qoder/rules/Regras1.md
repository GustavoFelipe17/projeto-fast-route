---
trigger: manual
---
// RULES
/*
Always respond in Portuguese (pt-BR)

## GENERAL PRINCIPLES

- Always prefer simple solutions.
- Avoid code duplication whenever possible. Before writing new code, check if similar logic already exists.
- Keep code structured and organized.
- Be careful to only make changes that are requested or well understood and directly related to the task.
- When fixing bugs, avoid introducing new patterns or technologies unless existing approaches have been exhausted. If you must introduce a new approach, remove the old implementation to avoid duplicated logic.
- Always write code that accounts for different environments: dev, test, and prod.
- Avoid writing throwaway scripts in source files. If a script is to be used only once, isolate it or run it externally.
- Avoid files with more than 200–300 lines. Refactor when reaching this threshold.
- Mock data should only be used for tests. Never use mocked data in dev or prod environments.
- Never overwrite the .env file without asking and confirming first.

---

## CODE STYLE & ARCHITECTURE

- Use functional components and TypeScript interfaces.
- Use declarative JSX.
- Use function, not const, for components.
- Use Shadcn UI, Radix, and Tailwind Aria for components and styling.
- Use Tailwind CSS and follow mobile-first principles.
- Place static content and interfaces at the bottom of the file.
- Use content variables outside of render functions for static data.
- Minimize use of 'use client', useEffect, and setState. Prefer Server Components (RSC).
- Wrap client components with Suspense and provide fallbacks.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP, define size, and lazy load.

> When a file becomes too long, break it into smaller files.  
> When a function becomes too long, break it into smaller functions.

After writing any code, reflect on scalability and maintainability. Provide a 1–2 paragraph analysis and suggest improvements or next steps.

---

## ERROR HANDLING & VALIDATION

- Model expected errors as return values. Avoid try/catch for expected errors.
  ➤ Use useActionState to manage and return these to the client.
- Use error.tsx and global-error.tsx as error boundaries for unexpected errors.
- Use useActionState with react-hook-form for validation.
- Write services (e.g. services/) with clear, user-friendly error messages, consumable by tanStackQuery.

---

## next-safe-action

- Use next-safe-action for all server actions.
- Define Zod schemas for input validation.
- Always return the ActionResponse type.
- Handle all errors gracefully and consistently.

```ts
'use server'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import type { ActionResponse } from '@/app/actions/actions'

const schema = z.object({
  value: z.string()
})

export const someAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      return { success: true, data: /* result */ }
    } catch (error) {
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      }
    }
  })