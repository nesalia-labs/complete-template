/**
 * The `publicProcedure` builder — no auth. Use for sign-up, sign-in,
 * health probes, and HMAC-authenticated webhooks (Stripe webhooks etc.).
 *
 * The choice between `publicProcedure` and `authorized` is at the type
 * level: a `publicProcedure` handler cannot accidentally read
 * `context.session` because it isn't in the context.
 */
import { base } from './context'

export const publicProcedure = base