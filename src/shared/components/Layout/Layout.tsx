import { Layout as AntLayout, LayoutProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Layout = ({ className, ...props }: LayoutProps) => {
  const customClassName = classNames(
    'mx-auto max-w-[1920px] bg-white!',
    className
  );

  return <AntLayout className={customClassName} {...props} />;
};

export default memo(Layout);
