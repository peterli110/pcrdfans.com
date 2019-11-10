import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import Collapse from '@components/react-collapse';
import GameData from '@config/constants/gamedata.json';
import UnitsO from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { UnitInfoReq } from '@type/tools';
import { UnitData, UnitDetails } from '@type/unit';
import { generateNonce, reverseCompare } from '@utils/functions';
import { postServer } from '@utils/request';
import { Button, Col, Icon, Modal, Row, Slider, Statistic, Switch } from 'antd';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';


interface UnitObject {
  [key: number]: UnitData
}
const Units: UnitObject = UnitsO;
const UnitsArr: UnitData[] = Object.values(Units);


interface UnitStatusProps extends AppState {
  actions: actions.Actions
}

interface NumValues {
  level: number;
  rank: number;
  equipLevel: number;
  star: number;
  targetLevel: number;
}

interface UnitStatusState extends NumValues {
  isOpen: boolean;
  unit: number | null;
  equip: boolean;
  isLoading: boolean;
  unitData: UnitDetails | null,
}

class UnitStatus extends Component<UnitStatusProps, UnitStatusState> {
  constructor(props: UnitStatusProps) {
    super(props);
    this.state = {
      isOpen: true,
      unit: null,
      level: 1,
      rank: 1,
      equip: false,
      equipLevel: 1,
      star: 5,
      isLoading: false,
      targetLevel: 1,
      unitData: null
    };
  }

  public render() {
    const { isOpen, unit, level, rank, equip, equipLevel, star, isLoading, targetLevel, unitData } = this.state;

    const Charas = UnitsArr.sort(reverseCompare).map((e, i) => {
      return (
        <Character
          cid={e.id}
          key={i}
          width={40}
          selected={e.id === unit}
          onSelect={() => this.onUnitChange(e.id)}
        />
      );
    });

    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.tools_status} - ${siteName}`}</title>
          <meta name="description" content={`每个角色的属性计算器，可以根据不同等级，rank，专武和星级等计算角色属性 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{ padding: '6px 30px', marginBottom: '30px' }}>
          <div className="body_title">
            {routerName.tools_status}
          </div>
        </ItemBox>
        <ItemBox>
          <div>
            <div className="battle_title_ctn" style={{ padding: '0 5px' }}>
              <div className="body_subtitle">
                {!unit ? `选择角色` : ""}
              </div>
              <div>
                <Button
                  type="primary"
                  icon="down"
                  size="small"
                  onClick={this.onOpenMenu}
                >
                  重新选择
                </Button>
              </div>
            </div>
            <Collapse isOpen={isOpen}>
              <div>
                {Charas}
              </div>
            </Collapse>
            {
              !isOpen && unit
                ?
                <div>
                  <Row gutter={16} className="tools_status_profile_description">
                    <Col xs={24} sm={12}>
                      <div className="tools_status_profile_col">
                        <div>
                          <img
                            src={`/static/profile/${unit || 100101}.png`}
                            className="inner_img"
                          />
                        </div>
                        <div className="tools_status_profile_description">
                          <h3>
                            {Units[unit].name}
                          </h3>
                          <div className="body_font_small">
                            {Units[unit].comment.split('\\n').map((e, i) => {
                              return <p key={i}>{e}</p>;
                            })}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="tools_status_profile_col">
                        <div className="tools_status_options_ctn">
                          {`角色等级：${level}`}
                        </div>
                        <Slider
                          value={level}
                          onChange={(e) => this.onLevelChange(e as number, 'level')}
                          onAfterChange={this.getInfo}
                          min={1}
                          max={GameData.level}
                          disabled={isLoading}
                        />
                        <div className="tools_status_options_ctn">
                          {`角色星数: ${star}星`}
                        </div>
                        <Slider
                          value={star}
                          onChange={(e) => this.onLevelChange(e as number, 'star')}
                          onAfterChange={this.getInfo}
                          min={1}
                          max={Units[unit].maxrarity}
                          disabled={isLoading}
                        />
                        <div className="tools_status_options_ctn">
                          {`角色Rank: ${rank}`}
                        </div>
                        <Slider
                          value={rank}
                          onChange={(e) => this.onLevelChange(e as number, 'rank')}
                          onAfterChange={this.getInfo}
                          min={1}
                          max={GameData.rank}
                          disabled={isLoading}
                        />
                        {
                          Units[unit].equip
                            ?
                            <div>
                              <div className="tools_status_options_ctn">
                                {`装备专武: ${equip ? "是" : "否"}`}
                              </div>
                              <Switch
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                checked={equip}
                                onChange={this.onEquipChange}
                                disabled={isLoading}
                              />
                              <div className="tools_status_options_ctn">
                                {`专武等级: ${equipLevel}`}
                              </div>
                              <Slider
                                value={equipLevel}
                                onChange={(e) => this.onLevelChange(e as number, 'equipLevel')}
                                onAfterChange={this.getInfo}
                                min={1}
                                max={GameData.equipLevel}
                                disabled={!equip || isLoading}
                              />
                            </div>
                            :
                            null
                        }
                        <div className="tools_status_options_ctn">
                          {`目标等级：${targetLevel}`}
                        </div>
                        <Slider
                          value={targetLevel}
                          onChange={(e) => this.onTargetChange(e as number)}
                          min={1}
                          max={160}
                          disabled={isLoading}
                        />
                      </div>
                    </Col>
                  </Row>
                  {
                    unitData
                      ?
                      <Row>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic title="HP" value={unitData.hp} />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic title="物理攻击" value={unitData.atk} />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic title="魔法攻击" value={unitData.magic_str} />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic 
                            title="物理防御" 
                            value={unitData.def} 
                            suffix={`(${(100 - 100 / (1 + unitData.def / 100)).toFixed(2)}%)`} 
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic
                            title="魔法防御"
                            value={unitData.magic_def}
                            suffix={`(${(100 - 100 / (1 + unitData.magic_def / 100)).toFixed(2)}%)`} 
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic
                            title="有效物理HP"
                            value={unitData.hp * (1 + unitData.def / 100) * (1 + unitData.dodge / 100)}
                            precision={2}
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic
                            title="有效魔法HP"
                            value={unitData.hp * (1 + unitData.magic_def / 100)}
                            precision={2}
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic
                            title="物理暴击"
                            value={unitData.physical_critical}
                            suffix={`(${(unitData.physical_critical * 0.05 * level / targetLevel).toFixed(2)}%)`}
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic
                            title="魔法暴击"
                            value={unitData.magic_critical}
                            suffix={`(${(unitData.magic_critical * 0.05 * level / targetLevel).toFixed(2)}%)`}
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic title="回复量上升" value={unitData.hp_recovery_rate} />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic title="TP上升" value={unitData.energy_recovery_rate} />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic title="TP消费减轻" value={unitData.energy_reduce_rate} />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic
                            title="HP吸收"
                            value={unitData.life_steal}
                            suffix={`(${(unitData.life_steal * 100 / (100 + targetLevel + unitData.life_steal)).toFixed(2)}%)`}
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic
                            title="闪避"
                            value={unitData.dodge}
                            suffix={`(${(100 / (1 + 100 / unitData.dodge)).toFixed(2)}%)`}
                          />
                        </Col>
                        <Col xs={12} sm={8} className="body_margin_content">
                          <Statistic title="命中" value={unitData.accuracy} />
                        </Col>
                      </Row>
                      :
                      null
                  }
                </div>
                :
                null
            }
          </div>
        </ItemBox>

      </div>
    );
  }



  private onOpenMenu = () => {
    this.setState({
      unit: null,
      isOpen: true,
    });
  }

  private onUnitChange = async (e: number) => {
    if (e !== this.state.unit) {
      this.setState({
        unit: e,
        level: GameData.level,
        targetLevel: GameData.level,
        rank: GameData.rank,
        equip: Units[e].equip,
        equipLevel: Units[e].equip ? GameData.equipLevel : 1,
        star: 5,
      }, async() => {
        await this.getInfo();
      });
    }
  }

  private onLevelChange = (e: number, s: keyof NumValues ) => {
    this.setState({
      [s]: e,
    } as unknown as Pick<NumValues, keyof NumValues>);
  }

  private onTargetChange = (e: number) => {
    this.setState({
      targetLevel: e,
    });
  }

  private onEquipChange = (e: boolean) => {
    this.setState({
      equip: e,
    }, async() => {
      await this.getInfo();
    });
  }

  private getInfo = async () => {
    const { unit, rank, equip, equipLevel, level, star, isLoading } = this.state;
    if (isLoading || !unit) {
      return;
    }
    try {
      this.setState({
        isLoading: true,
      });
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);

      const body: UnitInfoReq = {
        equip,
        equipLevel,
        id: unit,
        level,
        nonce,
        rank,
        star,
        ts,
      };
      body._sign = calcHash(body);

      const r = await postServer("/unitinfo", stringify(body));
      console.log(r);
      this.setState({
        isLoading: false,
      });
      if (r.code === 0) {
        this.setState({
          unitData: r.data,
          isOpen: false,
        });
      } else {
        Modal.error({
          title: '(╥﹏╥)好像哪里出错了，再试一次吧',
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        isLoading: false,
      });
      return Modal.error({
        title: '(╥﹏╥)好像哪里出错了，再试一次吧',
      });
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return state;
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators<actions.Actions, any>(actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitStatus);