import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Page } from '@patternfly/react-core';
import { Masthead } from '../../components/masthead';

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ location }) => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }

    // Basic token validation - check if it's expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href,
          },
        });
      }
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <Page masthead={<Masthead />}>
      <Outlet />
    </Page>
  );
}
