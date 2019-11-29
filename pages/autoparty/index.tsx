import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { AutoPartyReq } from '@type/autoparty';
import { generateNonce, sortUnitId } from '@utils/functions';
import { ErrorModal, LoginModal, RegionNotSupportModal, TooManyModal } from '@utils/modals';
import { postServer } from '@utils/request';
import { Button, Modal, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import Router from 'next/router';
import { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery, { MediaQueryMatchers } from 'react-responsive';
import { bindActionCreators, Dispatch } from 'redux';


const mobileWidth = 501;
const responsive: Partial<MediaQueryMatchers> = { deviceWidth: 320 };



interface AutoPartyProps extends AppState {
  actions: actions.Actions
}

interface AutoPartyState {
  isBtnLoading: boolean,
  jjc: number[],
  pjjc: number[][],
  type: 1 | 2,
  mode: number,
  isMount: boolean,
}

class AutoParty extends Component<AutoPartyProps, AutoPartyState> {
  constructor(props: AutoPartyProps) {
    super(props);
    this.state = {
      isBtnLoading: false,
      jjc: [],
      pjjc: [],
      type: 1,
      mode: 5,
      isMount: false,
    };
  }

  public componentDidMount() {
    this.setState({
      isMount: true,
    });
  }

  public render() {
    const { isMount } = this.state;
    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.autoparty} - ${siteName}`}</title>
        </Head>
        <ItemBox style={{ padding: '6px 30px', marginBottom: '30px' }}>
          <div className="body_title">
            {`${routerName.autoparty}（测试版）`}
            <meta name="description" content={`自动配置竞技场的防守队伍 - ${siteDescription}`} />
          </div>
          <div className="body_subtitle" style={{marginTop: '20px'}}>
            {"使用说明"}
          </div>
          <div className="autoparty_rules_ctn">
            <p>
              {"*这个功能适用于防守队伍"}
            </p>
            <p>
              {"*平常pjjc被打实在懒得换阵容，就做了个自动的（"}
            </p>
            <p>
              {"*要使用自动配队功能，需要"}
              <Button
                type="primary"
                size="small"
                onClick={() => Router.push("/login")}
              >
                登录
              </Button>
            </p>
            <p>
              {"*模式说明："}
            </p>
            <p className="sub_rule">
              {"现在不需要设置box了，并修复了偶尔出现6个角色的问题"}
            </p>
            <p className="sub_rule">
              {"随缘来一队是从现有的数据库中挑一队作业很少且差评数大于好评数的"}
            </p>
            <p className="sub_rule">
              {"生成随机队伍是根据一定的算法自动生成的，每种模式都会有一定的随机因素，所以可能会有看着奇怪的阵容（"}
            </p>
          </div>
          <div>
            类型
          </div>
          <div>
            <Radio.Group 
              value={this.state.type}
              buttonStyle="solid"
              onChange={this.onTypeChange}
              size="small"
            >
              <Radio.Button value={1}>JJC</Radio.Button>
              <Radio.Button value={2}>PJJC</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{margin: '10px 0'}}>
            <Button
              type="primary"
              onClick={() => this.onSubmit(true)}
              loading={this.state.isBtnLoading}
            >
              {`随缘来一队顺眼的${this.state.type === 2 ? ' (自己再配一队)' : ''}`}
            </Button>
          </div>
          <div style={{margin: '25px 8px 0 0'}}>
            额外模式选择
          </div>
          <div>
            <Radio.Group
              value={this.state.mode}
              buttonStyle="solid"
              onChange={this.onModeChange}
              size="small"
            >
              <Radio.Button value={5}>自动</Radio.Button>
              <Radio.Button value={1}>登场率</Radio.Button>
              <Radio.Button value={2}>角色强度</Radio.Button>
              <Radio.Button value={3}>纯随机</Radio.Button>
              <Radio.Button value={4}>最少作业</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{margin: '10px 0'}}>
            <Button
              type="primary"
              onClick={() => this.onSubmit()}
              loading={this.state.isBtnLoading}
            >
              生成随机队伍
            </Button>
          </div>
          <MediaQuery
            minWidth={mobileWidth}
            values={isMount ? undefined : responsive}
          >
            {(matches) => {
              return (
                <div>
                  {this.renderJJC(!matches)}
                  {this.renderPJJC(!matches)}
                </div>
              );
            }}
          </MediaQuery>
        </ItemBox>
      </div>
    );
  }

  private renderJJC(isMobile?: boolean) {
    const { jjc } = this.state;
    const party: any[] = [];
    if (jjc instanceof Array && jjc.length > 0) {
      sortUnitId(jjc).forEach(v => {
        party.push(
          <Character
            cid={v}
            key={v}
            selected={true}
            noBorder={true}
            width={isMobile ? 40 : 60}
          />
        );
      });

      return (
        <div className="battle_search_select">
          {party}
        </div>
      );
    }
  }

  private renderPJJC(isMobile?: boolean) {
    const { pjjc } = this.state;
    const party: any[][] = [[], [], []];
    if (pjjc instanceof Array && pjjc.length > 0) {
      for (let i = 0; i < pjjc.length; ++i) {
        sortUnitId(pjjc[i]).forEach(v => {
          party[i].push(
            <Character
              cid={v}
              key={v}
              selected={true}
              noBorder={true}
              width={isMobile ? 40 : 60}
            />
          );
        });
      }

      return (
        <div>
          {party.map((e, i) => {
            if (e instanceof Array && e.length > 0) {
              return (
                <div className="battle_search_select" key={i}>
                  {e}
                </div>
              );
            }
          })}
        </div>
      );
    }

  }

  private onTypeChange = (e: RadioChangeEvent) => {
    this.setState({
      type: e.target.value
    });
  }

  private onModeChange = (e: RadioChangeEvent) => {
    this.setState({
      mode: e.target.value,
    });
  }

  private onSubmit = async(randomBtn?: boolean) => {
    const { mode, type } = this.state;
    this.setState({
      isBtnLoading: true,
    });
    try {
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);

      const body: AutoPartyReq = {
        mode: randomBtn ? 6 : mode,
        nonce,
        ts,
        type,
      };
      body._sign = calcHash(body);
      const r = await postServer("/autoparty", stringify(body));
      console.log(r);
      this.setState({
        isBtnLoading: false,
      });
      if (r.code === 0) {
        if (type === 1) {
          this.setState({
            jjc: r.data.jjc,
            pjjc: [],
          });
        } else {
          this.setState({
            pjjc: r.data.pjjc,
            jjc: [],
          });
        }
      } else if (r.code === 1) {
        return LoginModal();
      } else if (r.code === 5) {
        return Modal.info({
          title: `box也太少了吧_(:3 」∠ )_`,
        });
      } else if (r.code === 113) {
        return Modal.info({
          title: `正在处理数据，请过几秒再试_(:3 」∠ )_`,
        });
      } else if (r.code === -429) {
        return TooManyModal();
      } else if (r.code === 600) {
        return RegionNotSupportModal();
      }
      else {
        return ErrorModal();
      }
    } catch(e) {
      console.log(e);
      this.setState({
        isBtnLoading: false,
      });
      return ErrorModal();
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
)(AutoParty);