import React from 'react';

export const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

const Card = ({ children }) => {
  return (
    <div className="block max-w-sm p-6 bg-white border border-gray-200 shadow-sm hover:bg-gray-100 dark:bg-blue-950 dark:border-gray-700 dark:hover:bg-gray-700">
      {children}
    </div>
  );
};

export default Card;
