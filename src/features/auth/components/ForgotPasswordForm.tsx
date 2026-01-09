import { memo } from 'react';

import Form, { IFormProps } from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';

const ForgotPasswordForm = ({ ...props }: IFormProps) => {
  return (
    <Form submitTitle="Khôi phục mật khẩu" {...props}>
      <FormItem
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không đúng định dạng' },
        ]}
      >
        <Input placeholder="VD: example@gmail.com" />
      </FormItem>
    </Form>
  );
};

export default memo(ForgotPasswordForm);
