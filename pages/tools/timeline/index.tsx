import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import Collapse from '@components/react-collapse';
import UnitsO from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { TimeLineData, TimeLineReq } from '@type/tools';
import { UnitData } from '@type/unit';
import { generateNonce, reverseCompare } from '@utils/functions';
import { postServer } from '@utils/request';
import { Button, Col, Icon, Modal, Radio, Row, Switch, Timeline } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
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


interface TimeLineProps extends AppState {
  actions: actions.Actions
}


interface TimeLineState {
  isOpen: boolean;
  unit: number | null;
  isClan: boolean;
  hideBasicAtk: boolean;
  isLoading: boolean;
  timeline: TimeLineData | null,
}

class UnitTimeLine extends Component<TimeLineProps, TimeLineState> {
  constructor(props: TimeLineProps) {
    super(props);
    this.state = {
      isOpen: true,
      unit: null,
      isClan: true,
      hideBasicAtk: false,
      isLoading: false,
      timeline: null
    };
  }

  public render() {
    const { isOpen, unit, isClan, isLoading, hideBasicAtk, timeline } = this.state;

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
          <title>{`${routerName.tools_timeline}- ${siteName}`}</title>
          <meta name="description" content={`每个角色技能的时间轴，由于解包数据与实际情况不符，本功能仅供参考 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{ padding: '6px 30px', marginBottom: '30px' }}>
          <div className="body_title">
            {`${routerName.tools_timeline}`}
          </div>
        </ItemBox>
        <ItemBox style={{ padding: '16px 30px', marginBottom: '30px' }}>
          <div className="body_subtitle">
            {`*特别说明：`}
          </div>
          <div>
            {`由于解包数据里对部分技能的释放时间数值和游戏内实际情况不符，本功能仅供参考，部分角色的轴会很准，但是部分角色会差距很大（比如伊莉雅）欢迎研究过解包数据的大佬一起交流，QQ`}
            <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=196435005&site=qq&menu=yes">
              <img src="http://wpa.qq.com/pa?p=2:196435005:52" />
            </a>
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
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="tools_status_profile_col">
                        <div className="tools_status_profile_description">
                          <h3>
                            {Units[unit].name}
                          </h3>
                        </div>
                        <div className="tools_status_options_ctn">
                          {`时间轴模式`}
                        </div>
                        <Radio.Group
                          value={isClan}
                          buttonStyle="solid"
                          onChange={this.onRadioChange}
                        >
                          <Radio.Button value={true}>工会战</Radio.Button>
                          <Radio.Button value={false}>竞技场</Radio.Button>
                        </Radio.Group>
                        <div className="tools_status_options_ctn">
                          {`隐藏普通攻击: ${hideBasicAtk ? "是" : "否"}`}
                        </div>
                        <Switch
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          checked={hideBasicAtk}
                          onChange={this.onSwitchChange}
                          disabled={isLoading}
                        />
                      </div>
                    </Col>
                  </Row>
                  {
                    timeline
                      ?
                      <Timeline>
                        {
                          timeline.timeline.filter(e => hideBasicAtk ? e.skill !== 0 : true).map((e, i) => {
                            const minutes = Math.floor(e.ts / 60);
                            const seconds = e.ts - minutes * 60;
                            let text = '';
                            let color = 'green';
                            switch (e.skill) {
                              case 0:
                                text = `${minutes}:${seconds} 普通攻击`;
                                break;
                              case 1:
                                text = `${minutes}:${seconds} 技能1：${timeline.skill1}`;
                                color = 'red';
                                break;
                              case 2:
                                text = `${minutes}:${seconds} 技能2：${timeline.skill2}`;
                                color = 'blue';
                                break;
                              default:
                                break;
                            }
                            return (
                              <Timeline.Item color={color} key={i}>
                                {text}
                              </Timeline.Item>
                            );
                          })
                        }
                      </Timeline>
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
      timeline: null,
    });
  }

  private onUnitChange = async (e: number) => {
    if (e !== this.state.unit) {
      this.setState({
        unit: e,
      }, async () => {
        await this.getInfo();
      });
    }
  }

  private onRadioChange = (e: RadioChangeEvent) => {
    this.setState({
      isClan: e.target.value,
    }, async () => {
      await this.getInfo();
    });
  }

  private onSwitchChange = (e: boolean) => {
    this.setState({
      hideBasicAtk: e,
    });
  }

  private getInfo = async () => {
    const { unit, isClan, isLoading } = this.state;
    if (isLoading || !unit) {
      return;
    }
    try {
      this.setState({
        isLoading: true,
      });
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);

      const body: TimeLineReq = {
        id: unit,
        isclan: isClan,
        nonce,
        ts,
      };
      body._sign = calcHash(body);

      const r = await postServer("/timeline", stringify(body));
      console.log(r);
      this.setState({
        isLoading: false,
      });
      if (r.code === 0) {
        this.setState({
          isOpen: false,
          timeline: r.data as TimeLineData,
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
)(UnitTimeLine);