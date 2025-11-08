import { Drawer as AntDrawer, DrawerProps } from 'antd';
import { memo } from 'react';

const Drawer = ({ classNames, ...props }: DrawerProps) => {
  const customClassNames: DrawerProps['classNames'] = {
    header: '[&>*:first-child]:flex-row-reverse',
    ...classNames,
  };

  return <AntDrawer classNames={customClassNames} {...props} />;
};

export default memo(Drawer);
