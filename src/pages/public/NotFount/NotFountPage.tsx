import { Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

import { HomeFilled, NotFound, PlaceholderLarge } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import { Layout } from '~/shared/components/Layout/Layout';
import { PATH } from '~/shared/utils/path';

const NotFountPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Flex
        vertical
        align="center"
        justify="center"
        className="w-full border-b border-gray-200 text-center px-16! py-16! sm:py-20! lg:py-24! xl:py-32!"
      >
        <div className="relative max-w-full">
          <span
            style={{
              width: 'initial',
              height: 'initial',
            }}
          >
            <PlaceholderLarge
              style={{
                width: 'initial',
                height: 'initial',
              }}
              className="block min-w-full max-w-full min-h-full max-h-full"
            />
            <NotFound className="absolute inset-0 top-0 right-0 min-w-full max-w-full min-h-full max-h-full" />
          </span>
        </div>
        <Flex vertical align="center">
          <h3 className="font-bold text-primary text-5xl xl:text-8xl">404</h3>
          <p className="text-sm text-body md:text-base leading-7 pt-2 md:pt-3.5 pb-7 md:pb-9">
            Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
          </p>
          <Button
            title={
              <Flex align="center" className="font-normal">
                <HomeFilled />
                <p className="ltr:pl-1.5 rtl:pr-1.5 ">Về trang chủ</p>
              </Flex>
            }
            onClick={() => navigate(PATH.HOME)}
          />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default NotFountPage;
