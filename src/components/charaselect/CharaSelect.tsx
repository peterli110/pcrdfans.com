import Character from '@components/character/Character';
import UnitsA from '@config/constants/unita.json';
import { UnitData } from '@type/unit';
import { reverseCompare } from '@utils/functions';
import { Collapse } from 'antd';
import * as React from 'react';

const { Panel } = Collapse;
const UnitsArr: UnitData[] = UnitsA;


interface CharaSelectProps {
  onChange: (k: number, l: boolean) => void,
  values: Set<number>,
  activePanel?: string[],
  onPanelSwitch?: (key: any) => void,
  width?: number,
}


const CharaSelect: React.FC<CharaSelectProps> = ({ onChange, values, onPanelSwitch = () => void (0), activePanel = [], width = 50 }) => {
  const frontCharas = UnitsArr.filter((e: UnitData) => e.place === 1)
    .sort(reverseCompare).map((e: UnitData, i: number) => {
      return (
        <Character
          cid={e.id}
          key={i}
          selected={values.has(e.id)}
          onSelect={onChange}
          width={width}
        />
      );
    });

  const middleCharas = UnitsArr.filter((e: UnitData) => e.place === 2)
    .sort(reverseCompare).map((e: UnitData, i: number) => {
      return (
        <Character
          cid={e.id}
          key={i}
          selected={values.has(e.id)}
          onSelect={onChange}
          width={width}
        />
      );
    });

  const backCharas = UnitsArr.filter((e: UnitData) => e.place === 3)
    .sort(reverseCompare).map((e: UnitData, i: number) => {
      return (
        <Character
          cid={e.id}
          key={i}
          selected={values.has(e.id)}
          onSelect={onChange}
          width={width}
        />
      );
    });

  const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    border: 0,
    overflow: 'hidden',
  };

  const logoStyle = {
    height: '16px',
    width: '16px'
  };

  const frontHeader =
    <span>
      <img src="/static/button/position_front.png" style={logoStyle} />
      {`  前卫`}
    </span>;

  const middleHeader =
    <span>
      <img src="/static/button/position_middle.png" style={logoStyle} />
      {`  中卫`}
    </span>;

  const backHeader =
    <span>
      <img src="/static/button/position_back.png" style={logoStyle} />
      {`  后卫`}
    </span>;

  return (
    <Collapse activeKey={activePanel} onChange={onPanelSwitch}>
      <Panel header={frontHeader} key="front" style={customPanelStyle}>
        {frontCharas}
      </Panel>
      <Panel header={middleHeader} key="center" style={customPanelStyle}>
        {middleCharas}
      </Panel>
      <Panel header={backHeader} key="back" style={customPanelStyle}>
        {backCharas}
      </Panel>
    </Collapse>
  );
};

export default CharaSelect;