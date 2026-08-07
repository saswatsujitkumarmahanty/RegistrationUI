export function isTokenExpired(token: string): boolean {
  try {
    const payloadSegment = token.split('.')[1];
    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));

    if (!payload.exp) {
      return true; // no expiry claim at all — treat as invalid rather than assume it's fine
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowInSeconds;
  } catch {
    return true; // malformed/unparseable token — treat as expired, not as "somehow valid"
  }
}