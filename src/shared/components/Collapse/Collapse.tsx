import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse as AntCollapse, CollapseProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

import './Collapse.scss';

const Collapse = ({ className, items, ...props }: CollapseProps) => {
  const customClassName = classNames('w-full', className);

  const customItems: CollapseProps['items'] = items?.map((item) => ({
    ...item,
    label: (
      <p className="text-sm font-semibold leading-relaxed text-heading ltr:pr-2 rtl:pl-2 md:text-base lg:text-lg">
        {item?.label}
      </p>
    ),
  }));

  const handleExpandIcon: CollapseProps['expandIcon'] = (panelProps) => {
    const { isActive } = panelProps;

    return isActive ? <MinusOutlined /> : <PlusOutlined />;
  };

  return (
    <AntCollapse
      items={customItems}
      expandIconPosition="end"
      className={customClassName}
      expandIcon={handleExpandIcon}
      {...props}
    />
  );
};

export default memo(Collapse);
