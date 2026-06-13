const UNAUTHORIZED_EVENT = 'tepkinet:unauthorized'

export function emitUnauthorized() {
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
}

export function subscribeUnauthorized(listener) {
  window.addEventListener(UNAUTHORIZED_EVENT, listener)
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, listener)
}
