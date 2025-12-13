import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Space, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { ColumnType, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { Search, Trash } from '~/assets/svg';
import { IDeleteManyBrandParams } from '~/features/brand/types/brand';
import { categoryApi } from '~/features/category/api/categoryApi';
import { getAllCategories } from '~/features/category/stores/categoryThunks';
import {
  ICategory,
  ICategoryParams,
  ICreateCategoryParams,
  IDeleteManyCategoryParams,
  IParentCategory,
  IUpdateCategoryParams,
} from '~/features/category/types/category';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import Input from '~/shared/components/Input/Input';
import { Layout } from '~/shared/components/Layout/Layout';
import PopConfirm from '~/shared/components/PopConfirm/PopConfirm';
import Table from '~/shared/components/Table/Table';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import usePagination from '~/shared/hooks/usePagination';
import useQueryParams from '~/shared/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { normalizeObjectStrings } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import CategoryFilter from './CategoryFilter';
import CategoryModal from './CategoryModal';

export type ICategoryForm = ICreateCategoryParams;

export interface IFilterForm {
  parentIds?: number[];
  createdDate?: string[];
}

interface ISearchForm {
  search: string;
}

const CategoryManagement = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const queryParams = useQueryParams();

  const [searchForm] = useForm<ISearchForm>();
  const [filterForm] = useForm<IFilterForm>();
  const [categoryForm] = useForm<ICategoryForm>();

  const [isEditCategory, setIsEditCategory] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [filterParams, setFilterParams] = useState<ICategoryParams>();
  const [selectedMultipleCategory, setSelectedMultipleCategory] = useState(
    [] as ICategory[]
  );

  const category = useAppSelector((state) => state.category);
  const [parentCategories, setParentCategories] = useState<IParentCategory[]>(
    []
  );

  const { pageInfo, refetch, handlePageChange, resetPaginationAndUrl } =
    usePagination({
      setFilterParams,
      extraParams: filterParams,
      fetchFn: (params) => dispatch(getAllCategories(params)).unwrap(),
    });

  const { mutate: getParentCategories } = useMutation({
    mutationFn: () => categoryApi.getAllParents(),
    onSuccess: (response) => {
      setParentCategories(response?.data);
    },
  });

  const { mutate: createCategory, isPending: isCreateCategoryPending } =
    useMutation({
      mutationFn: (params: ICreateCategoryParams) =>
        categoryApi.createCategory(params),
      onSuccess: (response) => {
        toast.success(response?.message);

        getParentCategories();

        handleCancelModal();
        resetPaginationAndUrl(true);
      },
    });

  const { mutate: updateCategory, isPending: isUpdateCategoryPending } =
    useMutation({
      mutationFn: (params: IUpdateCategoryParams) =>
        categoryApi.updateCategory(params),
      onSuccess: (response) => {
        toast.success(response?.message);

        getParentCategories();

        refetch();
        handleCancelModal();
      },
    });

  const { mutate: deleteCategory, isPending: isDeleteCategoryPending } =
    useMutation({
      mutationFn: (id: string) => categoryApi.deleteCategory(id),
      onSuccess: (response) => {
        toast.success(response?.message);

        getParentCategories();
        refetch();
      },
    });

  const { mutate: deleteManyCategory, isPending: isDeleteManyCategoryPending } =
    useMutation({
      mutationFn: (params: IDeleteManyBrandParams) =>
        categoryApi.deleteManyCategory(params),
      onSuccess: (response) => {
        toast.success(response?.message);

        refetch();
        getParentCategories();
        setSelectedMultipleCategory([]);
      },
    });

  const columns: ColumnType<ICategory>[] = [
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
      width: 200,
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: '3',
      width: 200,
      title: 'Slug',
      dataIndex: 'slug',
    },
    {
      key: '5',
      width: 250,
      title: 'Mô tả',
      dataIndex: 'description',
      render: (value) => {
        return (
          <Tooltip title={value}>
            <p className="max-w-[250px] truncate">{value}</p>
          </Tooltip>
        );
      },
    },
    {
      key: '4',
      title: 'Danh mục cha',
      dataIndex: ['parent', 'name'],
    },
    {
      key: '6',
      align: 'center',
      title: 'SL sản phẩm',
    },
    {
      key: '7',
      width: 150,
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '8',
      width: 150,
      title: 'Người tạo',
      dataIndex: ['creator', 'name'],
    },
    {
      key: '9',
      width: 150,
      title: 'Ngày chỉnh sửa',
      dataIndex: 'updatedAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '10',
      width: 150,
      title: 'Người chỉnh sửa',
      dataIndex: ['updater', 'name'],
    },
    {
      width: 100,
      fixed: 'right',
      align: 'center',
      title: 'Thao tác',
      render: (_, record) => {
        const isDisable = !!selectedMultipleCategory?.filter(
          (category) => category.id === record.id
        ).length;

        return (
          <Flex justify="center" className="gap-x-3">
            <Button
              displayType="text"
              disabled={isDisable}
              title={
                <EditOutlined
                  className={
                    isDisable
                      ? '[&>svg]:fill-gray-400'
                      : '[&>svg]:fill-blue-500'
                  }
                />
              }
              onClick={() => handleEditCategory(record)}
            />
            <PopConfirm
              placement="topLeft"
              title="Xoá mục này"
              onConfirm={() => deleteCategory(record.id)}
            >
              <Button
                displayType="text"
                disabled={isDisable}
                title={
                  <CloseOutlined
                    className={
                      isDisable
                        ? '[&>svg]:fill-gray-400'
                        : '[&>svg]:fill-red-500'
                    }
                  />
                }
              />
            </PopConfirm>
          </Flex>
        );
      },
    },
  ];

  const handleRowSelectionChange = useDebounceCallback(
    (selectedRows: ICategory[]) => {
      setSelectedMultipleCategory(selectedRows);
    },
    300
  );

  const rowSelection: TableProps<ICategory>['rowSelection'] = {
    onChange: (_, selectedRows: ICategory[]) => {
      console.log(`selectedRows: ${selectedRows}`);
      handleRowSelectionChange(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

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

    filterForm.setFields([
      { name: 'parentIds', value: queryValues?.parentIds },
      { name: 'createdDate', value: [createdFrom, createdTo] },
    ]);
    searchForm.setFieldValue('search', queryValues?.search);

    setTitle('Danh mục');
    setBreadcrumb([
      {
        key: 'home',
        title: 'Trang chủ',
        href: PATH.ADMIN_DASHBOARD,
      },
      {
        key: 'category',
        title: 'Danh mục',
      },
    ]);

    getParentCategories();
  }, []);

  const handleDeleteManyCategory = () => {
    const params: IDeleteManyCategoryParams = {
      ids: selectedMultipleCategory?.map((category) => category.id),
    };

    deleteManyCategory(params);
  };

  const handleEditCategory = (record: ICategory) => {
    setIsEditCategory(true);
    setIsModalVisible(true);

    categoryForm.setFieldsValue(record);
  };

  const handleCancelModal = () => {
    setIsEditCategory(false);

    categoryForm.resetFields();
    setIsModalVisible(false);
  };

  const handleFinishModal = (values: ICreateCategoryParams) => {
    if (isEditCategory) {
      const formValues = categoryForm.getFieldsValue(true);
      if (!formValues?.id) {
        toast.error(
          `Không tìm thấy thông tin chỉ mục của danh mục ${formValues?.name}`
        );
        return;
      }

      const normalizeParams = normalizeObjectStrings({
        ...values,
        id: formValues?.id,
      });

      updateCategory(normalizeParams);
      return;
    }

    const normalizeParams = normalizeObjectStrings(values);
    createCategory(normalizeParams);
  };

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
      parentIds: [],
      createdFrom: undefined,
      createdTo: undefined,
    });
  };

  const handleFinishFilter = (values: IFilterForm) => {
    const { createdDate, parentIds } = values;
    const params: ICategoryParams = {
      parentIds,
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

  return (
    <Layout
      loading={
        category?.loading ||
        isDeleteCategoryPending ||
        isDeleteManyCategoryPending
      }
      className="bg-white! border border-gray-200 rounded-lg overflow-hidden"
    >
      <Flex align="center" justify="space-between" className="py-4! px-5!">
        <Flex vertical>
          <h2 className="font-semibold capitalize text-lg text-primary">
            Danh sách danh mục
          </h2>
          <p className="text-body">Quản lý danh mục của bạn</p>
        </Flex>
        <Flex className="gap-x-4">
          <Button
            title="Import"
            displayType="outlined"
            iconAfter={<UploadOutlined />}
          />
          <Button
            title="Export"
            displayType="outlined"
            iconAfter={<DownloadOutlined />}
          />
          <Button
            title="Thêm Danh mục"
            iconBefore={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          />
        </Flex>
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        className="border-t border-b border-gray-200 py-4! px-5!"
      >
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
          {!!selectedMultipleCategory?.length && (
            <PopConfirm
              title="Xóa mục này"
              description={
                <p>
                  Bạn có chắc chắn muốn xóa danh mục:{' '}
                  <strong>
                    {selectedMultipleCategory
                      .map((brand) => brand.name)
                      .join(', ')}
                  </strong>
                  ?
                  <br />
                  Hành động này không thể hoàn tác.
                </p>
              }
              onConfirm={handleDeleteManyCategory}
            >
              <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
            </PopConfirm>
          )}
        </Space>
        <CategoryFilter
          form={filterForm}
          open={isFilterVisible}
          data={parentCategories}
          setIsOpen={setIsFilterVisible}
          onCancel={handleCancelFilter}
          onFinish={handleFinishFilter}
        />
      </Flex>

      <div className="py-4 px-5">
        <Table<ICategory>
          className="w-full"
          columns={columns}
          dataSource={category?.items}
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          pagination={{
            current: pageInfo?.page,
            pageSize: pageInfo?.pageSize,
            total: category?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </div>

      <CategoryModal
        form={categoryForm}
        open={isModalVisible}
        isEdit={isEditCategory}
        parentCategories={parentCategories}
        loading={isCreateCategoryPending || isUpdateCategoryPending}
        onFinish={handleFinishModal}
        onCancel={handleCancelModal}
      />
    </Layout>
  );
};

export default CategoryManagement;
