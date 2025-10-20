/**
 * Get cookie value by name (client-side only)
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

/**
 * Set cookie (client-side only)
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (typeof document === 'undefined') return;

  const {
    maxAge = 60 * 60 * 24 * 7, // 7 days default
    path = '/',
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax',
  } = options;

  let cookie = `${name}=${value}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
  if (secure) cookie += '; secure';

  document.cookie = cookie;
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string): void {
  setCookie(name, '', { maxAge: 0 });
}
