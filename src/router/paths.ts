/** Canonical local route shared by navigation, lookup, and generated metadata. */
export function normalizePath(path: string): string {
  let pathname = new URL(path, 'https://lcpu.dev').pathname
  try {
    pathname = decodeURI(pathname)
  } catch {
    // Keep malformed escapes unmatched instead of crashing the entire application.
  }
  pathname = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '')
  return pathname || '/'
}

export function getHash(path: string): string {
  const hash = new URL(path, 'https://lcpu.dev').hash.slice(1)
  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
  }
}

export function canonicalPath(path: string): string {
  const pathname = normalizePath(path)
  return pathname === '/' || pathname.endsWith('.html') ? pathname : `${pathname}/`
}
