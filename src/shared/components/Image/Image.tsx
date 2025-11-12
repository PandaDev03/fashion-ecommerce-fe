import { Image as AntImage, ImageProps } from 'antd';
import { memo } from 'react';

const Image = ({ ...props }: ImageProps) => {
  return <AntImage preview={false} {...props} />;
};

export default memo(Image);
