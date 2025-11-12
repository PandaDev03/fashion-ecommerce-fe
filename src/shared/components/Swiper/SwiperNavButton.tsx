import classNames from 'classnames';
import { memo, RefObject } from 'react';
import { Swiper as SwiperTypes } from 'swiper/types';

import { ArrowLeft, ArrowRight } from '~/assets/svg';

interface SwiperNavButton {
  ref: RefObject<SwiperTypes | null>;
}

const SwiperNavButton = ({ ref }: SwiperNavButton) => {
  const navBtnClassName =
    'absolute w-7 h-7 lg:w-8 lg:h-8 text-sm md:text-base lg:text-lg flex items-center justify-center rounded-full bg-white top-[30%] translate-y-1/2 transition duration-250 hover:bg-gray-900 hover:[&>svg]:fill-white focus:outline-none transform xl:w-10 xl:h-10 3xl:w-12 3xl:h-12 3xl:text-2xl cursor-pointer z-20';

  const goToNextSlide = () => {
    if (ref.current) ref.current?.slideNext();
  };

  const goToPrevSlide = () => {
    if (ref.current) ref.current?.slidePrev();
  };

  return (
    <>
      <button
        style={{
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
        }}
        className={classNames('left-0 -translate-x-1/2 ', navBtnClassName)}
        onClick={() => goToPrevSlide()}
      >
        <ArrowLeft />
      </button>
      <button
        style={{
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
        }}
        className={classNames('right-0 translate-x-1/2 ', navBtnClassName)}
        onClick={() => goToNextSlide()}
      >
        <ArrowRight />
      </button>
    </>
  );
};

export default memo(SwiperNavButton);
