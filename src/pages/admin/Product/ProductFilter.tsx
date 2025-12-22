import { Dropdown, FormInstance } from 'antd';
import { Dispatch, memo, SetStateAction } from 'react';
import { FilterOutlined } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';

interface ProductFilterProps {
  open: boolean;
  data: any[];
  form: FormInstance;
  onCancel: () => void;
  onFinish: (values: any) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ProductFilter = ({
  open,
  form,
  data,
  onFinish,
  onCancel,
  setIsOpen,
}: ProductFilterProps) => {
  return (
    <Dropdown
      open={open}
      menu={{ items: [] }}
      trigger={['click']}
      placement="bottomRight"
      onOpenChange={(open) => setIsOpen(open)}
    >
      <Button
        title="Lọc"
        displayType="outlined"
        iconBefore={<FilterOutlined />}
        onClick={() => setIsOpen(!open)}
      />
    </Dropdown>
  );
};

export default memo(ProductFilter);
