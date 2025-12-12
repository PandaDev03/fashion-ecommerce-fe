import { ConfigProvider, DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { memo } from 'react';

const { RangePicker: AntRangePicker } = DatePicker;

const RangePicker = ({ ...props }: RangePickerProps) => {
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
      <AntRangePicker
        size="large"
        format="DD/MM/YYYY"
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        {...props}
      />
    </ConfigProvider>
  );
};

export default memo(RangePicker);
