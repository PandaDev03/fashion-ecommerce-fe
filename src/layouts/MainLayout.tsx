import { Layout } from 'antd';
import { ReactNode } from 'react';

import { Footer, Header } from './components';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout className="min-h-screen bg-white!">
      <Header />
      <div>{children}</div>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
