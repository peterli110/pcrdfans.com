import Character from '@components/character/Character';
import UnitsA from '@config/constants/unita.json';
import { AppState } from '@store/store';
import { CNServer, TWServer } from '@store/units/unitsActions';
import { UnitData } from '@type/unit';
import { reverseCompare } from '@utils/functions';
import { Collapse } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';


const { Panel } = Collapse;
const UnitsArr: UnitData[] = UnitsA;


interface CharaSelectProps {
  onChange: (k: number, l: boolean) => void,
  values: Set<number>,
  activePanel?: string[],
  onPanelSwitch?: (key: any) => void,
  width?: number,
}

type ComponentProps = CharaSelectProps & AppState;

const CharaSelect: React.FC<ComponentProps> = ({ 
  onChange, 
  values, 
  onPanelSwitch = () => void (0), 
  activePanel = [], 
  width = 50,
  server,
}) => {
  const cn = new Set(server.cn);
  const tw = new Set(server.tw);
  const serverFilter = (e: UnitData) => {
    // cn not ready
    if (server.cn.length === 0 && server.server === CNServer) {
      return true;
    }
    // tw not ready
    if (server.tw.length === 0 && server.server === TWServer) {
      return true;
    }
    // one of them not set
    if (server.tw.length === UnitsArr.length || server.cn.length === UnitsArr.length) {
      return true;
    }

    // TW = JP - TWDiff
    if (server.server === TWServer) {
      return !tw.has(e.id);
    }

    // CN = JP - CNDiff
    if (server.server === CNServer) {
      return !cn.has(e.id);
    }
    return true;
  };
  const frontCharas = UnitsArr.filter((e: UnitData) => e.place === 1)
    .filter(serverFilter)
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
    .filter(serverFilter)
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
    .filter(serverFilter)
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


const mapStateToProps = (state: AppState) => {
  return state;
};

export default connect<AppState, {}, CharaSelectProps, AppState>(
  mapStateToProps
)(CharaSelect);