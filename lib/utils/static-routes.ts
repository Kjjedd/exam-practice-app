export function withTrailingSlash(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function buildStaticRoute(
  pathname: string,
  searchParams?: URLSearchParams
): string {
  const normalizedPathname = withTrailingSlash(pathname);
  const queryString = searchParams?.toString() ?? "";

  return queryString.length > 0
    ? `${normalizedPathname}?${queryString}`
    : normalizedPathname;
}
