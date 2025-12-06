import { Checkbox as AntCheckbox, CheckboxProps, ConfigProvider } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import classNames from 'classnames';
import { memo } from 'react';

const Checkbox = memo(({ className, ...props }: CheckboxProps) => {
  const customClassName = classNames(
    '[&>.ant-checkbox-label]:w-full',
    className
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#212121',
        },
      }}
    >
      <AntCheckbox className={customClassName} {...props} />
    </ConfigProvider>
  );
});

const CheckboxGroup = memo(({ ...props }: CheckboxGroupProps) => {
  return <AntCheckbox.Group {...props} />;
});

export { Checkbox, CheckboxGroup };
