import charaMap from '@config/constants/charas.json';
import chara6xMap from '@config/constants/charas6x.json';
import { AppState } from '@store/store';
import * as React from 'react';
import { connect } from 'react-redux';

interface CharacterProps {
  width?: number,
  show1x?: boolean,
  cid: number,
  selected?: boolean,
  onSelect?: (k: number, l: boolean) => void,
  noBorder?: boolean,
  style?: React.CSSProperties,
  borderRadius?: number,
  borderWidth?: number,
  grey?: boolean,
  show6x?: boolean,
}

interface SubJsonProps {
  x: number,
  y: number,
}

interface JsonProps {
  [key: number]: SubJsonProps,
}

const Character: React.FC<CharacterProps & AppState> = ({ 
  cid = 100101, 
  width = 60, 
  show1x = false, 
  selected = false, 
  onSelect, 
  noBorder = false, 
  style = {}, 
  user, 
  borderRadius = 6, 
  borderWidth = 1, 
  grey = false, 
  show6x = false 
}) => {
  let charaid = cid; // in case of cid overflow
  let mapValue: SubJsonProps = (charaMap as JsonProps)[cid];
  if (!mapValue) {
    mapValue = (charaMap as JsonProps)[100101];
    charaid = 100101;
  }

  const shouldShow1x = user && user.isLogin && user.userInfo && user.userInfo.enable2x;
  if (show6x) {
    mapValue = (chara6xMap as JsonProps)[cid];
    if (!mapValue) {
      mapValue = (chara6xMap as JsonProps)[101101];
      charaid = 101101;
    }
  }

  let background;
  if (show6x) {
    background = `url("/static/sprites/charas6x.png")`;
  } else if (shouldShow1x || show1x) {
    background = `url("/static/sprites/charas_a.png")`;
  } else {
    background = `url("/static/sprites/charas.png")`;
  }

  const ratio = width / 60;
  const size = (show6x ? 184 : 618) * ratio; // width of charas.png
  const backX = mapValue.x * ratio;
  const backY = mapValue.y * ratio;

  const onClick = () => {
    if (onSelect) {
      onSelect(charaid, selected);
    }
  };
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${width}px`,
        backgroundImage: background,
        backgroundSize: `${size}px auto`,
        borderRadius: `${borderRadius}px`,
        backgroundPositionX: `-${backX}px`,
        backgroundPositionY: `-${backY}px`,
        opacity: selected ? 1 : 0.6,
        cursor: noBorder ? 'inherit' : 'pointer',
        border: selected && !noBorder ? `solid ${borderWidth}px #ffa500` : `solid ${borderWidth}px transparent`,
        display: 'inline-block',
        margin: '2px 2px',
        filter: grey ? "grayscale(1)" : "unset",
        ...style,
      }}
      onClick={(onClick)}
    />
  );
};

const mapStateToProps = (state: AppState) => {
  return state;
};

export default connect<AppState, {}, CharacterProps, AppState>(
  mapStateToProps
)(Character);