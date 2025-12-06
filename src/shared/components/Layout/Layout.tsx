import { LoadingOutlined } from '@ant-design/icons';
import { Layout as AntLayout, LayoutProps, Spin } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

interface ILayoutProps extends LayoutProps {
  loading?: boolean;
}

const Layout = memo(
  ({ className, loading = false, ...props }: ILayoutProps) => {
    const customClassName = classNames('mx-auto max-w-[1920px]', className);

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
  }
);

const Content = memo(({ className, ...props }: LayoutProps) => {
  const customClassName = classNames('bg-white py-4 px-5', className);

  return <AntLayout.Content className={customClassName} {...props} />;
});

export { Content, Layout };
