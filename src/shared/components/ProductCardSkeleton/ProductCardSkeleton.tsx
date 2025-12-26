import { Skeleton } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

interface ProductCardSkeletonProps {
  count?: number;
  className?: string;
}

const ProductCardSkeleton = ({
  count = 1,
  className,
}: ProductCardSkeletonProps) => {
  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={classNames(
        'bg-white rounded-lg overflow-hidden group cursor-pointer',
        className
      )}
    >
      <div className="relative aspect-3/4 bg-gray-100 overflow-hidden">
        <Skeleton.Image
          active
          className="w-full! h-full!"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="pt-3 space-y-2">
        <Skeleton
          active
          title={false}
          className="mb-2!"
          paragraph={{ rows: 2, width: ['100%', '80%'] }}
        />

        <Skeleton
          active
          title={false}
          className="mb-2!"
          paragraph={{ rows: 1, width: '60%' }}
        />

        <Skeleton active paragraph={{ rows: 1, width: '40%' }} title={false} />
      </div>
    </div>
  ));
};

export default memo(ProductCardSkeleton);
