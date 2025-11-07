import { Switch as AntSwitch, ConfigProvider, SwitchProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Switch = ({ className, ...props }: SwitchProps) => {
  const customClass = classNames('', className);

  return (
    <ConfigProvider
      theme={{
        components: {
          Switch: {
            colorPrimary: '#212121',
            colorPrimaryHover: '#212121',
          },
        },
      }}
    >
      <AntSwitch className={customClass} {...props} />
    </ConfigProvider>
  );
};

export default memo(Switch);
