import dotenv from 'dotenv';
import { createClerkClient } from '@clerk/backend';

dotenv.config({
  path: `.env.${process.env.NODE_ENV ?? 'development'}`,
});

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});