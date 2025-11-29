import { FormItemProps } from 'antd';
import { memo } from 'react';

import Form, { IFormProps } from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import InputPassword from '~/shared/components/Input/InputPassword';

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

const FormSignUp = ({ ...props }: IFormProps) => {
  return (
    <Form submitTitle="Đăng ký" {...props}>
      {signUpFormItems.map(({ children, ...props }, index) => (
        <FormItem key={index} {...props}>
          {children}
        </FormItem>
      ))}
    </Form>
  );
};

export default memo(FormSignUp);
