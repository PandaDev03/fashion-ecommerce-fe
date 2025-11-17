import { Checkbox as AntCheckbox, CheckboxProps, ConfigProvider } from 'antd';
import { memo } from 'react';

const Checkbox = ({ ...props }: CheckboxProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#212121',
        },
      }}
    >
      <AntCheckbox {...props} />
    </ConfigProvider>
  );
};

export default memo(Checkbox);
