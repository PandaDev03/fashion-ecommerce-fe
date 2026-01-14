import { SaveOutlined } from '@ant-design/icons';
import { Flex, FormInstance, ModalProps, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, memo, SetStateAction } from 'react';

import { PROFILE_COVER_IMAGE, PROFILE_PICTURE } from '~/assets/images';
import { CloseOutlined, Pen, Share } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import Modal from '~/shared/components/Modal/Modal';
import Select from '~/shared/components/Select/Select';
import { IUser } from '~/shared/types/user';

interface UserDetailsModalProps extends ModalProps {
  isEdit: boolean;
  form: FormInstance<any>;
  selectedUser: IUser | undefined;
  onEdit: (record: IUser) => void;
  onFinish: (values: any) => void;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
}

const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
];

const statusOptions = [
  { label: 'Hoạt động', value: 'true' },
  { label: 'Ngừng hoạt động', value: 'false' },
];

const UserDetailsModal = ({
  form,
  isEdit,
  loading,
  classNames,
  selectedUser,
  setIsEdit,
  onEdit,
  onFinish,
  ...props
}: UserDetailsModalProps) => {
  const customClassNames: ModalProps['classNames'] = {
    header: '',
    body: 'pt-15! pb-8! px-8!',
    ...(isEdit && { footer: 'border-t! border-gray-200! m-0! py-2! px-5!' }),
    ...classNames,
  };

  return (
    <Modal
      centered
      width={700}
      classNames={customClassNames}
      closeIcon={
        <span className="bg-white px-2 rounded-full! shadow-lg cursor-pointer hover:opacity-90">
          <CloseOutlined className="[&>svg]:fill-black" />
        </span>
      }
      title={
        <div
          style={{ backgroundImage: `url(${PROFILE_COVER_IMAGE})` }}
          className={`h-36 bg-cover bg-center bg-no-repeat rounded-t-lg`}
        >
          <div className="relative group w-[120px] h-[120px] top-20 left-5 rounded-full shadow-lg overflow-hidden">
            <img
              src={selectedUser?.avatar || PROFILE_PICTURE}
              className="w-[120px] h-[120px] absolute left-0 top-0 object-cover z-10"
              onError={(event) => {
                event.currentTarget.src = PROFILE_PICTURE;
                event.currentTarget.srcset = PROFILE_PICTURE;
              }}
            />
          </div>
        </div>
      }
      footer={
        isEdit && (
          <Flex align="center" justify="end" className="gap-x-2">
            <Button
              title="Hủy"
              loading={loading}
              displayType="outlined"
              onClick={() => setIsEdit(false)}
            />
            <Button
              title="Lưu"
              loading={loading}
              iconBefore={<SaveOutlined />}
              onClick={() => form.submit()}
            />
          </Flex>
        )
      }
      {...props}
    >
      <Space size="middle" direction="vertical" className="w-full">
        <h2 className="text-3xl font-semibold text-primary">
          {selectedUser?.name || '-'}
        </h2>
        <Space direction="vertical">
          <p className="font-semibold text-sm uppercase text-body">Email</p>
          <p className="text-primary">{selectedUser?.email || '-'}</p>
        </Space>
        <Space direction="vertical">
          <p className="font-semibold text-sm uppercase text-body">SĐT</p>
          <p className="text-primary">{selectedUser?.phone || '-'}</p>
        </Space>
        <Space direction="vertical">
          <p className="font-semibold text-sm uppercase text-body">Ngày sinh</p>
          <p className="text-primary">
            {selectedUser?.birthday
              ? dayjs(selectedUser?.birthday).format('DD/MM/YYYY')
              : '-'}
          </p>
        </Space>
        <Space direction="vertical">
          <p className="font-semibold text-sm uppercase text-body">Địa chỉ</p>
          <p className="text-primary">{selectedUser?.address || '-'}</p>
        </Space>
        {isEdit ? (
          <Form form={form} onFinish={onFinish}>
            <FormItem
              name="role"
              label="Chức vụ"
              rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
            >
              <Select options={roleOptions} placeholder="Chọn chức vụ" />
            </FormItem>
            <FormItem
              name="isActive"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select options={statusOptions} placeholder="Chọn trạng thái" />
            </FormItem>
          </Form>
        ) : (
          <>
            <Space direction="vertical">
              <p className="font-semibold text-sm uppercase text-body">
                Chức vụ
              </p>
              <p className="text-primary">{selectedUser?.role || '-'}</p>
            </Space>
            <Space direction="vertical">
              <p className="font-semibold text-sm uppercase text-body">
                Trạng thái
              </p>
              <Tag color={selectedUser?.isActive ? 'green' : 'error'}>
                {selectedUser?.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
              </Tag>
            </Space>
          </>
        )}
      </Space>
    </Modal>
  );
};

export default memo(UserDetailsModal);
