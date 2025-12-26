import {
  Breadcrumb,
  BreadcrumbProps,
  Divider,
  Flex,
  Slider,
  Space,
} from 'antd';
import classNames from 'classnames';
import { Dispatch, memo, SetStateAction } from 'react';

import { ArrowLeftOutlined, CloseOutlined } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import { Checkbox } from '~/shared/components/Checkbox/Checkbox';
import Drawer from '~/shared/components/Drawer/Drawer';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import { IFilterParams, IOption } from './ProductPage';

interface FilterProps {
  rangePrice: number[];
  totalProducts?: number;
  className?: string;
  isOpenFilterDrawer: boolean;
  filterParams: IFilterParams;
  categoryOptions: IOption[];
  brandOptions: IOption[];
  onClose: () => void;
  onClearFilter: () => void;
  setFilterParams: Dispatch<SetStateAction<IFilterParams>>;
  setRangPrice: Dispatch<SetStateAction<number[]>>;
}

type FilterContentProps = Omit<
  FilterProps,
  'className' | 'onClose' | 'isOpenFilterDrawer'
> & {
  isBreadcrumb?: boolean;
};

const FilterContent = ({
  isBreadcrumb = false,
  rangePrice,
  filterParams,
  categoryOptions,
  brandOptions,
  setRangPrice,
  setFilterParams,
  onClearFilter,
}: FilterContentProps) => {
  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      key: 'home',
      title: 'Trang chủ',
      href: '/',
    },
    {
      key: 'products',
      title: 'Sản phẩm',
    },
  ];

  const handleRemoveParams = (slug: string) => {
    setFilterParams((prev) => {
      const newFilterParams = Object.entries(prev).map((item) => {
        const [key, values] = item;

        const newValues = Array.isArray(values)
          ? values?.filter((val) => val?.value !== slug)
          : values;

        return [key, newValues];
      });

      return Object.fromEntries(newFilterParams);
    });
  };

  return (
    <Flex vertical className="w-full gap-y-7">
      {isBreadcrumb && <Breadcrumb items={breadcrumbItems} />}
      <Flex vertical className="gap-y-3">
        <Flex align="center" justify="space-between" className="w-full">
          <h2 className="font-semibold text-primary text-xl md:text-2xl">
            Bộ lọc
          </h2>
          <Button
            displayType="text"
            title="Xóa tất cả"
            onClick={onClearFilter}
          />
        </Flex>
        <Flex wrap className="gap-2">
          {Object.entries(filterParams)?.map((item) => {
            const [_, values] = item;

            return values?.map((val: any, index: number) => (
              <div
                key={index}
                className="group flex shrink-0 items-center border border-gray-300 bg-gray-100 rounded-lg text-xs px-3.5 py-2.5 capitalize text-primary cursor-pointer transition duration-200 ease-in-out hover:border-primary"
                onClick={() => handleRemoveParams(val?.value)}
              >
                {val?.label}
                <CloseOutlined />
              </div>
            ));
          })}
        </Flex>
      </Flex>

      <Divider className="my-1!" />

      <Space size="middle" direction="vertical">
        <h3 className="text-sm text-primary md:text-base font-semibold">
          Danh mục
        </h3>
        <Flex vertical className="gap-y-4">
          {categoryOptions?.map((item, index) => {
            const isChecked = !!filterParams?.categories?.find(
              (cat) => cat?.value === item?.value
            );

            return (
              <div key={index}>
                <label
                  className="flex gap-x-4 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();

                    setFilterParams((prev) => {
                      const currentCategories = prev?.categories ?? [];
                      const targetValue = item?.value;

                      if (!targetValue) return prev;

                      const isExistingOption = !!currentCategories.find(
                        (currentCat) => currentCat?.value === targetValue
                      );

                      let newCategories;
                      if (isExistingOption)
                        newCategories = currentCategories?.filter(
                          (currentCat) => currentCat?.value !== targetValue
                        );
                      else newCategories = [...currentCategories, item];

                      return {
                        ...prev,
                        categories: newCategories,
                      };
                    });
                  }}
                >
                  <Checkbox checked={isChecked} />
                  {item?.label}
                </label>
              </div>
            );
          })}
        </Flex>
      </Space>

      <Divider className="my-1!" />

      <Space size="middle" direction="vertical">
        <h3 className="text-sm text-primary md:text-base font-semibold">
          Thương hiệu
        </h3>
        <Flex vertical className="gap-y-4">
          {brandOptions?.map((item, index) => {
            const isChecked = !!filterParams?.brands?.find(
              (cat) => cat?.value === item?.value
            );

            return (
              <div key={index}>
                <label
                  className="flex gap-x-4 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();

                    setFilterParams((prev) => {
                      const currentBrands = prev?.brands ?? [];
                      const targetValue = item?.value;

                      if (!targetValue) return prev;

                      const isExistingOption = !!currentBrands.find(
                        (currentBrand) => currentBrand?.value === targetValue
                      );

                      let newBrands;
                      if (isExistingOption)
                        newBrands = currentBrands?.filter(
                          (currentBrand) => currentBrand?.value !== targetValue
                        );
                      else newBrands = [...currentBrands, item];

                      return {
                        ...prev,
                        brands: newBrands,
                      };
                    });
                  }}
                >
                  <Checkbox checked={isChecked} />
                  {item?.label}
                </label>
              </div>
            );
          })}
        </Flex>
      </Space>

      <Divider className="my-1!" />

      <Space size="middle" direction="vertical">
        <h3 className="text-sm text-primary md:text-base font-semibold">Giá</h3>
        <Slider
          range
          min={0}
          max={20000}
          value={rangePrice}
          marks={{ 0: 0, 20000: 20000 }}
          onChange={setRangPrice}
        />
      </Space>
    </Flex>
  );
};

const Filter = ({
  isOpenFilterDrawer,
  rangePrice,
  totalProducts,
  filterParams,
  categoryOptions,
  brandOptions,
  className,
  setRangPrice,
  setFilterParams,
  onClose,
  onClearFilter,
}: FilterProps) => {
  const { isLg } = useBreakpoint();

  return isLg ? (
    <div
      className={classNames('w-full hidden lg:block max-w-96 pt-8!', className)}
    >
      <FilterContent
        isBreadcrumb
        rangePrice={rangePrice}
        filterParams={filterParams}
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
        setRangPrice={setRangPrice}
        setFilterParams={setFilterParams}
        onClearFilter={onClearFilter}
      />
    </div>
  ) : (
    <Drawer
      placement="left"
      open={isOpenFilterDrawer}
      className="block lg:hidden"
      closeIcon={
        <p className="text-2xl">
          <ArrowLeftOutlined />
        </p>
      }
      title={
        <h2 className="font-bold text-xl md:text-2xl m-0 text-heading w-full text-center ltr:pr-6 rtl:pl-6">
          Bộ lọc
        </h2>
      }
      footer={
        <Flex align="center" justify="center" className="w-full">
          <p className="text-sm md:text-base leading-4 flex items-center justify-center px-7 bg-heading text-white">
            {totalProducts ?? 0} mục
          </p>
        </Flex>
      }
      classNames={{
        wrapper: 'max-md:w-[80%]! md:min-w-[450px]',
        header: '',
        footer: 'bg-primary',
      }}
      onClose={onClose}
    >
      <FilterContent
        rangePrice={rangePrice}
        filterParams={filterParams}
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
        setRangPrice={setRangPrice}
        setFilterParams={setFilterParams}
        onClearFilter={onClearFilter}
      />
    </Drawer>
  );
};

export default memo(Filter);
