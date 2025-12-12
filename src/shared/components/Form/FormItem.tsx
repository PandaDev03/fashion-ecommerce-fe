import { ConfigProvider, Form, FormItemProps } from 'antd';
import classNames from 'classnames';
import { memo, ReactElement, ReactNode } from 'react';

type IProps = {
  labelBold?: boolean;
  labelClassName?: string;
  childrenSelected?: boolean;
  spacing?: 'none' | 'default';
  children: ReactElement | ReactNode | FormItemProps['children'];
} & FormItemProps;

const FormItem = ({
  children,
  className,
  labelClassName,
  labelBold = true,
  spacing = 'default',
  childrenSelected = false,
  ...props
}: IProps) => {
  const isSpacing = spacing === 'default';

  const customClass = classNames('w-full', className);
  const customLabelClass = classNames(
    'text-[#3A3A3A]',
    labelBold ? 'font-medium' : '',
    labelClassName
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          marginXXS: isSpacing ? 4 : 0,
          marginLG: isSpacing ? 12 : 0,
          margin: isSpacing ? 16 : 0,
        },
      }}
    >
      <Form.Item
        {...props}
        className={customClass}
        labelCol={{ span: props.label ? 24 : 0 }}
        initialValue={childrenSelected ? 'all' : undefined}
        label={<span className={customLabelClass}>{props.label}</span>}
      >
        {children}
      </Form.Item>
    </ConfigProvider>
  );
};

export default memo(FormItem);
