import { Select as AntSelect, SelectProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Select = ({ className, ...props }: SelectProps) => {
  const customClassName = classNames('h-10!', className);
  return <AntSelect className={customClassName} {...props} />;
};

export default memo(Select);
