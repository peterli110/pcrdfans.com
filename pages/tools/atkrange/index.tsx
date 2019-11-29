import Character from '@components/character/Character';
import CharaSelect from '@components/charaselect/CharaSelect';
import ItemBox from '@components/itembox/ItemBox';
import Units from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import { AppState } from '@store/store';
import { UserState } from '@store/user/userReducers';
import { AtkRangeRequest } from '@type/atkrange';
import { UnitObject } from '@type/unit';
import { generateNonce, sortUnitId } from '@utils/functions';
import { ErrorModal, LoginModal, RegionNotSupportModal, TooManyModal } from '@utils/modals';
import { postServer } from '@utils/request';
import { Button, Dropdown, Menu, Modal, Spin } from 'antd';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import Router from 'next/router';
import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery, { MediaQueryMatchers } from 'react-responsive';

const mobileWidth = 501;
const UnitObj: UnitObject = Units as UnitObject;

type showModalType = 'atk' | 'def' | null;

interface PageState {
  atk: Set<number>,
  def: Set<number>,
  isMount: boolean,
  activePanel: string[],
  isBtnLoading: boolean,
  showModal: showModalType,
  selectedSide: string,
  selectedUnit: number,
  skillInfo: SkillInfo | null,
  targetSide: string,
  targetUnits: Set<number>,
}

interface SkillActions {
  targets: number[],
  type: string,
}

interface SkillInfo {
  icon: number,
  name: string,
  description: string,
  actions: SkillActions[],
}

interface PageProps {
  fromSearch?: boolean,
  atk?: number[],
  def?: number[],
  user?: UserState,
}

class AtkRange extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      atk: new Set(),
      def: new Set(),
      isMount: false,
      isBtnLoading: false,
      activePanel: ['front', 'center', 'back'],
      showModal: null,
      selectedSide: "",
      selectedUnit: 0,
      skillInfo: null,
      targetSide: "",
      targetUnits: new Set(),
    };
  }

  public componentDidMount() {
    this.setState({
      isMount: true,
    });
    if (this.props.fromSearch) {
      const { atk, def } = this.props;
      this.setState({
        atk: new Set(atk),
        def: new Set(def),
      });
    }
  }


  public render() {
    const { isMount, activePanel, showModal, atk, def } = this.state;
    const responsive: Partial<MediaQueryMatchers> = { deviceWidth: 320 };

    if (this.props.fromSearch) {
      return (
        <ItemBox style={{borderRadius: '5px'}}>
          <div className="home_notification_ctn">
            <div className="battle_upload_description_ctn">
              <p>
                {'本功能暂时只能计算伤害类技能范围，详情请'}
                <Button
                  type="primary"
                  size="small"
                  onClick={() => Router.push("/tools/atkrange")}
                >
                  前往查看
                </Button>
              </p>
            </div>
            <Spin spinning={this.state.isBtnLoading}>
              <MediaQuery
                minWidth={mobileWidth}
                values={isMount ? undefined : responsive}
              >
                {(matches) => {
                  return (
                    <div>
                      {this.renderArena(!matches)}
                      {this.renderNotification()}
                      {this.renderSkillInfo()}
                    </div>
                  );
                }}
              </MediaQuery>

            </Spin>
          </div>
        </ItemBox>
      );
    }

    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.atkrange} - ${siteName}`}</title>
          <meta name="description" content={`公主连结竞技场攻击距离计算器 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{ paddingBottom: '60px' }}>
          <div className="home_notification_ctn">
            <div className="battle_title_ctn">
              <div className="body_title">
                {routerName.atkrange}
              </div>
            </div>
            <div className="battle_upload_description_ctn">
              <p>{'*注意事项'}</p>
              <p>{'1: 重写了大佬'}<a href="http://bbs.nga.cn/nuke.php?func=ucp&uid=4463230" target="_blank">無の盡</a>{'授权提供的相关计算代码，现在结果更准确了'}</p>
              <p>{'2: 本功能还在继续完善中，暂时只能计算伤害类技能范围'}</p>
              <p>{'3: 请登录后再使用'}</p>
            </div>
            <Spin spinning={this.state.isBtnLoading}>
              <MediaQuery
                minWidth={mobileWidth}
                values={isMount ? undefined : responsive}
              >
                {(matches) => {
                  return (
                    <div>
                      <div className="atkrange_select_btn_ctn">
                        <div className="atkrange_select_btn">
                          <Button
                            type="primary"
                            style={{ width: '10rem' }}
                            onClick={() => this.showSelectModal('atk')}
                          >
                            {`选择进攻阵容`}
                          </Button>
                        </div>
                        <div className="atkrange_select_btn">
                          <Button
                            type="primary"
                            style={{ width: '10rem' }}
                            onClick={() => this.showSelectModal('def')}
                          >
                            {`选择防守阵容`}
                          </Button>
                        </div>
                      </div>
                      {this.renderArena(!matches)}
                      {this.renderNotification()}
                      {this.renderSkillInfo()}
                    </div>
                  );
                }}
              </MediaQuery>
              
            </Spin>
          </div>
        </ItemBox>
        <Modal
          visible={!!showModal}
          title={null}
          footer={null}
          onOk={() => this.showSelectModal(null)}
          onCancel={() => this.showSelectModal(null)}
          width={"600px"}
          style={{ minWidth: "300px" }}
        >
          <div className="battle_upload_unit_select_modal">
            <div className="buttons">
              <Button
                type="primary"
                onClick={() => this.clearSelection(showModal)}
              >
                {"重新选择"}
              </Button>
              <Button
                type="primary"
                className="backbutton"
                onClick={() => this.showSelectModal(null)}
              >
                {"确认"}
              </Button>
            </div>
            <MediaQuery
              minWidth={mobileWidth}
              values={isMount ? undefined : responsive}
            >
              {(matches) => {
                return (
                  <CharaSelect
                    activePanel={activePanel}
                    onPanelSwitch={this.onPanelSwitch}
                    values={showModal === 'atk' ? atk : def}
                    onChange={(k: number, l: boolean) => this.onCharaSelect(k, l, showModal)}
                    width={matches ? 50 : 40}
                  />
                );
              }}
            </MediaQuery>
          </div>
        </Modal>
      </div>
    );
  }

  private clearSelection = (t: showModalType) => {
    if (t === 'atk') {
      this.setState({
        atk: new Set(),
      });
    }

    if (t === 'def') {
      this.setState({
        def: new Set(),
      });
    }
  }

  private onUnitSelect = (e: number, s: string) => {
    console.log(e, s);
    this.setState({
      selectedSide: s,
      selectedUnit: e,
    });
  }

  private onCharaSelect = (e: number, s: boolean, t: showModalType) => {
    const { atk, def } = this.state;
    // cancel select
    if (s) {
      t === 'atk' ? atk.delete(e) : def.delete(e);
      this.setState({
        atk,
        def,
      });
    }

    // select
    else {
      if ((t === 'atk' && atk.size >= 5) || (t === 'def' && def.size >= 5)) {
        return;
      }
      t === 'atk' ? atk.add(e) : def.add(e);
      this.setState({
        atk,
        def,
      });
    }

    // clear selected
    this.setState({
      selectedSide: "",
      selectedUnit: 0,
    });
  }

  private onPanelSwitch = (e: string[]) => {
    this.setState({
      activePanel: e,
    });
  }

  private showSelectModal = (t: showModalType) => {
    this.setState({
      showModal: t,
    });
  }

  private onSkillSelect = async(skill: number) => {
    const { atk, def, selectedSide, selectedUnit } = this.state;
    const { user } = this.props;

    if (!(user && user.isLogin && user.userInfo)) {
      return LoginModal();
    }

    if (selectedUnit === 0 || !selectedSide) {
      return Modal.info({
        title: "请选择要查看的角色(つ´ω`)つ"
      });
    }

    const atkArr = sortUnitId(Array.from(atk));
    const defArr = sortUnitId(Array.from(def));

    if (atkArr.length <= 0 || defArr.length <= 0) {
      return Modal.info({
        title: "两边都要选择角色(つ´ω`)つ"
      });
    }

    if ((atkArr.length === 1 && atkArr[0] === 105201) || (defArr.length === 1 && defArr[0] === 105201)) {
      return Modal.info({
        title: `暂时不支持只有一个羊驼的阵容，请选择更多角色`,
      });
    }

    this.setState({
      isBtnLoading: true,
    });
    try {
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);
      const body: AtkRangeRequest = {
        atk: atkArr,
        def: defArr,
        nonce,
        side: selectedSide === 'atk' ? 1 : 2,
        skill,
        ts,
        unit: selectedUnit
      };
      body._sign = calcHash(body);
      console.log(body);

      const r = await postServer("/atkrange", stringify(body));
      this.setState({isBtnLoading: false});
      console.log(r);
      if (r.code === 0) {
        let targets: number[] = [];
        if (r.data.actions instanceof Array && r.data.actions.length > 0) {
          r.data.actions.forEach((e: SkillActions) => {
            targets = targets.concat(e.targets);
          });
        }
        console.log(targets);
        this.setState({
          skillInfo: r.data as SkillInfo,
          targetSide: targets.length <= 0 ? "" : (selectedSide === 'atk' ? 'def' : 'atk'),
          targetUnits: new Set(targets),
        });
      } else if (r.code === 1) {
        return LoginModal();
      } else if (r.code === 5) {
        return Modal.info({
          title: `暂时不支持只有一个羊驼的阵容，请选择更多角色`,
        });
      } else if (r.code === 110) {
        return Modal.info({
          title: `选择的角色不正确(ノ▼Д▼)ノ`,
        });
      } else if (r.code === 114) {
        return Modal.info({
          title: `选择的技能不正确(ノ▼Д▼)ノ`,
        });
      } else if (r.code === -429) {
        return TooManyModal();
      } else if (r.code === 600) {
        return RegionNotSupportModal();
      }
      else {
        return ErrorModal();
      }
    } catch (err) {
      console.log(err);
      this.setState({isBtnLoading: false});
      return ErrorModal();
    }
  }

  private renderSkillInfo = () => {
    const { skillInfo } = this.state;
    if (skillInfo) {
      let text = "*相关数据来自解包，实际效果可能与理论计算不一致";
      if (skillInfo.actions instanceof Array && skillInfo.actions.length <= 0) {
        text = "*该技能不是伤害类技能";
      }
      return (
        <div>
          <div className="battle_search_select battle_search_result_ctn">
            <div className="atkrange_notification" style={{ color: '#ff3a30'}}>
              {text}
            </div>
          </div>
          <div className="global_flex battle_search_select battle_search_result_ctn global_flex_align_center">
            <div>
              <img src={`/static/skills/${skillInfo.icon}.jpg`} className="atkrange_skill_icon" />
            </div>
            <div className="atkrange_skill_info">
              <div className="body_subtitle">
                {skillInfo.name}
              </div>
              <div className="body_font_small">
                {skillInfo.description}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  private renderNotification = () => {
    const {atk, def, selectedSide, selectedUnit} = this.state;
    if (atk.size <= 0 || def.size <= 0) {
      return (
        <div className="battle_search_select battle_search_result_ctn">
          <div className="atkrange_notification">
            *请选择双方阵容
          </div>
        </div>
      );
    }

    if (!selectedSide || selectedUnit === 0) {
      return (
        <div className="battle_search_select battle_search_result_ctn">
          <div className="atkrange_notification">
            *请选择一个角色
          </div>
        </div>
      );
    }
  }

  private renderMenu(id: number) {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.onSkillSelect(1)} className="atkrange_skill_select">
            UB
          </a>
        </Menu.Item>
        {
          UnitObj[id].maxrarity === 6
            ?
            <Menu.Item>
              <a onClick={() => this.onSkillSelect(5)} className="atkrange_skill_select">
                UB+（6星）
              </a>
            </Menu.Item>
            :
            null
        }
        <Menu.Item>
          <a onClick={() => this.onSkillSelect(2)} className="atkrange_skill_select">
            技能1
          </a>
        </Menu.Item>
        {
          UnitObj[id].equip
            ?
            <Menu.Item>
              <a onClick={() => this.onSkillSelect(4)} className="atkrange_skill_select">
                技能1+（专武）
              </a>
            </Menu.Item>
            :
            null
        }
        <Menu.Item>
          <a onClick={() => this.onSkillSelect(3)} className="atkrange_skill_select">
            技能2
          </a>
        </Menu.Item>
      </Menu>
    );
  }

  private renderArena(isMobile?: boolean) {
    const { atk, def, selectedSide, selectedUnit, targetSide, targetUnits } = this.state;
    const atkArr = sortUnitId(Array.from(atk)).reverse();
    const defArr = sortUnitId(Array.from(def));

    const atkTeam: any = [];
    atkArr.forEach((v, idx) => {
      // less than 4, just push directly
      // more than 4, push to two lines
      if (atkArr.length < 4) {
        atkTeam.unshift(
          <Dropdown overlay={this.renderMenu(v)} trigger={['click']} key={v}>
            <div className="atkrange_unit_margin">
              <Character
                cid={v}
                selected={true}
                width={isMobile ? 40 : 60}
                borderRadius={60}
                onSelect={(e) => this.onUnitSelect(e, 'atk')}
                borderWidth={(selectedSide === 'atk' && selectedUnit === v) ? 3 : 1}
                grey={targetSide === 'def' || (targetSide === 'atk' && !targetUnits.has(v))}
              />
            </div>
          </Dropdown>
        );
      } else {
        if (idx % 2 === 0) {
          atkTeam.unshift(
            <div key={v}>
              <Dropdown overlay={this.renderMenu(v)} trigger={['click']}>
                <div className="atkrange_unit_margin">
                  <Character
                    cid={v}
                    selected={true}
                    width={isMobile ? 40 : 60}
                    borderRadius={60}
                    onSelect={(e) => this.onUnitSelect(e, 'atk')}
                    borderWidth={(selectedSide === 'atk' && selectedUnit === v) ? 3 : 1}
                    grey={targetSide === 'def' || (targetSide === 'atk' && !targetUnits.has(v))}
                  />
                </div>
              </Dropdown>
              {
                idx + 1 < atkArr.length
                  ?
                  <Dropdown overlay={this.renderMenu(atkArr[idx + 1])} trigger={['click']} key={v}>
                    <div className="position_relative atkrange_unit_margin" style={{right: isMobile ? '20px' : '30px'}}>
                      <Character
                        cid={atkArr[idx + 1]}
                        selected={true}
                        width={isMobile ? 40 : 60}
                        borderRadius={60}
                        onSelect={(e) => this.onUnitSelect(e, 'atk')}
                        borderWidth={(selectedSide === 'atk' && selectedUnit === atkArr[idx + 1]) ? 3 : 1}
                        grey={targetSide === 'def' || (targetSide === 'atk' && !targetUnits.has(atkArr[idx + 1]))}
                      />
                    </div>
                  </Dropdown>
                  :
                  null
              }
            </div>
          );
        }
      }
    });

    const defTeam: any = [];
    defArr.forEach((v, idx) => {
      // less than 4, just push directly
      // more than 4, push to two lines
      if (defArr.length < 4) {
        defTeam.unshift(
          <Dropdown overlay={this.renderMenu(v)} trigger={['click']} key={v}>
            <div key={v} className="atkrange_unit_margin">
              <Character
                cid={v}
                selected={true}
                width={isMobile ? 40 : 60}
                borderRadius={60}
                onSelect={(e) => this.onUnitSelect(e, 'def')}
                borderWidth={(selectedSide === 'def' && selectedUnit === v) ? 3 : 1}
                grey={targetSide === 'atk' || (targetSide === 'def' && !targetUnits.has(v))}
              />
            </div>
          </Dropdown>
        );
      } else {
        if (idx % 2 === 0) {
          defTeam.unshift(
            <div key={v}>
              <Dropdown overlay={this.renderMenu(v)} trigger={['click']}>
                <div className="atkrange_unit_margin">
                  <Character
                    cid={v}
                    selected={true}
                    width={isMobile ? 40 : 60}
                    borderRadius={60}
                    onSelect={(e) => this.onUnitSelect(e, 'def')}
                    borderWidth={(selectedSide === 'def' && selectedUnit === v) ? 3 : 1}
                    grey={targetSide === 'atk' || (targetSide === 'def' && !targetUnits.has(v))}
                  />
                </div>
              </Dropdown>
              {
                idx + 1 < defArr.length
                  ?
                  <Dropdown overlay={this.renderMenu(defArr[idx + 1])} trigger={['click']}>
                    <div className="position_relative atkrange_unit_margin" style={{right: isMobile ? '20px' : '30px'}}>
                      <Character
                        cid={defArr[idx + 1]}
                        selected={true}
                        width={isMobile ? 40 : 60}
                        borderRadius={60}
                        onSelect={(e) => this.onUnitSelect(e, 'def')}
                        borderWidth={(selectedSide === 'def' && selectedUnit === defArr[idx + 1]) ? 3 : 1}
                        grey={targetSide === 'atk' || (targetSide === 'def' && !targetUnits.has(defArr[idx + 1]))}
                      />
                    </div>
                  </Dropdown>
                  :
                  null
              }
            </div>
          );
        }
      }
    });

    return (
      <div>
        <div className="atkrange_arena_ctn">
          <div className="atkrange_arena">
            {atkTeam}
          </div>
          <div className="atkrange_arena">
            {defTeam}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return state;
};

export default connect(
  mapStateToProps,
  null,
)(AtkRange);