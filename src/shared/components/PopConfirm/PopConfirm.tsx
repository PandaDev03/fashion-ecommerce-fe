import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm, PopconfirmProps } from 'antd';
import { memo } from 'react';

const PopConfirm = ({ ...props }: PopconfirmProps) => {
  return (
    <Popconfirm
      okText="Có"
      cancelText="Không"
      description="Bạn có chắc chắn muốn xoá mục này?"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      {...props}
    />
  );
};

export default memo(PopConfirm);
