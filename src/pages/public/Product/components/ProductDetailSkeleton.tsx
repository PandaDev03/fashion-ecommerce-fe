import { Skeleton, Flex, Divider } from 'antd';

const ProductDetailSkeleton = () => {
  return (
    <>
      <Flex className="md:col-span-4 gap-4 max-lg:flex-col-reverse h-full">
        <Flex className="gap-1 shrink-0 lg:flex-col lg:gap-3">
          {[...Array(4)].map((_, index) => (
            <Skeleton.Image
              key={index}
              active
              className="w-16! h-20! md:w-20! md:h-24! rounded"
            />
          ))}
        </Flex>

        <Skeleton.Image
          active
          className="flex-1! w-full! rounded-lg"
          style={{ width: '100%', height: '500px' }}
        />
      </Flex>

      <div className="col-span-5 pt-8 lg:pt-0">
        <Skeleton.Input
          active
          size="large"
          className="w-3/4! mb-4!"
          style={{ height: '32px' }}
        />

        <Skeleton
          active
          title={false}
          className="mb-5!"
          paragraph={{ rows: 3 }}
        />

        <Skeleton.Input
          active
          size="large"
          className="w-32! mb-5!"
          style={{ height: '40px' }}
        />

        <Divider />

        <div className="mb-4">
          <Skeleton.Input
            active
            size="small"
            className="w-20! mb-2!"
            style={{ height: '24px' }}
          />
          <Flex className="gap-x-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton.Avatar key={index} active size={44} shape="circle" />
            ))}
          </Flex>
        </div>

        <div className="mb-4">
          <Skeleton.Input
            active
            size="small"
            className="w-24! mb-2!"
            style={{ height: '24px' }}
          />
          <Flex className="gap-x-3">
            {[...Array(4)].map((_, index) => (
              <Skeleton.Button
                key={index}
                active
                size="large"
                shape="square"
                style={{ width: '44px', height: '44px' }}
              />
            ))}
          </Flex>
        </div>

        <div className="pt-2 md:pt-4">
          <Flex align="center" className="w-full mb-4! gap-x-3 sm:gap-x-4">
            <Skeleton.Button
              active
              size="large"
              className="shrink-0"
              style={{ width: '120px', height: '44px' }}
            />
            <Skeleton.Button
              active
              block
              size="large"
              style={{ height: '44px' }}
            />
          </Flex>
        </div>

        <Divider />

        <Flex vertical className="gap-y-3 mb-5!">
          <Skeleton.Input
            active
            size="small"
            className="w-48!"
            style={{ height: '20px' }}
          />
          <Skeleton.Input
            active
            size="small"
            className="w-40!"
            style={{ height: '20px' }}
          />
        </Flex>

        <Divider />

        <Flex vertical className="gap-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton.Input
              key={index}
              active
              size="large"
              className="w-full!"
              style={{ height: '48px' }}
            />
          ))}
        </Flex>
      </div>
    </>
  );
};

export default ProductDetailSkeleton;
