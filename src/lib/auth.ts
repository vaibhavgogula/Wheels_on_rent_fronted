import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: 'ROLE_USER' | 'ROLE_OWNER' | 'ROLE_ADMIN';
  exp: number;
}

export function getUserRole(): 'renter' | 'owner' | 'admin' | null {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check for token expiry
    if (decoded.exp * 1000 < Date.now()) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return null;
    }

    const role = decoded.role.replace('ROLE_', '');
    if (role === 'RENTER') return 'renter';
    if (role === 'OWNER') return 'owner';
    if (role === 'ADMIN') return 'admin';

    return null;
  } catch {
    // If token is malformed, remove it
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return null;
  }
}
