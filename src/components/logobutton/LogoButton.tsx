import Link from 'next/link';
import * as React from 'react';

interface LogoButtonProps {
  logo: string,
  href?: string,
  title: string,
  kyaru?: boolean
}



const LogoButton: React.FC<LogoButtonProps> = ({ logo, href = "", title, kyaru = false }) => {
  const url = kyaru ? `/static/kyaru.png` : `/static/button/${logo}.jpg`;
  return (
    <div className="logobutton_ctn">
      <Link href={href}>
        <a style={{display: 'block'}}>
          <img src={url} className="logobutton_logo" />
          <div className="body_textcenter logobutton_title">{title}</div>
        </a>
      </Link>
    </div>
  );
};

export default LogoButton;