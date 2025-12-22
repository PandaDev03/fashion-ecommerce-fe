import { Breadcrumb, Flex, Space } from 'antd';
import Layout from 'antd/es/layout/layout';
import { ReactNode, useState } from 'react';

import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { title } = useTitle();
  const { breadcrumb } = useBreadcrumb();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Flex align="start" className="w-full min-h-screen!">
        <Sidebar collapsed={collapsed} />
        <Space direction="vertical" className="w-full overflow-hidden">
          <Header onCollapse={() => setCollapsed(!collapsed)} />
          <Space size="middle" direction="vertical" className="w-full p-6!">
            <Flex align="center" justify="space-between">
              <h2 className="capitalize text-xl font-semibold text-primary">
                {title}
              </h2>
              <Breadcrumb items={breadcrumb} />
            </Flex>
            {children}
          </Space>
        </Space>
      </Flex>
    </Layout>
  );
};

export default AdminLayout;
