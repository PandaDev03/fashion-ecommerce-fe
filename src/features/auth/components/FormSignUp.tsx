import { FormItemProps } from 'antd';
import { memo, useState } from 'react';

import Form, { IFormProps } from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import InputPassword from '~/shared/components/Input/InputPassword';

const signUpFormItems: FormItemProps[] = [
  {
    name: 'name',
    label: 'Tên',
    children: <Input />,
    rules: [{ required: true, message: 'Vui lòng nhập tên' }],
  },
  {
    name: 'email',
    label: 'Email',
    children: <Input />,
    rules: [
      { required: true, message: 'Vui lòng nhập email' },
      { type: 'email', message: 'Email không đúng định dạng' },
    ],
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    children: <InputPassword type="password" />,
    rules: [
      { required: true, message: 'Vui lòng nhập mật khẩu' },
      { min: 8, message: 'Mật khẩu phải có ít nhât 8 ký tự' },
    ],
  },
];

const FormSignUp = ({ ...props }: IFormProps) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleFinishFailed = () => {
    setHasSubmitted(true);
  };

  return (
    <Form
      submitTitle="Đăng ký"
      validateTrigger={hasSubmitted ? 'onChange' : 'onSubmit'}
      onFinishFailed={handleFinishFailed}
      {...props}
    >
      {signUpFormItems.map(({ children, ...props }, index) => (
        <FormItem key={index} {...props}>
          {children}
        </FormItem>
      ))}
    </Form>
  );
};

export default memo(FormSignUp);
