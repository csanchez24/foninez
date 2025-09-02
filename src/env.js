import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string().url(),
    FCF_IAM_API_URL: z.string().url(),
    FCF_IAM_CLIENT_ID: z.string().min(1), // app client id
    FCF_IAM_CLIENT_SECRET: z.string().min(1), // app secret
    FCF_IAM_APP_URL: z.string().url(), // app domain
    FCF_IAM_APP_CALLBACK_URL: z.string().url(), // the callback uri e.g /api/auth/callback where we have the logic to exchange code for token
    FCF_IAM_POST_LOGIN_REDIRECT_URL: z.string().url(), // where you want users to be redirected to after obtaining token
    FCF_IAM_POST_LOGOUT_REDIRECT_URL: z.string().url(), // where you want users to be redirected to after logging out. Make sure this URL is under your allowed logout redirect URLs.
    FCF_IAM_ISSUER_URL: z.string().url(),
    COMFENALCO_URL: z.string().url(),
    COMFENALCO_APP_LLAVE: z.string(),
    COMFENALCO_APP_APPTOKEN: z.string(),
    COMFENALCO_APP_IDENTIFICADOR: z.string(),
    COMFENALCO_APP_CLAVE: z.string(),
    COMFENALCO_EMAIL_NOTIFICATION: z.string(),
    COMFENALCO_BUCKET: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    FCF_IAM_API_URL: process.env.FCF_IAM_API_URL,
    FCF_IAM_CLIENT_ID: process.env.FCF_IAM_CLIENT_ID,
    FCF_IAM_CLIENT_SECRET: process.env.FCF_IAM_CLIENT_SECRET,
    FCF_IAM_APP_URL: process.env.FCF_IAM_APP_URL,
    FCF_IAM_APP_CALLBACK_URL: process.env.FCF_IAM_APP_CALLBACK_URL,
    FCF_IAM_POST_LOGIN_REDIRECT_URL: process.env.FCF_IAM_POST_LOGIN_REDIRECT_URL,
    FCF_IAM_POST_LOGOUT_REDIRECT_URL: process.env.FCF_IAM_POST_LOGOUT_REDIRECT_URL,
    FCF_IAM_ISSUER_URL: process.env.FCF_IAM_ISSUER_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    COMFENALCO_URL: process.env.COMFENALCO_URL,
    COMFENALCO_APP_LLAVE: process.env.COMFENALCO_APP_LLAVE,
    COMFENALCO_APP_APPTOKEN: process.env.COMFENALCO_APP_APPTOKEN,
    COMFENALCO_APP_IDENTIFICADOR: process.env.COMFENALCO_APP_IDENTIFICADOR,
    COMFENALCO_APP_CLAVE: process.env.COMFENALCO_APP_CLAVE,
    COMFENALCO_EMAIL_NOTIFICATION: process.env.COMFENALCO_EMAIL_NOTIFICATION,
    COMFENALCO_BUCKET: process.env.COMFENALCO_BUCKET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
