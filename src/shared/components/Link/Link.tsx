import { memo } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { LinkProps } from 'react-router-dom';

const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <ReactRouterLink className={`text-primary! ${className ?? ''}`} {...props}>
      {children}
    </ReactRouterLink>
  );
};

export default memo(Link);
