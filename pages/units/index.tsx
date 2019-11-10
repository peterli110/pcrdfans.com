import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import Collapse from '@components/react-collapse';
import UnitsO from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { DailyRank, DailyRankReq } from '@type/rank';
import { UnitData } from '@type/unit';
import { generateNonce, reverseCompare } from '@utils/functions';
import { postServer } from '@utils/request';
import { Button, Modal, Radio } from 'antd';
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
const UnitsArr: UnitData[] = Object.values(Units);


interface UnitsDataProps extends AppState {
  actions: actions.Actions
}

interface UnitsDataState {
  isOpen: boolean,
  unit: number | null,
  unitData: DailyRank[],
  days: 7 | 15 | 30,
  type: 'atk' | 'def',
  isBtnLoading: boolean,
}

class UnitsData extends Component<UnitsDataProps, UnitsDataState> {
  public isLoading: boolean;
  constructor(props: UnitsDataProps) {
    super(props);
    this.state = {
      isOpen: true,
      unit: null,
      unitData: [],
      days: 7,
      type: 'def',
      isBtnLoading: false,
    };
    this.isLoading = false;
  }

  public render() {
    const { isOpen, unit } = this.state;

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
          <title>{`${routerName.units} - ${siteName}`}</title>
          <meta name="description" content={`近期角色出场次数的独立统计 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{ padding: '6px 30px', marginBottom: '30px' }}>
          <div className="body_title">
            {routerName.units}
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
                  <div className="unit_description_ctn">
                    <div>
                      <img
                        src={`/static/profile/${unit || 100101}.png`}
                        className="inner_img"
                      />
                    </div>
                    <div>
                      <h1>
                        {Units[unit].name}
                      </h1>
                      <div>
                        {Units[unit].comment.split('\\n').map((e, i) => {
                            return <p key={i}>{e}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                  {this.renderUnitData()}
                </div>
                :
                null
            }
          </div>
        </ItemBox>

      </div>
    );
  }

  private renderUnitData() {
    const { unitData, days, type } = this.state;
    const data = unitData.map(e => {
      return {
        day: e.day,
        count: e.count,
      };
    });

    return (
      <div>
        <div style={{ marginTop: '15px' }}>
          {
            unitData.length > 0
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
                            dataKey="day"
                            tickFormatter={(e) => moment(e, 'DDD').format("MM/DD")}
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
              value={days}
              onChange={this.onRangeChange}
            >
              <Radio.Button value={7}>
                7天
              </Radio.Button>
              <Radio.Button value={15}>
                15天
              </Radio.Button>
              <Radio.Button value={30}>
                30天
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
    );
  }

  private onOpenMenu = () => {
    this.setState({
      unit: null,
      isOpen: true,
    });
  }

  private onUnitChange = async(e: number) => {
    if (e !== this.state.unit) {
      this.setState({
        unit: e,
      });
      await this.getRank(e, this.state.days, this.state.type);
    }
  }

  private renderTooltip = ({ active, payload }: any) => {
    const { unit } = this.state;
    if (active && unit) {
      return (
        <div className="hot_data_tooltip_ctn">
          <Character
            cid={unit}
            width={50}
            noBorder={true}
            selected={true}
            style={{ borderRadius: '30px', margin: 'auto', display: 'block' }}
          />
          <p className="label">{`${Units[unit].name}`}</p>
          <p className="intro">{moment(payload[0].payload.day, 'DDD').format("MM/DD")}</p>
          <p className="intro">{`登场次数: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  }

  private onRangeChange = async (e: RadioChangeEvent) => {
    this.setState({
      days: e.target.value,
    });
    await this.getRank(this.state.unit, e.target.value, this.state.type);
  }

  private onTypeChange = async (e: RadioChangeEvent) => {
    this.setState({
      type: e.target.value,
    });
    await this.getRank(this.state.unit, this.state.days, e.target.value);
  }

  private MaxDifference = (arr: DailyRank[]) => {
    let maxDiff = 0;
    for (let x = 0; x < arr.length; ++x) {
      for (let y = x+1; y < arr.length; ++y){
          if (arr[x].day < arr[y].day && maxDiff < (arr[y].day - arr[x].day)){
              maxDiff = arr[y].day - arr[x].day;
          }
      }
    }
    return maxDiff;
  }

  private getRank = async (id: number | null, day: 7 | 15 | 30, type: 'atk' | 'def') => {
    if (this.isLoading || !id) {
      return;
    }
    try {
      this.isLoading = true;
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);

      const body: DailyRankReq = {
        id,
        nonce,
        range: day,
        ts,
        type,
      };
      body._sign = calcHash(body);

      const r = await postServer("/rank/daily", stringify(body));
      console.log(r);
      this.isLoading = false;
      if (r.code === 0) {
        let { data }: { data: DailyRank[] } = r;
        // data over a year
        if (this.MaxDifference(data) > 175) {
          const first = data.filter(e => e.day <= 175);
          const second = data.filter(e => e.day > 175);
          data = [...second, ...first];
        }
        this.setState({
          unitData: data,
          isOpen: false,
        });
      } else {
        Modal.error({
          title: '(╥﹏╥)好像哪里出错了，再试一次吧',
        });
      }
    } catch (err) {
      console.log(err);
      this.isLoading = false;
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
)(UnitsData);