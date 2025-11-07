import { Flex, Spin } from 'antd';
import { memo } from 'react';

const Loading = () => {
  return (
    <Flex
      vertical
      gap={32}
      align="center"
      justify="center"
      className="min-h-screen mt-auto bg-gray-100"
    >
      <Flex vertical align="center" gap={16}>
        <p className="font-semibold">
          Đang xử lý... Vui lòng đợi trong giây lát
        </p>
      </Flex>
      <Spin size="large" />
    </Flex>
  );
};

export default memo(Loading);
