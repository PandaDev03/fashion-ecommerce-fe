import { Divider, Dropdown, DropDownProps, Flex, FormInstance } from 'antd';
import { Dispatch, memo, SetStateAction } from 'react';

import { FilterOutlined } from '~/assets/svg';
import { IParentCategory } from '~/features/category/types/category';
import Button from '~/shared/components/Button/Button';
import { Checkbox, CheckboxGroup } from '~/shared/components/Checkbox/Checkbox';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import RangePicker from '~/shared/components/RangePicker/RangePicker';
import { IFilterForm } from './CategoryManagement';

interface FilterCategoryProps {
  open: boolean;
  data: IParentCategory[];
  form: FormInstance<IFilterForm>;
  onCancel: () => void;
  onFinish: (values: any) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CategoryFilter = ({
  open,
  form,
  data,
  onFinish,
  onCancel,
  setIsOpen,
}: FilterCategoryProps) => {
  const filterDropdownRender: DropDownProps['popupRender'] = () => (
    <Form
      form={form}
      onFinish={onFinish}
      className="w-[280px] bg-white shadow-lg rounded-md border border-gray-200"
    >
      <Flex align="center" justify="space-between" className="py-1.5! px-4!">
        <p className="text-[16px] font-semibold text-primary capitalize">
          Bộ lọc
        </p>
        <Button
          displayType="text"
          title="Xóa tất cả"
          className="text-blue-400! hover:underline"
          onClick={() => form.resetFields()}
        />
      </Flex>
      <Divider className="my-1.5!" />
      <FormItem
        name="parentIds"
        className="max-w-[350px] py-1.5! px-4!"
        label={
          <h2 className="uppercase font-semibold text-body">Danh mục cha</h2>
        }
        getValueFromEvent={(checkedList) => checkedList}
      >
        <CheckboxGroup className="max-h-[300px] overflow-y-scroll gap-y-2">
          {data?.map(({ id, name, childrenCount, position }) => (
            <Checkbox
              key={id}
              value={id}
              className="w-full"
              style={{ order: position }}
            >
              <Flex align="center" justify="space-between" className="w-full">
                <p>{name}</p>
                <p>({childrenCount})</p>
              </Flex>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </FormItem>
      <Divider className="my-1.5!" />
      <FormItem
        name="createdDate"
        className="py-1.5! px-4!"
        label={
          <h2 className="uppercase font-semibold text-body mt-2">Ngày tạo</h2>
        }
      >
        <RangePicker />
      </FormItem>
      <Divider className="my-1.5!" />
      <Flex align="center" justify="end" className="gap-x-3 py-3! px-4!">
        <Button title="Hủy" displayType="outlined" onClick={onCancel} />
        <Button title="Áp dụng" onClick={() => form.submit()} />
      </Flex>
    </Form>
  );

  return (
    <Dropdown
      open={open}
      trigger={['click']}
      placement="bottomRight"
      popupRender={filterDropdownRender}
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

export default memo(CategoryFilter);
