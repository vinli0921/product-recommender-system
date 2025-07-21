import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '../contexts/AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
        <TanStackRouterDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
