import { memo, RefObject, useRef } from 'react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperComponent, SwiperProps } from 'swiper/react';
import { Swiper as SwiperTypes } from 'swiper/types';

import 'swiper/css';
import 'swiper/css/bundle';

import SwiperNavButton from './SwiperNavButton';

interface Swiper extends SwiperProps {
  ref?: RefObject<SwiperTypes | null>;
  customNavButton?: boolean;
}

const Swiper = ({
  ref,
  modules,
  children,
  customNavButton = true,
  ...props
}: Swiper) => {
  const swiperRef = useRef<SwiperTypes>(null);

  const handleSwiperInit = (swiper: SwiperTypes) => {
    swiperRef.current = swiper;
  };

  return (
    <div className="relative">
      <SwiperComponent
        onSwiper={handleSwiperInit}
        modules={[Navigation, Pagination, A11y, Autoplay]}
        {...props}
      >
        {children}
      </SwiperComponent>
      {customNavButton && <SwiperNavButton ref={swiperRef} />}
    </div>
  );
};

export type { SwiperTypes };
export default memo(Swiper);
