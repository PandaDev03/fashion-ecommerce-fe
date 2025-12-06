import { CloseOutlined, GlobalOutlined } from '@ant-design/icons';
import { Divider, Flex, FormInstance, message, ModalProps, Space } from 'antd';
import { memo } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { PROFILE_COVER_IMAGE, PROFILE_PICTURE } from '~/assets/images';
import {
  FacebookOutlined,
  InstagramOutlined,
  Pen,
  Share,
  Trash,
} from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import Modal from '~/shared/components/Modal/Modal';
import { IBrandForm } from './BrandManagement';
import { IBrand } from '~/features/brand/types/brand';
import Link from '~/shared/components/Link/Link';
import dayjs from 'dayjs';

interface BrandModalProps extends ModalProps {
  selectedBrand: IBrand;
  form: FormInstance<IBrandForm>;
}

const BrandModal = ({
  form,
  classNames,
  selectedBrand,
  ...props
}: BrandModalProps) => {
  console.log('selectedBrand', selectedBrand);

  const customClassNames: ModalProps['classNames'] = {
    content: 'px-0! py-0!',
    body: 'pt-15! pb-8! px-8!',
    ...classNames,
  };

  return (
    <Modal
      centered
      width={700}
      closeIcon={
        <button className="bg-white px-2 rounded-full! shadow-lg cursor-pointer hover:opacity-90">
          <CloseOutlined className="[&>svg]:fill-black" />
        </button>
      }
      title={
        <div
          style={{ backgroundImage: `url(${PROFILE_COVER_IMAGE})` }}
          className={`relative h-36 bg-cover bg-center bg-no-repeat rounded-t-lg`}
        >
          <img
            width={120}
            height={120}
            src={selectedBrand?.logo}
            className="absolute rounded-full bottom-0 left-5 translate-y-[50%] shadow-lg"
            onError={(event) => {
              event.currentTarget.src = PROFILE_PICTURE;
              event.currentTarget.srcset = PROFILE_PICTURE;
            }}
          />
        </div>
      }
      classNames={customClassNames}
      {...props}
    >
      <Space size="large" direction="vertical">
        <h2 className="text-3xl font-semibold text-primary">
          {selectedBrand?.name || '-'}
        </h2>
        <Flex align="center" className="gap-x-3">
          <Button title="Share" iconAfter={<Share />} />
          <Button
            title={<Pen />}
            displayType="outlined"
            className="h-[38px]! bg-gray-200! border-none! hover:opacity-70! text-black!"
          />
          <Button
            displayType="outlined"
            title={<Trash className="text-red-500" />}
            className="h-[38px]! bg-red-100! border-none! hover:opacity-70!"
          />
        </Flex>
        <Space direction="vertical">
          <p className="font-semibold text-sm uppercase text-body">Mô tả</p>
          <p className="text-primary">{selectedBrand?.description || '-'}</p>
        </Space>
        <Space direction="vertical">
          <p className="font-semibold text-sm uppercase text-body">Website</p>
          {selectedBrand?.website ? (
            <ReactRouterLink
              target="_blank"
              className="gap-x-1"
              to={selectedBrand?.website}
            >
              <Flex align="center" gap={4}>
                <GlobalOutlined />
                <span>
                  {selectedBrand?.website.replace(/^https?:\/\/(www\.)?/, '')}
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
                    to={selectedBrand?.facebook}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100! rounded-full"
                  >
                    <FacebookOutlined />
                  </Link>
                )}
                {selectedBrand?.instagram && (
                  <Link
                    target="_blank"
                    to={selectedBrand?.instagram}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100! rounded-full"
                  >
                    <InstagramOutlined />
                  </Link>
                )}
              </>
            )}
          </Flex>
        </Space>
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
          <Flex vertical>
            <p className="text-body">Slug:</p>
            <p className="font-semibold text-primary">
              {selectedBrand?.slug || '-'}
            </p>
          </Flex>
        </Space>
      </Space>
    </Modal>
  );
};

export default memo(BrandModal);
