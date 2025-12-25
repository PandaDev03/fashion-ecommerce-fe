import React from 'react';
import { Navigate } from 'react-router-dom';

import useAccessControl from '~/shared/hooks/useAccessControl';
import { useAppSelector } from '~/shared/hooks/useStore';
import { PATH } from '~/shared/utils/path';

interface RoleBasedRouteProps {
  requiredRoles: string[];
  children: React.ReactNode;
}

const RoleBasedRoute = ({ children, requiredRoles }: RoleBasedRouteProps) => {
  const { isInitialized, loading } = useAppSelector((state) => state.user);
  const { hasAnyRole } = useAccessControl();

  if (!isInitialized || loading) return children; // LoadingScreen
  if (!hasAnyRole(requiredRoles)) return <Navigate to={PATH.HOME} replace />;

  return <>{children}</>;
};

export default RoleBasedRoute;
