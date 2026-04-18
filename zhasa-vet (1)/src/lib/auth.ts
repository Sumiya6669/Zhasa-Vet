export const ADMIN_EMAIL = 'admin@zhasavet.kz';
export const ADMIN_LOGIN_ALIAS = 'admin-zhasavet';

export function normalizeAuthIdentifier(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized === ADMIN_LOGIN_ALIAS ? ADMIN_EMAIL : normalized;
}

export function isAdminEmail(email?: string | null) {
  return (email ?? '').trim().toLowerCase() === ADMIN_EMAIL;
}
