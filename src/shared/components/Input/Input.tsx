import { Input as AntInput, InputProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

const Input = ({ className, ...props }: InputProps) => {
  const customClass = classNames('px-5! py-2!', className);

  return <AntInput className={customClass} {...props} />;
};

export default memo(Input);
