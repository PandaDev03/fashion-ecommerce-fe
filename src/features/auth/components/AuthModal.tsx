import { Divider, Flex, ModalProps } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { Dispatch, memo, SetStateAction } from 'react';

import { LOGO } from '~/assets/svg';
import {
  ISignIn,
  ISignInWithGoogle,
  ISignUp,
} from '~/features/auth/types/auth';
import { IForgotPasswordForm, IFormVisible } from '~/layouts/BaseLayout';
import GoogleAuthButton from '~/shared/components/Button/GoogleAuthButton';
import Modal from '~/shared/components/Modal/Modal';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSignIn from './FormSignIn';
import FormSignUp from './FormSignUp';

interface AuthModalProps extends ModalProps {
  loading?: boolean;
  isFormVisible: IFormVisible;
  signUpForm: FormInstance<ISignUp>;
  signInForm: FormInstance<ISignIn>;
  forgotPasswordForm: FormInstance<IForgotPasswordForm>;
  onSignUp: (values: ISignUp) => void;
  onSignIn: (values: ISignIn) => void;
  onForgotPassword: (values: IForgotPasswordForm) => void;
  onSignInWithGoogle: (values: ISignInWithGoogle) => void;
  setIsFormVisible: Dispatch<SetStateAction<IFormVisible>>;
}

const AuthModal = ({
  loading,
  signUpForm,
  signInForm,
  forgotPasswordForm,
  isFormVisible,
  onSignUp,
  onSignIn,
  onForgotPassword,
  onSignInWithGoogle,
  setIsFormVisible,
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
            {isFormVisible?.recoverVisible ? (
              'Chúng tôi sẽ gửi cho bạn một đường dẫn để đặt lại mật khẩu.'
            ) : isFormVisible?.signInVisible ? (
              'Đăng nhập bằng email và mật khẩu của bạn'
            ) : (
              <>
                Bằng cách đăng ký, bạn đồng ý với&nbsp;
                <span className="underline cursor-pointer hover:no-underline">
                  các điều khoản&nbsp;
                </span>
                và&nbsp;
                <span className="underline cursor-pointer hover:no-underline">
                  chính sách của chúng tôi
                </span>
              </>
            )}
          </p>
        </Flex>
        {isFormVisible?.recoverVisible ? (
          <ForgotPasswordForm
            loading={loading}
            form={forgotPasswordForm}
            onFinish={onForgotPassword}
          />
        ) : isFormVisible?.signInVisible ? (
          <FormSignIn
            loading={loading}
            form={signInForm}
            onFinish={onSignIn}
            setIsFormVisible={setIsFormVisible}
          />
        ) : (
          <FormSignUp loading={loading} form={signUpForm} onFinish={onSignUp} />
        )}

        <Divider>
          <span className="text-xs text-body font-normal">Hoặc</span>
        </Divider>
        {isFormVisible?.recoverVisible ? (
          <span>
            Quay lại&nbsp;
            <span
              className="font-semibold text-primary underline cursor-pointer hover:no-underline"
              onClick={() =>
                setIsFormVisible({
                  signInVisible: true,
                  signUpVisible: false,
                  recoverVisible: false,
                })
              }
            >
              Đăng nhập
            </span>
          </span>
        ) : (
          <GoogleAuthButton loading={loading} onClick={onSignInWithGoogle} />
        )}

        <span className="mt-5">
          {isFormVisible?.recoverVisible ? (
            <p></p>
          ) : isFormVisible?.signInVisible ? (
            <>
              Bạn chưa có tài khoản?{' '}
              <span
                className="underline font-bold cursor-pointer"
                onClick={() =>
                  setIsFormVisible({
                    recoverVisible: false,
                    signInVisible: false,
                    signUpVisible: true,
                  })
                }
              >
                Đăng ký
              </span>
            </>
          ) : (
            <>
              Bạn đã có tài khoản?{' '}
              <span
                className="underline font-bold cursor-pointer"
                onClick={() =>
                  setIsFormVisible({
                    recoverVisible: false,
                    signInVisible: true,
                    signUpVisible: false,
                  })
                }
              >
                Đăng nhập
              </span>
            </>
          )}
        </span>
      </Flex>
    </Modal>
  );
};

export default memo(AuthModal);
