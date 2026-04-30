export const ROOT_DOMAIN = "triadsolutions.se"
export const MARKETING_SUBDOMAIN = "servera"

export const RESERVED_SUBDOMAINS = new Set<string>([
  "www",
  "admin",
  "api",
  "app",
  "auth",
  "login",
  "register",
  "signup",
  "mail",
  "smtp",
  "ftp",
  "ns1",
  "ns2",
  "static",
  "assets",
  "cdn",
  "blog",
  "docs",
  "help",
  "support",
  "status",
  "dashboard",
  MARKETING_SUBDOMAIN,
])

export function extractSubdomainFromHost(host: string | null | undefined): string | null {
  if (!host) return null
  const hostname = host.split(":")[0].toLowerCase()
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) return null
  const sub = hostname.slice(0, -(ROOT_DOMAIN.length + 1))
  if (!sub || sub.includes(".")) return null
  return sub
}

export function isTenantSubdomain(sub: string | null | undefined): sub is string {
  return !!sub && !RESERVED_SUBDOMAINS.has(sub)
}

const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export function isValidTenantSubdomain(sub: string): boolean {
  if (!SUBDOMAIN_PATTERN.test(sub)) return false
  if (RESERVED_SUBDOMAINS.has(sub)) return false
  return true
}

export function tenantUrl(subdomain: string, path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `https://${subdomain}.${ROOT_DOMAIN}${cleanPath}`
}

export function marketingUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `https://${MARKETING_SUBDOMAIN}.${ROOT_DOMAIN}${cleanPath}`
}

export function cookieDomainForHost(host: string | null | undefined): string | undefined {
  if (!host) return undefined
  const hostname = host.split(":")[0].toLowerCase()
  if (hostname === ROOT_DOMAIN || hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return `.${ROOT_DOMAIN}`
  }
  return undefined
}
