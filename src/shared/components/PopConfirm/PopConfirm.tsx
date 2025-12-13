import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm, PopconfirmProps } from 'antd';
import { memo } from 'react';

const PopConfirm = ({ classNames, ...props }: PopconfirmProps) => {
  const customClassNames: PopconfirmProps['classNames'] = {
    body: 'max-w-[500px]!',
    ...classNames,
  };

  return (
    <Popconfirm
      okText="Có"
      cancelText="Không"
      classNames={customClassNames}
      description="Bạn có chắc chắn muốn xoá mục này?"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      {...props}
    />
  );
};

export default memo(PopConfirm);
