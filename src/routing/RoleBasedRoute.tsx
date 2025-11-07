import React from 'react';
import { Navigate } from 'react-router-dom';

import { PATH } from '~/shared/utils/path';
import { useAccessControl } from '../shared/hooks/useAccessControl';

interface RoleBasedRouteProps {
  requiredRoles: string[];
  children: React.ReactNode;
}

const RoleBasedRoute = ({ children, requiredRoles }: RoleBasedRouteProps) => {
  const { hasAnyRole } = useAccessControl();

  if (!hasAnyRole(requiredRoles)) return <Navigate to={PATH.HOME} replace />;

  return <>{children}</>;
};

export default RoleBasedRoute;
