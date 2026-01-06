import { Form as AntForm, Col, FormInstance, FormProps, Row } from 'antd';
import { InternalNamePath } from 'antd/es/form/interface';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';

import Button from '../Button/Button';

export interface IFormProps extends FormProps {
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  submitTitle?: string;
  cancelTitle?: string;
  form: FormInstance<any>;
  footer?: ReactNode;
  cancelClass?: string;
  submitClass?: string;
  onCancel?: () => void;
  onFinish(values: any): void;
}

interface IErrorFields {
  name: InternalNamePath;
  errors: string[];
}

const Form = ({
  form,
  footer,
  children,
  cancelTitle,
  submitTitle,
  loading = false,
  className = 'w-full',
  cancelClass,
  submitClass,
  onCancel,
  onFinish,
  ...props
}: IFormProps) => {
  const customClass = classNames('w-full', className);

  const checkFormValidate = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleFinish = async (values: any) => {
    if (!(await checkFormValidate())) return;

    onFinish(values);
  };

  const handleFinishFailed = (errorFields: IErrorFields[]) => {
    if (!errorFields.length) return;

    form.scrollToField(errorFields[0].name, {
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <AntForm
      form={form}
      size="small"
      layout="vertical"
      autoComplete="on"
      className={customClass}
      onFinish={handleFinish}
      onFinishFailed={({ errorFields }) => handleFinishFailed(errorFields)}
      {...props}
    >
      {children}
      {footer || (
        <Row gutter={[12, 12]} justify={'end'}>
          {cancelTitle && (
            <Col>
              <Button
                title={cancelTitle}
                className={cancelClass}
                onClick={onCancel}
              />
            </Col>
          )}
          {submitTitle && (
            <Col span={cancelTitle ? undefined : 24}>
              <Button
                type="submit"
                loading={loading}
                title={submitTitle}
                className={classNames('w-full', submitClass)}
              />
            </Col>
          )}
        </Row>
      )}
    </AntForm>
  );
};

export default memo(Form);
