export function redirectSystemPath({ path }) {
  if (path?.startsWith('/auth/callback') || path?.startsWith('auth/callback')) {
    return '/login';
  }

  return path;
}
