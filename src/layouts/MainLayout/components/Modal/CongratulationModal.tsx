import { ModalProps, Space } from 'antd';

import Confetti_Icon from '~/assets/animations/confetti.json';
import LordIcon from '~/shared/components/Icon/LordIcon';
import Modal from '~/shared/components/Modal/Modal';

interface IProps extends ModalProps {
  icon?: any;
}

const CongratulationModal = ({
  children,
  icon = Confetti_Icon,
  ...props
}: IProps) => {
  return (
    <Modal closable={false} {...props}>
      <Space
        size="small"
        align="center"
        direction="vertical"
        className="w-full"
      >
        <LordIcon animationData={icon} className="h-40 w-40" />
        {children}
      </Space>
    </Modal>
  );
};

export default CongratulationModal;
