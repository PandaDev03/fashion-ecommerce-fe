import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

interface QuantitySelectorProps {
  quantity: number;
  className?: string;
  size?: 'small' | 'middle';
  onDecrease: () => void;
  onIncrease: () => void;
}

const QuantitySelector = ({
  quantity,
  className,
  size = 'middle',
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) => {
  const customClassName = classNames(
    'w-max rounded-md border border-gray-100 overflow-hidden h-11 md:h-12',
    className
  );

  return (
    <Flex align="center" className={customClassName}>
      <button
        className="flex items-center justify-center shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-10 md:w-12 text-heading hover:text-white hover:bg-primary cursor-pointer"
        onClick={onDecrease}
      >
        <MinusOutlined />
      </button>
      <span className="font-semibold flex items-center justify-center h-full border-l border-r border-gray-100 transition-colors duration-250 ease-in-out cursor-default shrink-0 text-base text-heading w-12 md:w-20 xl:w-24">
        {quantity}
      </span>
      <button
        className="flex items-center justify-center shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-10 md:w-12 text-heading hover:text-white hover:bg-primary cursor-pointer"
        onClick={onIncrease}
      >
        <PlusOutlined />
      </button>
    </Flex>
  );
};

export default memo(QuantitySelector);
