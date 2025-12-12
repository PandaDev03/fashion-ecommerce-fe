import { CloudUploadOutlined } from '@ant-design/icons';
import { ConfigProvider, GetProp, Upload, UploadProps } from 'antd';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';

export interface IDraggerProps extends UploadProps {
  icon?: ReactNode;
  title?: ReactNode;
  hint?: ReactNode;
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Dragger: DraggerAntd } = Upload;

const Dragger = ({
  icon,
  hint,
  title,
  children,
  className,
  ...props
}: IDraggerProps) => {
  const customClass = classNames('w-full', className);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryHover: '#212121',
        },
      }}
    >
      <DraggerAntd className={customClass} {...props}>
        {children ?? (
          <>
            <p className="ant-upload-drag-icon">
              {icon ?? <CloudUploadOutlined />}
            </p>
            <p className="ant-upload-text">
              {title ?? 'Nhấn vào hoặc kéo thả tệp tin để tải lên'}
            </p>
            <p className="ant-upload-hint">
              {hint ?? 'Hỗ trợ tệp tin: PDF, DOC, DOCX'}
            </p>
          </>
        )}
      </DraggerAntd>
    </ConfigProvider>
  );
};

export default memo(Dragger);
