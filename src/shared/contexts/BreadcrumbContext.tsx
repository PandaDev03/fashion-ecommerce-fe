import { BreadcrumbProps } from 'antd';
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from 'react';

type BreadcrumbItems = BreadcrumbProps['items'];

interface BreadCrumbContextType {
  breadcrumb: BreadcrumbItems;
  setBreadcrumb: Dispatch<BreadcrumbItems>;
}

const BreadCrumbContext = createContext<BreadCrumbContextType | undefined>(
  undefined
);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItems>([]);

  return (
    <BreadCrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadCrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadCrumbContext);
  if (!context)
    throw new Error('useBreadcrumb must be used within BreadcrumbProvider');

  return context;
};
