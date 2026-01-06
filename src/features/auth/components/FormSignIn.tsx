import { Flex, FormItemProps } from 'antd';
import { Dispatch, memo, SetStateAction, useState } from 'react';

import { IFormVisible } from '~/layouts/BaseLayout';
import Button from '~/shared/components/Button/Button';
import Form, { IFormProps } from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import InputPassword from '~/shared/components/Input/InputPassword';
import Switch from '~/shared/components/Switch/Switch';

interface IFormSignInProps extends IFormProps {
  setIsFormVisible: Dispatch<SetStateAction<IFormVisible>>;
}

const FormSignIn = ({ setIsFormVisible, ...props }: IFormSignInProps) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const signInFormItems: FormItemProps[] = [
    {
      name: 'email',
      label: 'Email',
      children: <Input placeholder="example@gmail.com" />,
      rules: [
        { required: true, message: 'Vui lòng nhập email' },
        { type: 'email', message: 'Email không đúng định dạng' },
      ],
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      children: (
        <InputPassword type="password" placeholder="Tối thiểu 8 ký tự" />
      ),
      rules: [
        { required: true, message: 'Vui lòng nhập mật khẩu' },
        { min: 8, message: 'Mật khẩu phải có ít nhât 8 ký tự' },
      ],
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
          <Button
            displayType="text"
            className="w-fit underline! text-primary!"
            title="Quên mật khẩu"
            onClick={() =>
              setIsFormVisible({
                signInVisible: false,
                signUpVisible: false,
                recoverVisible: true,
              })
            }
          ></Button>
        </Flex>
      ),
    },
  ];

  const handleFinishFailed = () => {
    setHasSubmitted(true);
  };

  return (
    <Form
      submitTitle="Đăng nhập"
      validateTrigger={hasSubmitted ? 'onChange' : 'onSubmit'}
      onFinishFailed={handleFinishFailed}
      {...props}
    >
      {signInFormItems.map(({ children, ...formItemProps }, index) => (
        <FormItem key={index} {...formItemProps}>
          {children}
        </FormItem>
      ))}
    </Form>
  );
};

export default memo(FormSignIn);
