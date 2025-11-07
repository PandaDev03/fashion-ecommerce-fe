import { useAppSelector } from './useStore';

export const useAccessControl = () => {
  const userRole = useAppSelector((state) => state.user.currentUser?.role);
  const userPermissions = useAppSelector(
    (state) => state.user.currentUser?.permissions || []
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
