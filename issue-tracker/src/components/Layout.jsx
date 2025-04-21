import React from 'react';

const Layout = ({ children, centered = true }) => {
  const layoutClasses = centered
    ? 'min-h-screen flex flex-col items-center justify-center px-4 text-center'
    : 'min-h-screen px-4';

  return (
    <div className={`bg-blue-50 text-gray-800 font-sans ${layoutClasses}`}>
      {children}
    </div>
  );
};

export default Layout;
