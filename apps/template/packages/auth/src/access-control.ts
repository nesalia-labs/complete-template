import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc, memberAc, ownerAc } from 'better-auth/plugins/organization/access'

/**
 * RBAC access control matrix. Defines what each statement is and which
 * roles can perform it. The org plugin reads this via the `ac` + `roles`
 * options in `auth.ts`.
 *
 * @see https://www.better-auth.com/docs/plugins/organization#access-control
 *
 * @remarks
 * We start from Better Auth's default statements (member, invite, remove,
 * update, delete for the org + member + invitation entities) and add our
 * own statements for the business features (project, billing, etc.) as
 * we add them.
 *
 * Roles:
 *   - **owner**: every statement. The creator of the org. Cannot be
 *     removed except by transferring ownership first.
 *   - **admin**: every statement except org deletion and ownership
 *     transfer. Manages members, invites, settings, and most resources.
 *   - **member**: read-only on org info; can invite and update their
 *     own member record. No write access to resources.
 *   - **billing**: read-only on org info; full access to billing
 *     statements (read invoices, update payment method, etc.).
 */
const statement = {
  ...defaultStatements,
  project: ['create', 'read', 'update', 'delete'],
  billing: ['read', 'update'],
} as const

export const ac = createAccessControl(statement)

export const owner = ac.newRole({
  ...ownerAc.statements,
  project: ['create', 'read', 'update', 'delete'],
  billing: ['read', 'update'],
})

export const admin = ac.newRole({
  ...adminAc.statements,
  project: ['create', 'read', 'update', 'delete'],
  billing: ['read'],
})

export const member = ac.newRole({
  ...memberAc.statements,
  project: ['read'],
})

export const billing = ac.newRole({
  ...memberAc.statements,
  billing: ['read', 'update'],
})

/**
 * Re-export of the statements for consumers (procedures, the AuthContext
 * type, etc.) that need to check permissions.
 */
export const STATEMENTS = statement
