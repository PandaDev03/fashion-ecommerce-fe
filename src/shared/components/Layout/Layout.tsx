import { LoadingOutlined } from '@ant-design/icons';
import { Layout as AntLayout, LayoutProps, Spin } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

interface ILayoutProps extends LayoutProps {
  loading?: boolean;
}

const Layout = ({ className, loading = false, ...props }: ILayoutProps) => {
  const customClassName = classNames(
    className,
    'mx-auto max-w-[1920px] bg-white!'
  );

  return (
    <>
      <Spin
        fullscreen
        size="large"
        spinning={loading}
        rootClassName="z-[2000]!"
        indicator={<LoadingOutlined spin />}
      />
      <AntLayout className={customClassName} {...props} />
    </>
  );
};

export default memo(Layout);
