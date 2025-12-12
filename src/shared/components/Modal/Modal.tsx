import { SaveOutlined } from '@ant-design/icons';
import { Modal as AntModal, Flex, ModalProps } from 'antd';
import { memo } from 'react';

import Button from '../Button/Button';

const Modal = ({
  footer,
  okText,
  loading,
  cancelText,
  classNames,
  onOk,
  onCancel,
  ...props
}: ModalProps) => {
  const customClassNames: ModalProps['classNames'] = {
    content: 'p-0!',
    header: 'py-3! px-6! m-0! border-b! border-gray-200!',
    body: 'py-5! px-6!',
    footer: footer !== false ? 'py-3! px-6! mt-0!' : 'p-0!',
    ...classNames,
  };

  return (
    <AntModal
      footer={
        footer ?? (
          <Flex align="center" justify="end" className="gap-x-2">
            <Button
              loading={loading}
              displayType="outlined"
              title={cancelText ?? 'Hủy'}
              onClick={onCancel}
            />
            <Button
              loading={loading}
              iconBefore={<SaveOutlined />}
              title={okText ?? 'Xác nhận'}
              onClick={onOk}
            />
          </Flex>
        )
      }
      classNames={customClassNames}
      onCancel={onCancel}
      {...props}
    />
  );
};

export default memo(Modal);
