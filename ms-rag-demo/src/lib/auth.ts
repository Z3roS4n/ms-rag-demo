import {
  betterAuth
} from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from './prisma';

const auth = betterAuth({
    database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  },

  /** if no database is provided, the user data will be stored in memory.
   * Make sure to provide a database to persist user data **/
});

export { auth };