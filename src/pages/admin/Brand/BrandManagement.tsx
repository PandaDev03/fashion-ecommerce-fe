import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Space, Tooltip, Upload, UploadFile, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { FALLBACK_IMG } from '~/assets/images';
import { Search, Trash } from '~/assets/svg';
import { brandApi } from '~/features/brand/api/brandApi';
import { getAllBrands } from '~/features/brand/store/brandThunks';
import {
  IBrand,
  IBrandParams,
  ICreateBrandParams,
  IDeleteManyBrandParams,
  IUpdateBrandParams,
} from '~/features/brand/types/brand';
import { cloudinaryApi } from '~/features/cloudinary/api/cloudinaryApi';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import Modal from '~/shared/components/Modal/Modal';
import PopConfirm from '~/shared/components/PopConfirm/PopConfirm';
import Table from '~/shared/components/Table/Table';
import { FileType } from '~/shared/components/Upload/Dragger';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import usePagination from '~/shared/hooks/usePagination';
import useQueryParams from '~/shared/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { getBase64, normalizeObjectStrings } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import BrandCreateModal from './BrandCreateModal';
import BrandDetailsModal from './BrandDetailsModal';
import BrandFilter from './BrandFilter';
import BrandUpload from './BrandUpload';

export type IBrandDetailsForm = Omit<ICreateBrandParams, 'logo'>;
export type IBrandCreateForm = Omit<ICreateBrandParams, 'logo'> & {
  logo: {
    fileList: UploadFile[];
  };
};

export interface IFilterForm {
  createdDate?: string[];
}

export interface BrandDetailsModalRef {
  handleEditClick: (record: IBrand) => void;
}

interface ISearchForm {
  search: string;
}

const BrandManagement = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const queryParams = useQueryParams();

  const brandDetailsModalRef = useRef<BrandDetailsModalRef>(null);

  const [searchForm] = useForm<ISearchForm>();
  const [filterForm] = useForm<IFilterForm>();

  const [brandCreateForm] = useForm<IBrandCreateForm>();
  const [brandDetailsForm] = useForm<IBrandDetailsForm>();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [isEdit, setIsEdit] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const [filterParams, setFilterParams] = useState<IBrandParams>();
  const [selectedBrand, setSelectedBrand] = useState({} as IBrand);
  const [selectedMultipleBrand, setSelectedMultipleBrand] = useState(
    [] as IBrand[]
  );

  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const brand = useAppSelector((state) => state.brand);

  const { pageInfo, handlePageChange, resetPaginationAndUrl, refetch } =
    usePagination({
      setFilterParams,
      extraParams: filterParams,
      fetchFn: (params) => dispatch(getAllBrands(params)).unwrap(),
    });

  const { mutate: uploadBrandLogo, isPending: isUploadBrandLogoPending } =
    useMutation({
      mutationFn: (data: FormData) => cloudinaryApi.uploadBrandLogo(data),
      onSuccess: (response) => {
        if (isEdit) {
          const fieldValues = brandDetailsForm.getFieldsValue();
          const updateParams: IUpdateBrandParams = {
            ...fieldValues,
            id: selectedBrand.id,
            logo: response?.data?.[0]?.url,
          };

          const normalizeUpdateParams = normalizeObjectStrings(updateParams);
          updateBrand(normalizeUpdateParams);

          return;
        }

        const { logo, ...fieldValues } = brandCreateForm.getFieldsValue();
        const createParams: ICreateBrandParams = {
          ...fieldValues,
          logo: response?.data?.[0]?.url,
        };

        const normalizeCreateParams = normalizeObjectStrings(createParams);
        createBrand(normalizeCreateParams);
      },
    });

  const { mutate: createBrand, isPending: isCreateBrandPending } = useMutation({
    mutationFn: (params: ICreateBrandParams) => brandApi.createBrand(params),
    onSuccess: (response) => {
      toast.success(response?.message);

      handleCancelCreateModal();
      resetPaginationAndUrl(true);
    },
  });

  const { mutate: updateBrand, isPending: isUpdateBrandPending } = useMutation({
    mutationFn: (params: IUpdateBrandParams) => brandApi.updateBrand(params),
    onSuccess: (response) => {
      toast.success(response?.message);

      refetch();
      handleCancelDetailsModal();
    },
  });

  const { mutate: deleteBrand, isPending: isDeleteBrandPending } = useMutation({
    mutationFn: ({ id }: { id: string; closeModalAfterDelete?: boolean }) =>
      brandApi.deleteBrand(id),
    onSuccess: (response, variables) => {
      toast.success(response?.message);

      const { closeModalAfterDelete } = variables;
      if (closeModalAfterDelete) handleCancelDetailsModal();

      refetch();
    },
  });

  const { mutate: deleteManyBrand, isPending: isDeleteManyBrandPending } =
    useMutation({
      mutationFn: (ids: IDeleteManyBrandParams) =>
        brandApi.deleteManyBrand(ids),
      onSuccess: (response) => {
        toast.success(response?.message);

        setSelectedMultipleBrand([]);
        refetch();
      },
    });

  const handleRowSelectionChange = useDebounceCallback(
    (selectedRows: IBrand[]) => setSelectedMultipleBrand(selectedRows),
    300
  );

  const rowSelection: TableProps<IBrand>['rowSelection'] = {
    onChange: (_, selectedRows: IBrand[]) => {
      console.log('selectedRows: ', selectedRows);
      handleRowSelectionChange(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const columns: ColumnType<IBrand>[] = [
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
      width: 100,
      title: 'Logo',
      dataIndex: 'logo',
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
      width: 150,
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: '4',
      width: 150,
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
        const isDisable = !!selectedMultipleBrand?.filter(
          (brand) => brand?.id === record?.id
        ).length;

        return (
          <Flex justify="center" className="gap-x-3">
            <Button
              displayType="text"
              disabled={isDisable}
              title={
                <EyeOutlined
                  className={
                    isDisable
                      ? '[&>svg]:fill-gray-400'
                      : '[&>svg]:fill-blue-500'
                  }
                />
              }
              onClick={() => handleViewDetailsClick(record)}
            />
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
              onClick={() => {
                setIsDetailsModalVisible(true);
                setIsEdit(true);

                setSelectedBrand(record);

                if (brandDetailsModalRef.current)
                  brandDetailsModalRef.current?.handleEditClick(record);
              }}
            />
            <PopConfirm
              placement="topLeft"
              title="Xoá mục này"
              onConfirm={() => deleteBrand({ id: record.id })}
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
    searchForm.setFieldValue('search', queryValues?.search);

    setTitle('Thương hiệu');
    setBreadcrumb([
      { title: 'Trang chủ', href: PATH.ADMIN_DASHBOARD },
      { title: 'Thương hiệu' },
    ]);
  }, []);

  const handleUploadPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj as FileType);

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const handleBeforeUpload = (file: FileType) => {
    const isValidFormat =
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/webp';

    if (!isValidFormat) {
      toast.error('Tệp tin không hợp lệ! Chỉ hỗ trợ PNG, JPG, JPEG, WEBP.');
      return Upload.LIST_IGNORE;
    }

    setFileList([{ ...file, name: file.name, originFileObj: file }]);
    return false;
  };

  const handleUploadRemove = () => {
    setFileList([]);
  };

  const handleSearch = (values: ISearchForm) => {
    const { search } = values;

    resetPaginationAndUrl();
    setFilterParams({ ...filterParams, search });
  };

  const handleFinishFilter = (values: IFilterForm) => {
    const { createdDate } = values;
    const params: IBrandParams = {
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

  const handleCancel = () => {
    filterForm.resetFields();

    resetPaginationAndUrl();

    setIsFilterVisible(false);
    setFilterParams({ createdFrom: undefined, createdTo: undefined });
  };

  const handleViewDetailsClick = (record: IBrand) => {
    setIsDetailsModalVisible(true);
    setSelectedBrand(record);
  };

  const handleEditBrand = (values: IBrandDetailsForm) => {
    if (fileList?.length > 0) {
      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) formData.append('files', file.originFileObj);
      });

      uploadBrandLogo(formData);
      return;
    }

    const params: IUpdateBrandParams = {
      id: selectedBrand.id,
      ...values,
    };

    const normalizeParams = normalizeObjectStrings(params);
    updateBrand(normalizeParams);
  };

  const handleDeleteBrand = (id: string) => {
    deleteBrand({ id, closeModalAfterDelete: true });
  };

  const handleDeleteManyBrand = () => {
    const params: IDeleteManyBrandParams = {
      ids: selectedMultipleBrand?.map((brand) => brand.id),
    };

    deleteManyBrand(params);
  };

  const handleCancelDetailsModal = () => {
    brandDetailsForm.resetFields();

    handleUploadRemove();

    setIsEdit(false);
    setIsDetailsModalVisible(false);
  };

  const handleCancelCreateModal = () => {
    brandCreateForm.resetFields();

    handleUploadRemove();
    setIsCreateModalVisible(false);
  };

  const handleFinishCreateModal = (values: IBrandCreateForm) => {
    const { logo, ...rest } = values;

    if (logo?.fileList?.length) {
      const formData = new FormData();
      logo.fileList.forEach((file) => {
        if (file?.originFileObj) formData.append('files', file.originFileObj);
      });

      uploadBrandLogo(formData);
      return;
    }

    const normalizeParams = normalizeObjectStrings(rest);
    createBrand(normalizeParams);
  };

  return (
    <Layout
      loading={isDeleteBrandPending || isDeleteManyBrandPending}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <Content className="flex items-center justify-between">
        <Flex vertical>
          <h2 className="font-semibold capitalize text-lg text-primary">
            Danh sách Thương hiệu
          </h2>
          <p className="text-body">Quản lý thương hiệu</p>
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
            title="Thêm Thương hiệu"
            iconBefore={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
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
          {!!selectedMultipleBrand?.length && (
            <PopConfirm
              title="Xóa mục này"
              description={
                <p>
                  Bạn có chắc chắn muốn xóa thương hiệu:{' '}
                  <strong>
                    {selectedMultipleBrand
                      .map((brand) => brand.name)
                      .join(', ')}
                  </strong>
                  ?
                  <br />
                  Hành động này không thể hoàn tác.
                </p>
              }
              onConfirm={handleDeleteManyBrand}
            >
              <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
            </PopConfirm>
          )}
        </Space>
        <BrandFilter
          form={filterForm}
          open={isFilterVisible}
          onCancel={handleCancel}
          setIsOpen={setIsFilterVisible}
          onFinish={handleFinishFilter}
        />
      </Content>
      <Content>
        <Table<IBrand>
          columns={columns}
          loading={brand?.loading}
          dataSource={brand?.items}
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          pagination={{
            current: pageInfo?.page,
            pageSize: pageInfo?.pageSize,
            total: brand?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>

      <BrandDetailsModal
        isEdit={isEdit}
        fileList={fileList}
        form={brandDetailsForm}
        ref={brandDetailsModalRef}
        open={isDetailsModalVisible}
        selectedBrand={selectedBrand}
        loading={
          isUploadBrandLogoPending ||
          isUpdateBrandPending ||
          isDeleteBrandPending
        }
        setIsEdit={setIsEdit}
        onDelete={handleDeleteBrand}
        setIsUploadModalVisible={setIsUploadModalVisible}
        onFinish={handleEditBrand}
        onCancel={handleCancelDetailsModal}
      />

      <BrandCreateModal
        fileList={fileList}
        form={brandCreateForm}
        open={isCreateModalVisible}
        loading={isUploadBrandLogoPending || isCreateBrandPending}
        onUploadPreview={handleUploadPreview}
        onUploadChange={handleUploadChange}
        onUploadRemove={handleUploadRemove}
        onBeforeUpload={handleBeforeUpload}
        onCancel={handleCancelCreateModal}
        onFinish={handleFinishCreateModal}
      />

      <Modal
        centered
        open={isUploadModalVisible}
        title="Tải Logo Thương Hiệu"
        onOk={() => setIsUploadModalVisible(false)}
        onCancel={() => setIsUploadModalVisible(false)}
      >
        <BrandUpload
          fileList={fileList}
          onChange={handleUploadChange}
          onPreview={handleUploadPreview}
          onRemove={() => setFileList([])}
          beforeUpload={handleBeforeUpload}
        />
      </Modal>

      {previewImage && (
        <Image
          className="hidden"
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible: boolean) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </Layout>
  );
};

export default BrandManagement;
