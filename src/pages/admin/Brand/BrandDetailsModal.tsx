import { CloseOutlined, GlobalOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Divider,
  Flex,
  FormInstance,
  ModalProps,
  Space,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import {
  ChangeEvent,
  Dispatch,
  forwardRef,
  memo,
  SetStateAction,
  useImperativeHandle,
} from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import { PROFILE_COVER_IMAGE, PROFILE_PICTURE } from '~/assets/images';
import {
  FacebookBrand,
  Global,
  InstagramBrand,
  Pen,
  Share,
  Trash,
} from '~/assets/svg';
import { IBrand } from '~/features/brand/types/brand';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import TextArea from '~/shared/components/Input/TextArea';
import Link from '~/shared/components/Link/Link';
import Modal from '~/shared/components/Modal/Modal';
import PopConfirm from '~/shared/components/PopConfirm/PopConfirm';
import {
  generateSlug,
  normalizeUrlWithHttps,
  removeUrlPrefix,
} from '~/shared/utils/function';
import { IBrandDetailsForm } from './BrandManagement';

interface BrandDetailsModalProps extends ModalProps {
  isEdit: boolean;
  selectedBrand: IBrand;
  fileList: UploadProps['fileList'];
  form: FormInstance<IBrandDetailsForm>;
  onDelete: (id: string) => void;
  onFinish: (values: IBrandDetailsForm) => void;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  setIsUploadModalVisible: Dispatch<SetStateAction<boolean>>;
}

const BrandDetailsModal = forwardRef(
  (
    {
      form,
      isEdit,
      fileList,
      loading,
      classNames,
      selectedBrand,
      onDelete,
      onFinish,
      setIsEdit,
      setIsUploadModalVisible,
      ...props
    }: BrandDetailsModalProps,
    ref
  ) => {
    const customClassNames: ModalProps['classNames'] = {
      header: '',
      body: 'pt-15! pb-8! px-8!',
      ...(isEdit && { footer: 'border-t! border-gray-200! m-0! py-2! px-5!' }),
      ...classNames,
    };

    const handleEditClick = (record?: IBrand) => {
      const { website, facebook, instagram, ...brand } =
        record ?? selectedBrand;

      const domainOnly = removeUrlPrefix({ website, facebook, instagram });
      form.setFieldsValue({ ...brand, ...domainOnly });
      // form.setFieldsValue({ ...selectedBrand });

      setIsEdit(true);
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const slug = generateSlug(value);
      form.setFieldValue('slug', slug);
    };

    useImperativeHandle(ref, () => ({
      handleEditClick,
    }));

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
            <div
              className="relative group w-[120px] h-[120px] top-20 left-5 rounded-full shadow-lg overflow-hidden"
              onClick={() => isEdit && setIsUploadModalVisible(true)}
            >
              <img
                src={
                  fileList?.[0]?.thumbUrl ||
                  selectedBrand?.logo ||
                  PROFILE_PICTURE
                }
                className="w-[120px] h-[120px] absolute left-0 top-0 object-cover z-10"
                onError={(event) => {
                  event.currentTarget.src = PROFILE_PICTURE;
                  event.currentTarget.srcset = PROFILE_PICTURE;
                }}
              />
              <Flex
                align="center"
                justify="center"
                className={`w-[120px] h-[120px] absolute left-0 top-0 text-transparent z-20 transition-all duration-300 ease-in-out ${
                  isEdit
                    ? 'group-has-hover:bg-[rgba(0,0,0,0.5)] group-has-hover:text-white cursor-pointer'
                    : ''
                }`}
              >
                <Pen />
              </Flex>
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
        <Form form={form} onFinish={onFinish}>
          <Space size="middle" direction="vertical" className="w-full">
            {isEdit ? (
              <FormItem
                name="name"
                spacing="none"
                label="TÊN THƯƠNG HIỆU"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên thương hiệu' },
                ]}
              >
                <Input
                  placeholder="VD: Nike, Addidas,..."
                  onChange={handleNameChange}
                />
              </FormItem>
            ) : (
              <h2 className="text-3xl font-semibold text-primary">
                {selectedBrand?.name || '-'}
              </h2>
            )}
            <Flex align="center" className="gap-x-3">
              <Button title="Share" disabled={isEdit} iconAfter={<Share />} />
              <Button
                title={<Pen />}
                disabled={isEdit}
                displayType="outlined"
                className="h-[38px]! enabled:bg-gray-200! border-none! hover:enabled:opacity-70! enabled:text-black!"
                onClick={() => handleEditClick()}
              />
              <PopConfirm
                title="Xóa mục này"
                description={
                  <p>
                    Bạn có chắc chắn muốn xóa thương hiệu
                    <span className="font-semibold">
                      {' '}
                      {selectedBrand?.name}
                    </span>
                    ?
                    <br />
                    Hành động này không thể hoàn tác.
                  </p>
                }
                onConfirm={() => onDelete(selectedBrand?.id)}
              >
                <Button
                  disabled={isEdit}
                  displayType="outlined"
                  title={
                    <Trash className={`${isEdit ? '' : 'text-red-500'}`} />
                  }
                  className="h-[38px]! enabled:bg-red-100! border-none! hover:enabled:opacity-70!"
                />
              </PopConfirm>
            </Flex>
            {isEdit ? (
              <>
                <FormItem
                  spacing="none"
                  label="SLUG"
                  name="slug"
                  rules={[
                    { required: true, message: 'Vui lòng nhập slug' },
                    {
                      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        'Chỉ chấp nhận chữ thường, số và dấu gạch ngang (-).',
                    },
                  ]}
                >
                  <Input placeholder="VD: nike, adiddas..." />
                </FormItem>
                <FormItem spacing="none" label="MÔ TẢ" name="description">
                  <TextArea
                    allowClear
                    size="large"
                    className="min-h-[150px]!"
                    placeholder="Mô tả về thương hiệu..."
                  />
                </FormItem>
                <FormItem spacing="none" label="WEBSITE" name="website">
                  <Input
                    allowClear
                    placeholder="https://example.com"
                    addonBefore={<Global className="stroke-[cornflowerblue]" />}
                  />
                </FormItem>
                <FormItem spacing="none" label="MẠNG XÃ HỘI">
                  <FormItem name="facebook">
                    <Input
                      allowClear
                      addonBefore={<FacebookBrand />}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </FormItem>
                  <FormItem spacing="none" name="instagram">
                    <Input
                      allowClear
                      addonBefore={<InstagramBrand />}
                      placeholder="https://instagram.com/yourusername"
                    />
                  </FormItem>
                </FormItem>
              </>
            ) : (
              <>
                <Space direction="vertical">
                  <p className="font-semibold text-sm uppercase text-body">
                    SLUG
                  </p>
                  <p className="text-primary">{selectedBrand?.slug || '-'}</p>
                </Space>
                <Space direction="vertical">
                  <p className="font-semibold text-sm uppercase text-body">
                    Mô tả
                  </p>
                  <p className="text-primary">
                    {selectedBrand?.description || '-'}
                  </p>
                </Space>
                <Space direction="vertical">
                  <p className="font-semibold text-sm uppercase text-body">
                    Website
                  </p>
                  {selectedBrand?.website ? (
                    <ReactRouterLink
                      target="_blank"
                      className="gap-x-1"
                      to={`${normalizeUrlWithHttps(selectedBrand?.website)}`}
                    >
                      <Flex align="center" gap={4}>
                        <GlobalOutlined />
                        <span>
                          {selectedBrand?.website.replace(
                            /^https?:\/\/(www\.)?/,
                            ''
                          )}
                        </span>
                      </Flex>
                    </ReactRouterLink>
                  ) : (
                    '-'
                  )}
                </Space>
                <Space direction="vertical">
                  <p className="font-semibold text-sm uppercase text-body">
                    Mạng xã hội
                  </p>
                  <Flex align="center" className="gap-x-2">
                    {!selectedBrand?.facebook && !selectedBrand?.instagram ? (
                      '-'
                    ) : (
                      <>
                        {selectedBrand?.facebook && (
                          <Link
                            target="_blank"
                            to={`${normalizeUrlWithHttps(
                              selectedBrand?.facebook
                            )}`}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100! rounded-full"
                          >
                            <FacebookBrand />
                          </Link>
                        )}
                        {selectedBrand?.instagram && (
                          <Link
                            target="_blank"
                            to={`${normalizeUrlWithHttps(
                              selectedBrand?.instagram
                            )}`}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100! rounded-full"
                          >
                            <InstagramBrand />
                          </Link>
                        )}
                      </>
                    )}
                  </Flex>
                </Space>
              </>
            )}
            {!isEdit && (
              <>
                <Divider className="my-1!" />
                <Space size="middle" direction="vertical">
                  <Flex align="center" className="gap-x-30">
                    <Flex vertical>
                      <p className="text-body">Ngày tạo:</p>
                      <p className="font-semibold text-primary">
                        {dayjs(selectedBrand?.createdAt).format(
                          'DD/MM/YYYY HH:mm:ss'
                        ) || '-'}
                      </p>
                    </Flex>
                    <Flex vertical>
                      <p className="text-body">Người tạo:</p>
                      <p className="font-semibold text-primary">
                        {selectedBrand?.creator?.name || '-'}
                      </p>
                    </Flex>
                  </Flex>
                  <Flex align="center" className="gap-x-30">
                    <Flex vertical>
                      <p className="text-body">Ngày chỉnh sửa:</p>
                      <p className="font-semibold text-primary">
                        {dayjs(selectedBrand?.updatedAt).format(
                          'DD/MM/YYYY HH:mm:ss'
                        ) || '-'}
                      </p>
                    </Flex>
                    <Flex vertical>
                      <p className="text-body">Người chỉnh sửa:</p>
                      <p className="font-semibold text-primary">
                        {selectedBrand?.updater?.name || '-'}
                      </p>
                    </Flex>
                  </Flex>
                </Space>
              </>
            )}
          </Space>
        </Form>
      </Modal>
    );
  }
);

export default memo(BrandDetailsModal);
