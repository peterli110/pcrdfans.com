import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import UnitsO from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { RankByTime, RankByTimeReq } from '@type/rank';
import { UnitData } from '@type/unit';
import { generateNonce } from '@utils/functions';
import { postServer } from '@utils/request';
import { Icon, Modal, Radio, Spin } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { bindActionCreators, Dispatch } from 'redux';

interface UnitObject {
  [key: number]: UnitData
}
const Units: UnitObject = UnitsO;


interface HotDataProps extends AppState {
  actions: actions.Actions
}

interface HotDataState {
  isMounted: boolean,
  rankData: RankByTime[],
  rankRange: 1 | 2 | 3,
  rankType: 'atk' | 'def',
  isBtnLoading: boolean,
}

class HotData extends Component<HotDataProps, HotDataState> {
  constructor(props: HotDataProps) {
    super(props);
    this.state = {
      isMounted: false,
      rankData: [],
      rankRange: 2,
      rankType: 'def',
      isBtnLoading: false,
    };
  }

  public async componentDidMount() {
    const { rankRange, rankType } = this.state;
    await this.getRank(rankRange, rankType);
  }

  public render() {
    if (!this.state.isMounted) {
      const spinIcon = <Icon type="loading" style={{ fontSize: 60 }} spin={true} />;
      return (
        <div className="global_isloading_center">
          <Head>
            <title>{`${routerName.hot} - ${siteName}`}</title>
          </Head>
          <Spin indicator={spinIcon} />
        </div>
      );
    }

    const { rankRange, rankType, rankData } = this.state;
    const data = rankData.map(e => {
      return {
        id: e.id,
        name: Units[e.id].name,
        count: e.count,
      };
    });

    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.hot} - ${siteName}`}</title>
          <meta name="description" content={`公主连结竞技场内常见角色以及出场率 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{ padding: '6px 30px', marginBottom: '30px' }}>
          <div className="body_title">
            {routerName.hot}
          </div>
        </ItemBox>
        <ItemBox style={{minHeight: '60vh'}}>
          <div>
            <div className="battle_title_ctn" style={{padding: '0 5px'}}>
              <div className="body_subtitle">
                {`TOP 10`}
              </div>
            </div>
            <div style={{marginTop: '15px'}}>
              {
                rankData.length > 0
                  ?
                  <div>
                    <MediaQuery 
                      query="only screen and (min-width : 801px)"
                    >
                      {(matches) => {
                        return (
                          <ResponsiveContainer width="100%" height={matches ? 300 : 250}>
                            <LineChart
                              data={data}
                              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                              onClick={() => void(0)}
                            >
                              <Line type="monotone" dataKey="count" stroke="#8884d8" />
                              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                              <XAxis
                                dataKey="id" 
                                tick={(x: any) => this.renderCustomXAxis(x, matches ? 40 : 20)} 
                                interval={0}
                                allowDataOverflow={true} 
                              />
                              <YAxis />
                              <Tooltip content={this.renderTooltip} />
                            </LineChart>
                          </ResponsiveContainer>
                        );
                      }}
                    </MediaQuery>
                  </div>
                  :
                  <div className="hot_data_no_data">
                    暂无数据
                  </div>
              }
            </div>
            <div className="hot_data_btn_group">
              <div>
                <span>
                  最近：
                </span>
                <Radio.Group
                  buttonStyle="solid"
                  className="group"
                  value={rankRange}
                  onChange={this.onRangeChange}
                >
                  <Radio.Button value={1}>
                    1天
                  </Radio.Button>
                  <Radio.Button value={2}>
                    1周
                  </Radio.Button>
                  <Radio.Button value={3}>
                    1个月
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div>
                <span>
                  位置：
                </span>
                <Radio.Group
                  buttonStyle="solid"
                  className="group"
                  value={rankType}
                  onChange={this.onTypeChange}
                >
                  <Radio.Button value="atk">
                    进攻方
                  </Radio.Button>
                  <Radio.Button value="def">
                    防守方
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
          </div>
        </ItemBox>

      </div>
    );
  }

  private renderCustomXAxis = ({x, y, payload}:any, w: number) => {
    return (
      <foreignObject x={x - (w / 2 + 1)} y={y} width={w} height={w} requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <Character
          cid={payload.value}
          width={w}
          noBorder={true}
          selected={true}
          style={{borderRadius: '20px'}}
        />
      </foreignObject>
    );
  }

  private renderTooltip = ({ active, payload, label }:any) => {
    if (active) {
      return (
        <div className="hot_data_tooltip_ctn">
          <Character
            cid={label}
            width={50}
            noBorder={true}
            selected={true}
            style={{borderRadius: '30px', margin: 'auto', display: 'block'}}
          />
          <p className="label">{`${Units[label].name}`}</p>
          <p className="intro">{`登场次数: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  }

  private onRangeChange = async(e: RadioChangeEvent) => {
    this.setState({
      rankRange: e.target.value,
    });
    await this.getRank(e.target.value, this.state.rankType);
  }

  private onTypeChange = async(e: RadioChangeEvent) => {
    this.setState({
      rankType: e.target.value,
    });
    await this.getRank(this.state.rankRange, e.target.value);
  }

  private getRank = async (range: 1 | 2 | 3, type: 'atk' | 'def') => {
    try {
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);

      const body: RankByTimeReq = {
        nonce,
        range,
        ts,
        type,
      };
      body._sign = calcHash(body);

      const r = await postServer("/rank/time", stringify(body));
      console.log(r);
      if (r.code === 0) {
        const { data }: { data: RankByTime[]} = r;
        this.setState({
          rankData: data,
          isMounted: true,
        });
      } else {
        Modal.error({
          title: '(╥﹏╥)好像哪里出错了，再试一次吧',
        });
      }
    } catch (err) {
      console.log(err);
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
)(HotData);