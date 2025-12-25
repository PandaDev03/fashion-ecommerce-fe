import { ConfigProvider, Input, InputProps } from 'antd';
import { memo } from 'react';

const InputPassword = ({ className, ...props }: InputProps) => {
  const { allowClear = false } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBg: '#fafafa',
            activeBg: '#fafafa',
            hoverBorderColor: '#212121',
            activeBorderColor: '#212121',
            activeShadow: '0 0 0 2px rgba(44,44,45,0.1)',
          },
        },
      }}
    >
      <Input.Password size="large" allowClear={allowClear} {...props} />
    </ConfigProvider>
  );
};

export default memo(InputPassword);
