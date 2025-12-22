import { Flex, FormItemProps } from 'antd';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import Form, { IFormProps } from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import InputPassword from '~/shared/components/Input/InputPassword';
import Switch from '~/shared/components/Switch/Switch';

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
    children: <InputPassword type="password" placeholder="Tối thiểu 8 ký tự" />,
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
        <Link to={'/'} className="w-fit underline! text-primary!">
          Quên mật khẩu
        </Link>
      </Flex>
    ),
  },
];

const FormSignIn = ({ ...props }: IFormProps) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
      {signInFormItems.map(({ children, ...props }, index) => (
        <FormItem key={index} {...props}>
          {children}
        </FormItem>
      ))}
    </Form>
  );
};

export default memo(FormSignIn);
