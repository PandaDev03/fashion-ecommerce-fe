import {
  DatePicker as AntdDatePicker,
  ConfigProvider,
  DatePickerProps,
} from 'antd';
import { memo } from 'react';

const DatePicker = ({ ...props }: DatePickerProps) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            colorPrimary: '#212121',
            hoverBorderColor: '#212121',
            activeBorderColor: '#212121',
            activeShadow: '0 0 0 2px rgba(44,44,45,0.1)',
          },
        },
      }}
    >
      <AntdDatePicker size="large" format="DD/MM/YYYY" {...props} />
    </ConfigProvider>
  );
};

export default memo(DatePicker);
