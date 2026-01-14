import { DownloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Space, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { FALLBACK_IMG } from '~/assets/images';
import { Search } from '~/assets/svg';
import { UserAPI } from '~/features/user/api/userApi';
import { IUpdateUserByAdmin, IUserParams } from '~/features/user/types/user';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import Table from '~/shared/components/Table/Table';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import usePagination from '~/shared/hooks/usePagination';
import useQueryParams from '~/shared/hooks/useQueryParams';
import { IUser } from '~/shared/types/user';
import { PATH } from '~/shared/utils/path';
import UserDetailsModal from './UserDetailsModal';
import UserFilter from './UserFilter';

interface ISearchForm {
  search: string;
}

export interface IFilterForm {
  role?: string;
  isActive?: string;
  createdDate?: string[];
}

export interface IUserForm {
  role: string;
  isActive: string;
}

const UserManagement = () => {
  const toast = useToast();
  const queryParams = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [searchForm] = useForm<ISearchForm>();
  const [filterForm] = useForm<IFilterForm>();

  const [userForm] = useForm<IUserForm>();

  const [filterParams, setFilterParams] = useState<IUserParams>();

  const [isEdit, setIsEdit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [users, setUsers] = useState<IUser[]>();
  const [selectedUser, setSelectedUser] = useState<IUser>();

  const { pageInfo, handlePageChange, resetPaginationAndUrl, refetch } =
    usePagination({
      setFilterParams,
      extraParams: filterParams,
      fetchFn: (params) => getAllUsers(params),
    });

  const { mutate: getAllUsers, isPending: isGetAllUserPending } = useMutation({
    mutationFn: (params: IUserParams) => UserAPI.getAllUsers(params),
    onSuccess: (response) => setUsers(response?.data),
  });

  const { mutate: updateUserByAdmin, isPending: isUpdateUserByAdminPending } =
    useMutation({
      mutationFn: (params: IUpdateUserByAdmin) =>
        UserAPI.updateUserByAdmin(params),
      onSuccess: (response) => {
        toast.success(response?.message);
        setIsModalVisible(false);

        refetch();
      },
    });

  const { mutate: exportUser, isPending: isUserExportPending } = useMutation({
    mutationFn: (params: IUserParams) => UserAPI.exportUser(params),
    onSuccess: (response) => {
      const data = response.data || response;
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute(
        'download',
        `users_export_${new Date().getTime()}.xlsx`
      );

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  const columns: ColumnType<IUser>[] = [
    {
      key: '1',
      width: 50,
      title: 'STT',
      align: 'center',
      render: (_, __, index: number) =>
        index + 1 + pageInfo?.pageSize * (pageInfo?.page - 1),
    },
    {
      key: '2',
      width: 80,
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (value) => (
        <Image
          preview
          width={50}
          height={50}
          src={value}
          fallback={FALLBACK_IMG}
          className="rounded-full"
        />
      ),
    },
    {
      key: '3',
      width: 200,
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: '4',
      width: 300,
      title: 'Email',
      dataIndex: 'email',
      render: (value) => (
        <Tooltip title={value}>
          <p className="max-w-[300px] truncate">{value}</p>
        </Tooltip>
      ),
    },
    {
      key: '5',
      width: 100,
      title: 'SĐT',
      dataIndex: 'phone',
    },
    {
      key: '6',
      width: 150,
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
    },
    {
      key: '7',
      width: 300,
      title: 'Địa chỉ',
      dataIndex: 'address',
      render: (value) => (
        <Tooltip title={value}>
          <p className="max-w-[300px] truncate">{value}</p>
        </Tooltip>
      ),
    },
    {
      key: '8',
      width: 150,
      title: 'Chức vụ',
      dataIndex: 'role',
    },
    {
      key: '9',
      width: 150,
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (value) => (
        <Tag color={value ? 'green' : 'error'}>
          {value ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      key: '10',
      width: 150,
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '11',
      width: 150,
      title: 'Ngày chỉnh sửa',
      dataIndex: 'updatedAt',
      render: (value, record) => {
        return record?.updatedBy
          ? dayjs(value).format('DD/MM/YYYY HH:mm:ss')
          : '-';
      },
    },
    {
      width: 100,
      fixed: 'right',
      align: 'center',
      title: 'Thao tác',
      render: (_, record) => (
        <Flex justify="center" className="gap-x-3">
          <Button
            displayType="text"
            title={<EyeOutlined className="[&>svg]:fill-blue-500" />}
            onClick={() => handleViewDetailsClick(record)}
          />
          <Button
            displayType="text"
            title={<EditOutlined className={'[&>svg]:fill-blue-500'} />}
            onClick={() => handleEdit(record)}
          />
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    const queryValues = queryParams.searchParams;

    const createdFrom =
      typeof queryValues?.createdFrom === 'string'
        ? dayjs(queryValues?.createdFrom)
        : undefined;
    const createdTo =
      typeof queryValues?.createdTo === 'string'
        ? dayjs(queryValues?.createdTo)
        : undefined;

    filterForm.setFieldValue('createdDate', [createdFrom, createdTo]);
    filterForm.setFieldValue('isActive', queryValues?.isActive);
    filterForm.setFieldValue('role', queryValues?.role);

    searchForm.setFieldValue('search', queryValues?.search);

    setTitle('Người dùng');
    setBreadcrumb([
      { title: 'Trang chủ', href: PATH.ADMIN_DASHBOARD },
      { title: 'Quản lý người dùng' },
    ]);
  }, []);

  const handleSearch = (values: ISearchForm) => {
    const { search } = values;

    resetPaginationAndUrl();
    setFilterParams({ ...filterParams, search });
  };

  const handleCancelFilter = () => {
    filterForm.resetFields();
    resetPaginationAndUrl();

    setIsFilterVisible(false);
    setFilterParams({
      role: undefined,
      isActive: undefined,
      createdFrom: undefined,
      createdTo: undefined,
    });
  };

  const handleFinishFilter = (values: IFilterForm) => {
    const { createdDate, isActive, ...rest } = values;
    const params: IUserParams = {
      ...rest,
      isActive:
        isActive === undefined ? undefined : isActive === 'true' ? true : false,
      createdFrom: createdDate?.[0]
        ? dayjs(createdDate?.[0]).startOf('day').toISOString()
        : undefined,
      createdTo: createdDate?.[1]
        ? dayjs(createdDate?.[1]).endOf('day').toISOString()
        : undefined,
    };

    setIsFilterVisible(false);

    resetPaginationAndUrl();
    setFilterParams(params);
  };

  const handleViewDetailsClick = (record: IUser) => {
    setIsModalVisible(true);
    setSelectedUser(record);
  };

  const handleEdit = (record: IUser) => {
    setIsEdit(true);
    setIsModalVisible(true);

    setSelectedUser(record);
    userForm.setFieldsValue({
      role: record?.role,
      isActive: String(record?.isActive),
    });
  };

  const handleCancelModal = () => {
    setIsEdit(false);
    setIsModalVisible(false);

    userForm.resetFields();
    setSelectedUser(undefined);
  };

  const handleFinishModal = (values: IUserForm) => {
    if (!selectedUser) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    const params: IUpdateUserByAdmin = {
      id: selectedUser?.id,
      role: values?.role,
      isActive: values?.isActive === 'true' ? true : false,
    };
    updateUserByAdmin(params);
  };

  return (
    <Layout
      loading={isUserExportPending}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <Content className="flex items-center justify-between">
        <Flex vertical>
          <h2 className="font-semibold capitalize text-lg text-primary">
            Danh sách Người dùng
          </h2>
          <p className="text-body">Quản lý người dùng</p>
        </Flex>
        <Flex className="gap-x-4">
          <Button
            title="Export"
            displayType="outlined"
            iconAfter={<DownloadOutlined />}
            onClick={() => exportUser({})}
          />
        </Flex>
      </Content>

      <Content className="flex items-center justify-between border-t border-b border-gray-200">
        <Space>
          <Form
            form={searchForm}
            onFinish={useDebounceCallback(handleSearch, 300)}
          >
            <FormItem name="search" className="mb-0!">
              <Input
                allowClear
                placeholder="Tìm kiếm..."
                className="max-w-[300px]"
                prefix={<Search className="[&>path]:fill-[#667085] mr-1" />}
                onChange={() => searchForm.submit()}
              />
            </FormItem>
          </Form>
        </Space>
        <UserFilter
          form={filterForm}
          open={isFilterVisible}
          onCancel={handleCancelFilter}
          setIsOpen={setIsFilterVisible}
          onFinish={handleFinishFilter}
        />
      </Content>

      <Content>
        <Table<IUser>
          columns={columns}
          loading={isGetAllUserPending}
          dataSource={users}
          pagination={{
            current: pageInfo?.page,
            pageSize: pageInfo?.pageSize,
            total: users?.length,
            onChange: handlePageChange,
          }}
        />
      </Content>

      <UserDetailsModal
        isEdit={isEdit}
        form={userForm}
        open={isModalVisible}
        selectedUser={selectedUser}
        loading={isUpdateUserByAdminPending}
        setIsEdit={setIsEdit}
        onEdit={handleEdit}
        onCancel={handleCancelModal}
        onFinish={handleFinishModal}
      />
    </Layout>
  );
};

export default UserManagement;
