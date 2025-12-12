import { ConfigProvider, Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { memo } from 'react';

const { TextArea: AntTextArea } = Input;

const TextArea = ({ ...props }: TextAreaProps) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: '#212121',
            activeBorderColor: '#212121',
            activeShadow: '0 0 0 2px rgba(44,44,45,0.1)',
          },
        },
      }}
    >
      <AntTextArea {...props} />
    </ConfigProvider>
  );
};

export default memo(TextArea);
