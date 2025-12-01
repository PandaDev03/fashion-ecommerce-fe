import Lottie, { LottieComponentProps } from 'lottie-react';
import { memo } from 'react';

const LordIcon = ({ ...props }: LottieComponentProps) => {
  return <Lottie {...props} />;
};

export default memo(LordIcon);
