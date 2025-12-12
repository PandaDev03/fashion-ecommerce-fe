import { memo } from 'react';
import Dragger, { IDraggerProps } from '~/shared/components/Upload/Dragger';

const BrandUpload = ({ ...props }: IDraggerProps) => {
  return (
    <>
      <Dragger
        name="files"
        maxCount={1}
        listType="picture-card"
        hint="Hỗ trợ tệp tin: PNG, JPG, JPEG, WEBP"
        {...props}
      />
    </>
  );
};

export default memo(BrandUpload);
