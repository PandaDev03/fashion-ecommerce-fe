import { Divider, Flex, FormItemProps, ModalProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import { LOGO } from '~/assets/svg';
import GoogleAuthButton from '~/shared/components/Button/GoogleAuthButton';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import InputPassword from '~/shared/components/Input/InputPassword';
import Modal from '~/shared/components/Modal/Modal';
import Switch from '~/shared/components/Switch/Switch';

const AuthModal = ({ ...props }: ModalProps) => {
  const [signInForm] = useForm();
  const [signUpForm] = useForm();

  const [isSignUpVisible, setIsSignUpVisible] = useState(true);

  const signInFormItems: FormItemProps[] = [
    {
      name: 'email',
      label: 'Email',
      children: <Input />,
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      children: <InputPassword type="password" />,
    },
    {
      name: 'remember',
      valuePropName: 'checked',
      children: (
        <Flex align="center" justify="space-between">
          <label>
            <Flex align="center" className="cursor-pointer gap-x-1">
              <Switch />
              <span className="text-primary">Ghi nhớ đăng nhập</span>
            </Flex>
          </label>
          <Link to={'/'} className="w-fit underline! text-primary!">
            Quên mật khẩu
          </Link>
        </Flex>
      ),
    },
  ];

  const signUpFormItems: FormItemProps[] = [
    {
      name: 'name',
      label: 'Tên',
      children: <Input />,
    },
    {
      name: 'email',
      label: 'Email',
      children: <Input />,
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      children: <InputPassword type="password" />,
    },
  ];

  const handleSignIn = (values: any) => {
    console.log('finish', values);
  };

  const handleSignUp = (values: any) => {
    console.log('finish', values);
  };

  const handleGoogleSignIn = () => {};

  return (
    <Modal
      classNames={{
        content: 'w-[450px]',
      }}
      {...props}
    >
      <Flex vertical align="center" className="w-full">
        <Flex vertical align="center" className="gap-y-2 mb-6!">
          <LOGO />
          <p className="text-body text-base text-center mt-2">
            {isSignUpVisible ? (
              <>
                Bằng cách đăng ký, bạn đồng ý với
                <span className="underline cursor-pointer hover:no-underline">
                  {' '}
                  các điều khoản{' '}
                </span>
                và
                <span className="underline cursor-pointer hover:no-underline">
                  {' '}
                  chính sách của chúng tôi
                </span>
              </>
            ) : (
              <>Đăng nhập bằng email và mật khẩu của bạn</>
            )}
          </p>
        </Flex>
        {isSignUpVisible ? (
          <Form form={signUpForm} onFinish={handleSignUp} submitTitle="Đăng ký">
            {signUpFormItems.map(({ children, ...props }, index) => (
              <FormItem key={index} {...props}>
                {children}
              </FormItem>
            ))}
          </Form>
        ) : (
          <Form
            form={signInForm}
            onFinish={handleSignIn}
            submitTitle="Đăng nhập"
          >
            {signInFormItems.map(({ children, ...props }, index) => (
              <FormItem key={index} {...props}>
                {children}
              </FormItem>
            ))}
          </Form>
        )}
        <Divider>
          <span className="text-xs text-body font-normal">Hoặc</span>
        </Divider>
        <GoogleAuthButton onClick={handleGoogleSignIn} />
        <span className="mt-5">
          {isSignUpVisible ? (
            <>
              Bạn đã có tài khoản?{' '}
              <span
                className="underline font-bold cursor-pointer"
                onClick={() => setIsSignUpVisible(false)}
              >
                Đăng nhập
              </span>
            </>
          ) : (
            <>
              Bạn chưa có tài khoản?{' '}
              <span
                className="underline font-bold cursor-pointer"
                onClick={() => setIsSignUpVisible(true)}
              >
                Đăng ký
              </span>
            </>
          )}
        </span>
      </Flex>
    </Modal>
  );
};

export default memo(AuthModal);
