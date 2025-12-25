import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { orderApi } from '~/features/order/api/orderApi';
import { IMigrateOrder } from '~/features/order/types/order';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useAppSelector } from '~/shared/hooks/useStore';
import { clearGuestUserId, getGuestUserId } from '~/shared/utils/function';

export const useOrderMigration = () => {
  const toast = useToast();

  const [hasMigrated, setHasMigrated] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);

  const { mutate: migrateOrder } = useMutation({
    mutationFn: (params: IMigrateOrder) => orderApi.migrateOrder(params),
    onSuccess: (response) => {
      clearGuestUserId();
      setHasMigrated(true);

      console.log('Chuyển đơn hàng thành công', response);
      toast.success('Đã chuyển đơn hàng của bạn');
    },
  });

  useEffect(() => {
    const guestUserId = getGuestUserId();

    if (currentUser?.id && guestUserId && !hasMigrated) {
      const params: IMigrateOrder = {
        fromUserId: guestUserId,
        toUserId: currentUser.id,
      };

      migrateOrder(params);
    }
  }, [currentUser?.id, hasMigrated]);

  useEffect(() => {
    if (!currentUser?.id) setHasMigrated(false);
  }, [currentUser?.id]);
};
