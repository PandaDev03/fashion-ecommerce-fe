import { Table as AntdTable, TablePaginationConfig, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

interface IBaseTWithID {
  id: number | string;
}

const Table = <T extends IBaseTWithID>({
  columns,
  pagination,
  loading,
  ...props
}: TableProps<T>) => {
  const paginationParams = pagination as TablePaginationConfig;

  const formattedColumns = columns?.map((col) => ({
    ...col,
    onCell: () => ({
      style: {
        maxWidth: col?.width || 'auto',
      },
    }),
    render: (value, record, index) => {
      const valueIsNotValid =
        value === undefined || value === null || value === '';

      return col.render
        ? valueIsNotValid
          ? '-'
          : col.render(value, record, index)
        : valueIsNotValid
        ? '-'
        : value;
    },
  })) as ColumnsType<any>;

  return (
    <AntdTable
      size="middle"
      loading={loading}
      columns={formattedColumns}
      scroll={{ x: 'max-content' }}
      rowKey={(record) => record?.id ?? 'id'}
      rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
      pagination={
        paginationParams && {
          current: paginationParams?.current ?? 1,
          pageSize: paginationParams?.pageSize ?? 10,
          ...(paginationParams?.onChange && {
            onChange: paginationParams.onChange,
          }),
          pageSizeOptions: [1, 10, 20],
          showSizeChanger: true,
          className: classNames(
            'items-center !mb-0 !mt-5 [&>li]:!mr-[8px]',
            paginationParams?.className
          ),
          ...paginationParams,
        }
      }
      {...props}
    />
  );
};

export default Table;
