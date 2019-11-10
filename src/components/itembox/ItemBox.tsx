import * as React from 'react';

interface ItemBoxProps {
  children: React.ReactNode
  style?: React.CSSProperties | undefined
  className?: string | undefined
}

const ItemBox: React.FC<ItemBoxProps> = ({ children, style, className }) => {
  const classname = `global_itembox_ctn${className ? ` ${className}` : ''}`;
  return (
    <div className={classname} style={style}>
      {children}
    </div>
  );
};

export default ItemBox;