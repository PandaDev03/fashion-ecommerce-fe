import { Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import routes, { AppRoute } from './routes';

import AdminLayout from '~/layouts/AdminLayout/AdminLayout';
import NotFountPage from '~/pages/public/NotFount/NotFountPage';

import Loading from '~/shared/components/Loading/Loading';
import { PATH } from '~/shared/utils/path';

const transformRoutes = (appRoutes: AppRoute[]): RouteObject[] => {
  return appRoutes.map((route) => {
    const {
      layout: Layout,
      subLayout: SubLayout,
      element: Element,
      isProtected,
      requiredRoles,
      ...rest
    } = route;

    const fallbackUI =
      Layout === AdminLayout ? <Loading /> : <div>Đang tải nội dung...</div>;

    let routeElement = (
      <Suspense fallback={fallbackUI}>
        <Element />
      </Suspense>
    );

    if (SubLayout) routeElement = <SubLayout>{routeElement}</SubLayout>;

    routeElement = <Layout>{routeElement}</Layout>;

    if (isProtected)
      routeElement = <ProtectedRoute>{routeElement}</ProtectedRoute>;

    if (requiredRoles)
      routeElement = (
        <RoleBasedRoute requiredRoles={requiredRoles}>
          {routeElement}
        </RoleBasedRoute>
      );

    return {
      ...rest,
      element: routeElement,
    };
  });
};

export const router = createBrowserRouter([
  ...transformRoutes(routes),
  {
    path: PATH.NOT_FOUND,
    element: <NotFountPage />,
  },
]);

export const navigate = (to: string, options?: { replace?: boolean }) => {
  router.navigate(to, options);
};
