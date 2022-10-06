import React, { FC } from 'react';
import Header from './Header';

type LayoutProps = {
  children?: JSX.Element | JSX.Element[];
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return <div className="flex flex-col h-screen">{children}</div>;
};

export default Layout;
