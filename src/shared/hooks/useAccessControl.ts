import { shallowEqual } from 'react-redux';
import { useAppSelector } from './useStore';

const useAccessControl = () => {
  const userRole = useAppSelector((state) => state.user.currentUser?.role);
  const userPermissions = useAppSelector(
    (state) => state.user.currentUser?.permissions || [],
    shallowEqual
  );

  const hasPermission = (requiredPermission: string): boolean => {
    return userPermissions.includes(requiredPermission);
  };

  const hasRole = (requiredRole: string): boolean => {
    return userRole === requiredRole;
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  };

  return { hasRole, hasPermission, hasAnyRole };
};

export default useAccessControl;
