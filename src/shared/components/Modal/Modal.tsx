import { Modal as AntModal, ModalProps } from 'antd';
import { memo } from 'react';

const Modal = ({ footer, ...props }: ModalProps) => {
  return <AntModal footer={footer ?? <></>} {...props} />;
};

export default memo(Modal);
