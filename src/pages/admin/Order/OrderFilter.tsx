import { Divider, Dropdown, DropDownProps, Flex, FormInstance } from 'antd';
import { Dispatch, memo, SetStateAction } from 'react';

import { FilterOutlined } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import RangePicker from '~/shared/components/RangePicker/RangePicker';
import Select from '~/shared/components/Select/Select';

interface IOrderFilterProps extends DropDownProps {
  form: FormInstance;
  onCancel: () => void;
  onFinish: (values: any) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const OrderFilter = ({
  form,
  onCancel,
  onFinish,
  setIsOpen,
  ...props
}: IOrderFilterProps) => {
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
        name="status"
        className="py-1.5! px-4!"
        label={
          <h2 className="uppercase font-semibold text-body mt-2">Trạng thái</h2>
        }
      >
        <Select
          placeholder="Chọn trạng thái"
          options={[
            { label: 'Đang xử lý', value: 'pending' },
            { label: 'Hoàn thành', value: 'confirmed' },
            { label: 'Từ chối', value: 'cancelled' },
          ]}
        />
      </FormItem>
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
      trigger={['click']}
      placement="bottomRight"
      popupRender={filterDropdownRender}
      onOpenChange={(open) => setIsOpen(open)}
      {...props}
    >
      <Button
        title="Lọc"
        displayType="outlined"
        iconBefore={<FilterOutlined />}
      />
    </Dropdown>
  );
};

export default memo(OrderFilter);
