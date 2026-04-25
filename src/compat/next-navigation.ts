/**
 * Compatibility layer: next/navigation -> TanStack Router
 */
import { useRouter as useTanStackRouter } from "@tanstack/react-router";

export function usePathname(): string {
  const router = useTanStackRouter();
  return router.state.location.pathname;
}

export function useRouter() {
  const router = useTanStackRouter();
  return {
    push: (href: string) => router.navigate({ to: href }),
    replace: (href: string) => router.navigate({ to: href, replace: true }),
    back: () => router.history.back(),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
}

export function useSearchParams(): URLSearchParams {
  const router = useTanStackRouter();
  return new URLSearchParams(router.state.location.search);
}
