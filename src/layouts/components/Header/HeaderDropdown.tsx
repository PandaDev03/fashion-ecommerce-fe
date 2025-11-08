import { Divider, Flex } from 'antd';
import { memo, ReactElement } from 'react';

import { MenuItem } from './Header';

interface HeaderDropdown {
  children: ReactElement;
  menuItems: MenuItem[][];
}

const HeaderDropdown = ({ children, menuItems }: HeaderDropdown) => {
  return (
    <div className="relative group">
      {children}
      <div
        className="absolute rounded-xs opacity-0 invisible top-[130%] ltr:-left-28 rtl:-right-28 transition-all duration-300 ease-in-out group-has-hover:top-full group-has-hover:opacity-100 group-has-hover:visible"
        style={{
          boxShadow:
            'var(0 0 #0000, 0 0 #0000), var(0 0 #0000, 0 0 #0000), var(0 2px 3px rgba(0, 0, 0, .08))',
        }}
      >
        <Flex>
          {menuItems.map((menu, index) => (
            <Flex
              vertical
              key={index}
              className="w-max py-4!"
              style={{
                backgroundColor:
                  index % 2 == 0 ? 'rgb(249 249 249)' : 'rgb(244 244 244)',
              }}
            >
              {menu?.map((item) => {
                if (item?.type === 'divider')
                  return <Divider key={item.key} className="my-2!" />;

                return (
                  <div key={item.key}>
                    <p className="py-1.5 px-5 text-primary font-semibold hover:bg-[#e6e6e6]">
                      {item?.label}
                    </p>
                    {item?.children?.map((child) => (
                      <p
                        key={child.key}
                        className="py-1.5 px-5 text-body hover:text-primary hover:bg-[#e6e6e6]"
                      >
                        {child?.label}
                      </p>
                    ))}
                  </div>
                );
              })}
            </Flex>
          ))}
        </Flex>
      </div>
    </div>
  );
};

export default memo(HeaderDropdown);
