import { Select as AntSelect, SelectProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';
import { removeAccents } from '~/shared/utils/function';

const Select = ({ className, showSearch = true, ...props }: SelectProps) => {
  const customClassName = classNames(
    'h-10! [&>.ant-select-selector]:rounded-[8px]!',
    className
  );

  return (
    <AntSelect
      {...props}
      className={customClassName}
      optionFilterProp="label"
      showSearch={
        (showSearch
          ? {
              filterOption: (input: string, option: any) => {
                const label = option?.label ?? option?.children ?? '';
                const displayLabel = String(label);

                const searchStr = removeAccents(input);
                const targetStr = removeAccents(displayLabel);

                return targetStr.includes(searchStr);
              },
              filterSort: (optionA: any, optionB: any) => {
                const labelA = String(
                  optionA?.label ?? optionA?.children ?? ''
                );
                const labelB = String(
                  optionB?.label ?? optionB?.children ?? ''
                );
                return labelA.toLowerCase().localeCompare(labelB.toLowerCase());
              },
            }
          : false) as any
      }
    />
  );
};

export default memo(Select);
