import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import routes from './routes';

import AdminLayout from '~/layouts/AdminLayout/AdminLayout';
import NotFountPage from '~/pages/public/NotFount/NotFountPage';
import Loading from '~/shared/components/Loading/Loading';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          const Layout = route.layout;
          const SubLayout = route.subLayout;
          const Component = route.element;

          let fallBackUI;
          if (Layout == AdminLayout) fallBackUI = <Loading />;
          else fallBackUI = <div>Đang tải nội dung...</div>;

          let element = (
            <Layout>
              {SubLayout ? (
                <SubLayout>
                  <Suspense fallback={fallBackUI}>
                    <Component />
                  </Suspense>
                </SubLayout>
              ) : (
                <Suspense fallback={fallBackUI}>
                  <Component />
                </Suspense>
              )}
            </Layout>
          );

          if (route.isProtected)
            element = <ProtectedRoute>{element}</ProtectedRoute>;

          if (route.requiredRoles)
            element = (
              <RoleBasedRoute requiredRoles={route.requiredRoles}>
                {element}
              </RoleBasedRoute>
            );

          return <Route key={index} path={route.path} element={element} />;
        })}

        <Route path="*" element={<NotFountPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
