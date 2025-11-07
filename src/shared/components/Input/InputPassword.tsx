import { ConfigProvider, Input, InputProps } from 'antd';
import { memo } from 'react';

import classNames from 'classnames';

const InputPassword = ({ className, ...props }: InputProps) => {
  const { allowClear = false } = props;
  const customClass = classNames('px-5! py-2!', className);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBg: '#fafafa',
            activeBg: '#fafafa',
          },
        },
      }}
    >
      <Input.Password
        size="middle"
        allowClear={allowClear}
        className={customClass}
        {...props}
      />
    </ConfigProvider>
  );
};

export default memo(InputPassword);
