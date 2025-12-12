import { Divider, Flex, ModalProps } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { Dispatch, memo, SetStateAction } from 'react';

import { LOGO } from '~/assets/svg';
import {
  ISignIn,
  ISignInWithGoogle,
  ISignUp,
} from '~/features/auth/types/auth';
import GoogleAuthButton from '~/shared/components/Button/GoogleAuthButton';
import Modal from '~/shared/components/Modal/Modal';
import FormSignIn from './FormSignIn';
import FormSignUp from './FormSignUp';

interface AuthModalProps extends ModalProps {
  loading?: boolean;
  isSignUpVisible: boolean;
  signUpForm: FormInstance<ISignUp>;
  signInForm: FormInstance<ISignIn>;
  onSignUp: (values: ISignUp) => void;
  onSignIn: (values: ISignIn) => void;
  onSignInWithGoogle: (values: ISignInWithGoogle) => void;
  setIsSignUpVisible: Dispatch<SetStateAction<boolean>>;
}

const AuthModal = ({
  loading,
  signUpForm,
  signInForm,
  isSignUpVisible,
  onSignUp,
  onSignIn,
  onSignInWithGoogle,
  setIsSignUpVisible,
  ...props
}: AuthModalProps) => {
  return (
    <Modal
      centered
      footer={false}
      classNames={{
        content: 'p-0! max-w-[450px]',
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
          <FormSignUp loading={loading} form={signUpForm} onFinish={onSignUp} />
        ) : (
          <FormSignIn loading={loading} form={signInForm} onFinish={onSignIn} />
        )}
        <Divider>
          <span className="text-xs text-body font-normal">Hoặc</span>
        </Divider>
        <GoogleAuthButton loading={loading} onClick={onSignInWithGoogle} />
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
