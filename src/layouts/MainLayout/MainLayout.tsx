import { Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ReactNode } from 'react';

import { SUBSCRIPTION_BG } from '~/assets/images';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import Footer from '../components/Footer/Footer';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isXl } = useBreakpoint();
  const [subscriptionForm] = useForm();

  return (
    <>
      <div>
        {children}

        <div className="px-4 md:px-8 2xl:px-16 mt-9 lg:mt-10 xl:mt-14">
          <Flex
            vertical
            align={isXl ? 'start' : 'center'}
            className="px-5! sm:px-8! md:px-16! 2xl:px-24! relative overflow-hidden sm:items-center xl:items-start rounded-lg bg-[#f9f9f9] py-10! md:py-14! lg:py-16!"
          >
            <div className="-mt-1.5 lg:-mt-2 xl:-mt-0.5 text-center ltr:xl:text-left rtl:xl:text-right mb-7 md:mb-8 lg:mb-9 xl:mb-0">
              <h3 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-heading mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5">
                Nhận lời khuyên của chuyên gia
              </h3>
              <p className="text-xs leading-6 text-body md:text-sm md:leading-7">
                Đăng ký nhận bản tin của chúng tôi và cập nhật thông tin mới
                nhất.
              </p>
            </div>
            <Form
              layout="inline"
              form={subscriptionForm}
              onFinish={(values) => console.log(values)}
              className="w-full shrink-0 sm:w-96 md:w-[545px] md:mt-7! z-1"
            >
              <FormItem className="w-full max-w-full md:max-w-[74%] mb-[2%]! md:mr-[2%]!">
                <Input
                  placeholder="Nhập email của bạn"
                  className="h-11 md:h-12 min-h-12"
                />
              </FormItem>
              <Button
                title="Đăng ký"
                className="w-full max-w-full md:max-w-[24%] text-sm leading-4 px-5! md:px-6! lg:px-8! py-4! md:py-3.5! lg:py-4! mt-3! sm:mt-0! md:h-full"
                onClick={() => subscriptionForm.submit()}
              />
            </Form>
            <div
              style={{ backgroundImage: `url(${SUBSCRIPTION_BG})` }}
              className="hidden xl:block absolute w-full h-full right-0 top-0 bg-contain bg-right bg-no-repeat z-0"
            ></div>
          </Flex>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
