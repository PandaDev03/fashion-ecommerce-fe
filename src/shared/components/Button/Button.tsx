import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import classNames from 'classnames/bind';
import { ReactNode, memo } from 'react';

import styles from './Button.module.scss';

type ButtonBorderType = 'solid' | 'dashed';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type DisplayType =
  | 'outlined'
  | 'error'
  | 'approve'
  | 'primary'
  | 'text'
  | 'dashed';

export interface ButtonProps {
  title: ReactNode;
  type?: ButtonType;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  displayType?: DisplayType;
  borderType?: ButtonBorderType;
  onClick?: ButtonClickHandler;
  onMouseEnter?: ButtonClickHandler;
  onMouseLeave?: ButtonClickHandler;
}

const cx = classNames.bind(styles);

const Button = ({
  title,
  disabled,
  iconBefore,
  iconAfter,
  className = '',
  type = 'button',
  borderType = 'solid',
  displayType = 'primary',
  loading = false,
  ...props
}: ButtonProps) => {
  const classes = cx('button', 'rounded-md transition duration-300', {
    [className]: className,
    [borderType]: borderType,
    [displayType]: displayType,
  });

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      <div className="flex items-center gap-3">
        {loading && displayType === 'primary' ? (
          <Spin indicator={<LoadingOutlined />} />
        ) : (
          iconBefore
        )}
        <span className="w-max">{title}</span>
        {iconAfter}
      </div>
    </button>
  );
};

export default memo(Button);
