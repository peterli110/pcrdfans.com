import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import UnitsO from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { TopCombineData, TopCombineReq } from '@type/rank';
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
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { bindActionCreators, Dispatch } from 'redux';


interface UnitObject {
  [key: number]: UnitData
}
const Units: UnitObject = UnitsO;


interface PageProps extends AppState {
  actions: actions.Actions
}

interface HotDataState {
  isMounted: boolean,
  result: TopCombineData[],
  more: boolean,
  num: 2 | 3,
  range: 2 | 3,
  type: 'atk' | 'def',
  isBtnLoading: boolean,
}

class TopCombinations extends Component<PageProps, HotDataState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      isMounted: false,
      result: [],
      more: false,
      num: 2,
      range: 2,
      type: 'def',
      isBtnLoading: false,
    };
  }

  public async componentDidMount() {
    await this.getInfo();
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

    const { range, type, result, more, num } = this.state;
    const data = result.map((e) => {
      return {
        units: e.units.join(","),
        count: e.count,
      };
    });

    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.data_combinations} - ${siteName}`}</title>
          <meta name="description" content={`公主连结竞技场近期的常见组合一览 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{ padding: '6px 30px', marginBottom: '30px' }}>
          <div className="body_title">
            {routerName.data_combinations}
          </div>
        </ItemBox>
        <ItemBox style={{ minHeight: '60vh' }}>
          <div>
            <div className="battle_title_ctn" style={{ padding: '0 5px' }}>
              <div className="body_subtitle">
                {`TOP ${more ? 40 : 20}`}
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              {
                result.length > 0
                  ?
                  <div>
                    <MediaQuery
                      query="only screen and (min-width : 801px)"
                    >
                      {(matches) => {
                        return (
                          <ResponsiveContainer width="100%" height={more ? 2500 : 1500}>
                            <BarChart
                              data={data}
                              margin={{ top: 5, right: 25, bottom: 5, left: 5 + 25 * num }}
                              onClick={() => void (0)}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis
                                dataKey="units" 
                                type="category" 
                                tick={(x: any) => this.renderCustomXAxis(x, matches ? 50 : 40)} 
                                interval={0}
                                allowDataOverflow={true} 
                              />
                              <Bar dataKey="count" barSize={20} fill="#8884d8" />
                              <Tooltip content={this.renderTooltip} cursor={false} />
                            </BarChart>
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
                  value={range}
                  onChange={this.onRangeChange}
                  disabled={this.state.isBtnLoading}
                >
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
                  value={type}
                  onChange={this.onTypeChange}
                  disabled={this.state.isBtnLoading}
                >
                  <Radio.Button value="atk">
                    进攻方
                  </Radio.Button>
                  <Radio.Button value="def">
                    防守方
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div>
                <span>
                  组合人数：
                </span>
                <Radio.Group
                  buttonStyle="solid"
                  className="group"
                  value={num}
                  onChange={this.onNumChange}
                  disabled={this.state.isBtnLoading}
                >
                  <Radio.Button value={2}>
                    2人
                  </Radio.Button>
                  <Radio.Button value={3}>
                    3人
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
          </div>
        </ItemBox>

      </div>
    );
  }

  private renderCustomXAxis = ({ x, y, payload }: any, w: number) => {
    const { num } = this.state;
    const units = payload.value.split(",");
    return (
      <foreignObject x={x - (w * units.length)} y={y - w / 2} width={w * num} height={w} requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <div className="global_flex">
          {
            units.map((e:string, i:number) => {
              return (
                <Character
                  cid={parseInt(e, 10)}
                  width={w}
                  noBorder={true}
                  selected={true}
                  key={i}
                />
              );
            })
          }
        </div>
      </foreignObject>
    );
  }

  private renderTooltip = ({ active, payload, label }: any) => {
    if (active) {
      const units = label.split(",");
      return (
        <div className="hot_data_tooltip_ctn">
          <div className="global_flex global_flex_center">
            {
              units.map((e:string, i:number) => {
                return (
                  <div key={i}>
                    <Character
                      cid={parseInt(e, 10)}
                      width={50}
                      noBorder={true}
                      selected={true}
                      style={{ borderRadius: '30px', margin: 'auto', display: 'block' }}
                    />
                    <p className="label">{`${Units[parseInt(e, 10)].name}`}</p>
                  </div>
                );
              })
            }
          </div>
          <p className="intro">{`登场次数: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  }

  private onRangeChange = (e: RadioChangeEvent) => {
    this.setState({
      range: e.target.value,
    }, async() => {
      await this.getInfo();
    });
  }

  private onNumChange = (e: RadioChangeEvent) => {
    this.setState({
      num: e.target.value,
    }, async() => {
      await this.getInfo();
    });
  }

  private onTypeChange = (e: RadioChangeEvent) => {
    this.setState({
      type: e.target.value,
    }, async() => {
      await this.getInfo();
    });
  }

  private getInfo = async () => {
    try {
      const { more, num, range, type} = this.state;
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);
      this.setState({
        isBtnLoading: true,
      });

      const body: TopCombineReq = {
        more,
        nonce,
        num,
        range,
        ts,
        type,
      };
      body._sign = calcHash(body);

      const r = await postServer("/rank/combination", stringify(body));
      console.log(r);
      if (r.code === 0) {
        this.setState({
          result: r.data as TopCombineData[],
          isMounted: true,
          isBtnLoading: false,
        });
      } else if (r.code === 113) {
        return Modal.info({
          title: `正在处理数据，请过几秒再试_(:3 」∠ )_`,
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
)(TopCombinations);