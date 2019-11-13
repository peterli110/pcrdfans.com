import { comicMaxIndex } from '@config/index';
import { randomInt } from '@utils/index';
import { default as React, ReactNode, useEffect, useState } from 'react';

interface MessageBoxProps {
  title: string,
  date?: string,
  type: 'info' | 'update',
  showImage?: boolean,
  extra?: ReactNode,
  messageStyle?: React.CSSProperties,
}



const MessageBox: React.FC<MessageBoxProps> = ({ 
  title, 
  date, 
  type, 
  showImage = true, 
  extra,
  messageStyle,
 }) => {
  const [imgIndex, setImgIndex] = useState(0);
  
  useEffect(() => {
    if (showImage) {
      setImgIndex(randomInt(1, comicMaxIndex));
    }
  }, []);

  const url = `/static/comic/${imgIndex}.jpg`;
  const typeurl = `/static/info/${type}.png`;
  return (
    <div className="messagebox_announce">
      <div className="messagebox_inner">
        {
          imgIndex > 0 && showImage
            ?
            <div
              className="messagebox_profile_img"
              style={{backgroundImage: `url(${url})`, 
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
            />
            :
            null
        }
        <div className="messagebox_left">
          <div className="messagebox_data">
            <ul className="messagebox_upper">
              <li className="messagebox_title_ctn">
                <img src={typeurl} className="messagebox_info_img" />
                <span
                  className="messagebox_title"
                  style={messageStyle}
                >
                  {title}
                </span>
                {
                  extra ? extra : null
                }
              </li>
            </ul>
            <div className="messagebox_downer">
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;