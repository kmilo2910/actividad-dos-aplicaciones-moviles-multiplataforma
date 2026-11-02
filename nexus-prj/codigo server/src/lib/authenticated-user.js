import { auth0 } from '@/lib/auth0';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;
const jwks = domain ? createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`)) : null;

async function userFromBearer(request) {
  const authorization = request.headers.get('authorization') || '';
  if (!authorization.startsWith('Bearer ') || !jwks || !audience) return null;
  const token = authorization.slice('Bearer '.length).trim();
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://${domain}/`,
      audience,
    });
    let profile = {
      sub: payload.sub,
      name: payload.name || payload.nickname || payload.email,
      email: payload.email,
      picture: payload.picture,
    };

    if (!profile.email && payload.sub) {
      const response = await fetch(`https://${domain}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (response.ok) profile = { ...profile, ...(await response.json()) };
    }
    return profile.sub ? profile : null;
  } catch {
    return null;
  }
}

export async function authenticatedUser(request) {
  const session = await auth0.getSession();
  if (session?.user?.email) return session.user;
  return userFromBearer(request);
}
