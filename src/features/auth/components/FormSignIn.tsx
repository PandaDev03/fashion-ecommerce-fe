import { Flex, FormItemProps } from 'antd';
import { memo } from 'react';
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

const FormSignIn = ({ ...props }: IFormProps) => {
  return (
    <Form submitTitle="Đăng nhập" {...props}>
      {signInFormItems.map(({ children, ...props }, index) => (
        <FormItem key={index} {...props}>
          {children}
        </FormItem>
      ))}
    </Form>
  );
};

export default memo(FormSignIn);
