export function withTrailingSlash(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function toStaticExportPath(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }

  const normalizedPathname = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  return `${normalizedPathname}/index.html`;
}

export function buildStaticRoute(
  pathname: string,
  searchParams?: URLSearchParams
): string {
  const normalizedPathname = toStaticExportPath(pathname);
  const queryString = searchParams?.toString() ?? "";

  return queryString.length > 0
    ? `${normalizedPathname}?${queryString}`
    : normalizedPathname;
}
