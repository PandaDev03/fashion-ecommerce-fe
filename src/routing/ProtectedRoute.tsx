import React from 'react';
import { Navigate } from 'react-router-dom';

import { PATH } from '~/shared/utils/path';
import { useAppSelector } from '../shared/hooks/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const isAuthenticated = !!Object.keys(currentUser)?.length;

  if (!isAuthenticated) return <Navigate to={PATH.HOME} replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
