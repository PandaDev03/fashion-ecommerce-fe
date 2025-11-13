import { Input as AntInput, ConfigProvider, InputProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Input = ({ className, ...props }: InputProps) => {
  const customClass = classNames('w-full px-5! py-2!', className);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: '#212121',
            activeBorderColor: '#212121',
            activeShadow: '0 0 0 2px rgba(44,44,45,0.1)',
          },
        },
      }}
    >
      <AntInput className={customClass} {...props} />
    </ConfigProvider>
  );
};

export default memo(Input);
