import Character from '@components/character/Character';
import CharaSelect from '@components/charaselect/CharaSelect';
import ItemBox from '@components/itembox/ItemBox';
import { calcHash, routerName, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { ManualPartyRequest, ManualPartyResult } from '@type/battle';
import { generateNonce, sortUnitId } from '@utils/functions';
import { ErrorModal, LoginModal, TooManyModal } from '@utils/modals';
import { postServer } from '@utils/request';
import { Button, Icon, Modal, Radio, Spin } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import Link from 'next/link';
import { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery, { MediaQueryMatchers } from 'react-responsive';
import { bindActionCreators, Dispatch } from 'redux';

const mobileWidth = 501;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const responsive: Partial<MediaQueryMatchers> = { deviceWidth: 320 };


interface PageProps extends AppState {
  actions: actions.Actions
}

interface PageState {
  activePanel: string[],
  selectedCharas: Set<number>,
  btnTitle: '展开' | '收起',
  isMount: boolean,
  isMobile: boolean,
  isLoading: boolean,
  data: ManualPartyResult[] | null,
}

class Battle extends Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      activePanel: [],
      selectedCharas: new Set(),
      btnTitle: '展开',
      isMount: false,
      isMobile: false,
      isLoading: false,
      data: null,
    };
  }

  public async componentDidMount() {
    if (this.props.user.isLogin && this.props.user.userInfo) {
      this.setState({
        isMount: true,
      });
    } else {
      try {
        const r = await this.props.actions.IsLogin();
        if (r.code === 0) {
          this.setState({
            isMount: true,
          });
        } else if (r.code === 1) {
          return LoginModal();
        } else {
          return ErrorModal();
        }
      } catch(err) {
        console.log(err);
        return ErrorModal();
      }
    }
  }

  public render() {
    const { activePanel, selectedCharas, isMount } = this.state;
    if (!isMount) {
      const spinIcon = <Icon type="loading" style={{ fontSize: 60 }} spin={true} />;
      return (
        <div className="global_isloading_center">
          <Head>
            <title>{`${routerName.manualparty} - ${siteName}`}</title>
          </Head>
          <ItemBox style={{minHeight: '50vh', minWidth: '70vw'}}>
            <Spin indicator={spinIcon} />
          </ItemBox>
        </div>
      );
    }

    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.manualparty} - ${siteName}`}</title>
        </Head>
        <ItemBox style={{ paddingBottom: '60px' }}>
          <div className="home_notification_ctn">
            <div className="body_title">
              {routerName.manualparty}
            </div>
            <div className="body_subtitle" style={{marginTop: '20px'}}>
              {"使用说明"}
            </div>
            <div className="autoparty_rules_ctn">
              <p>
                {"*本功能可以查询一些作业很少或者点灭数较高的作业，适用于配置防守队伍"}
              </p>
              <p>
                {"*作业里显示的阵容数，点赞数和点灭数都是该阵容的总数，点阵容数按钮可以快速查询该阵容的作业"}
              </p>
              <p>
                {"*特别说明："}
              </p>
              <p className="sub_rule">
                {"本功能会屏蔽日本ip地址，挂加速器和在日本的小伙伴可以联系我开个权限"}
              </p>
            </div>
            <div className="battle_title_ctn">
              <div className="body_title" />
              <div>
                <Button
                  size="small"
                  type="primary"
                  style={{ margin: '5px 0', fontSize: '0.9rem' }}
                  onClick={this.handleClear}
                >
                  清除
                </Button>
                <Button
                  size="small"
                  type="primary"
                  style={{ margin: '5px 5px', fontSize: '0.9rem' }}
                  onClick={this.toggleMenu}
                >
                  {activePanel.length !== 3 ? '全部展开' : '收起'}
                </Button>
              </div>
            </div>
            <div className="battle_chara_select" id="battle_chara_select">
              <MediaQuery
                minWidth={mobileWidth}
                values={isMount ? undefined : responsive}
              >
                {(matches) => {
                  return (
                    <CharaSelect
                      activePanel={activePanel}
                      onPanelSwitch={this.onPanelSwitch}
                      values={selectedCharas}
                      onChange={this.onCharaSelect}
                      width={matches ? 50 : 40}
                    />
                  );
                }}
              </MediaQuery>
            </div>
            <div className="body_margin_content">
              <RadioGroup
                value={this.props.server.server} 
                buttonStyle="solid"
                onChange={this.onRegionChange}
                className="battle_search_radio"
              >
                <RadioButton value={1}>全部角色</RadioButton>
                <RadioButton value={2}>国服</RadioButton>
                <RadioButton value={3}>台服</RadioButton>
                <RadioButton value={4}>日服</RadioButton>
              </RadioGroup>
            </div>
            <MediaQuery
              minWidth={mobileWidth}
              values={isMount ? undefined : responsive}
            >
              {(matches) => {
                return (
                  <div>
                    {this.renderSearchBar(!matches)}
                  </div>
                );
              }}
            </MediaQuery>
            <MediaQuery
              minWidth={mobileWidth}
              values={isMount ? undefined : responsive}
            >
              {(matches) => {
                return (
                  <div>
                    {this.renderBattleResult(!matches)}
                  </div>
                );
              }}
            </MediaQuery>
          </div>
        </ItemBox>
      </div>
    );
  }

  private onRegionChange = (e: RadioChangeEvent) => {
    const { value } = e.target;
    const { selectedCharas } = this.state;
    const { server } = this.props;
    if (window.localStorage) {
      window.localStorage.setItem('Selected_Server', value);
    }
    this.props.actions.SetServer(value);
    if (value === 2) {
      const cn = new Set(server.cn);
      this.setState({
        selectedCharas: new Set([...selectedCharas].filter(x => !cn.has(x)))
      });
    }
    if (value === 3) {
      const tw = new Set(server.tw);
      this.setState({
        selectedCharas: new Set([...selectedCharas].filter(x => !tw.has(x)))
      });
    }
  }

  private handleClear = () => {
    this.setState({
      selectedCharas: new Set(),
    });
  }

  private toggleMenu = () => {
    if (this.state.activePanel.length < 3) {
      this.setState({
        activePanel: ['front', 'center', 'back'],
        btnTitle: '收起',
      });
    } else {
      this.setState({
        activePanel: [],
        btnTitle: '展开'
      });
    }
  }

  private onPanelSwitch = (e: string[]) => {
    this.setState({
      activePanel: e,
    });
  }

  private onCharaSelect = (e: number, s: boolean) => {
    const { selectedCharas } = this.state;
    // cancel select
    if (s) {
      selectedCharas.delete(e);
      this.setState({
        selectedCharas: new Set(Array.from(selectedCharas)),
      });
    }

    // select
    else {
      if (selectedCharas.size >= 5) {
        return;
      }
      selectedCharas.add(e);
      this.setState({
        selectedCharas: new Set(Array.from(selectedCharas)),
      });
    }
  }

  private renderSearchBar(isMobile?: boolean) {
    const { selectedCharas } = this.state;
    const selected: any[] = [];
    sortUnitId(Array.from(selectedCharas)).forEach(v => {
      selected.push(
        <Character
          cid={v}
          key={v}
          selected={true}
          onSelect={() => this.onCharaSelect(v, true)}
          noBorder={true}
          width={isMobile ? 40 : 60}
        />
      );
    });

    const empty: any[] = [];
    for (let i = 0; i < 5 - selectedCharas.size; ++i) {
      empty.push(
        <div className="battle_search_empty" key={i} />
      );
    }
    return (
      <div>
        <div className="battle_search_select">
          {
            !isMobile
              ?
              <div className="battle_search_select_title">
                包含角色：
              </div>
              :
              null
          }
          {selected}
          {empty}
        </div>
        <div style={{ minWidth: '254px' }}>
          <Button
            type="primary"
            icon="search"
            className="battle_search_button"
            onClick={() => this.onSearch()}
            loading={this.state.isLoading}
          >
            搜索
          </Button>
        </div>
      </div>
    );
  }

  private renderBattleResult(isMobile: boolean) {
    const { data } = this.state;
    if (!data) {
      return (
        <div className="battle_search_select battle_search_result_ctn">
          <div style={{ fontSize: '0.8rem' }}>
            *请选择至少一名角色
          </div>
        </div>
      );
    }

    // BattleResult.result is null, findnothing
    if (data && data.length <= 0) {
      return (
        <div className="battle_search_select battle_search_result_ctn">
          <div style={{ fontSize: '0.8rem' }}>
            <span>
              (ノ▼Д▼)ノ没有找到相关结果呢，换一些角色吧
            </span>
          </div>
        </div>
      );
    }

    const battleData: any[] = [];
    data.forEach((searchResult, idx) => {
      const units: any[] = [];
      searchResult.id.forEach(v => {
        units.push(
          <div key={v} className="battle_result_detail_ctn">
            <Character
              cid={v}
              selected={true}
              noBorder={true}
              width={isMobile ? 40 : 50}
            />
          </div>
        );
      });

      battleData.push(
        <div className="battle_search_single_result_ctn" key={idx}>
          <div className="battle_search_single_result">
            <div className="battle_search_result">
              {units}
            </div>
          </div>
          <div>
            <span>
              <Link
                href={{pathname: '/battle', query: {id: searchResult.id}}}
                as="/battle"
              >
                <Button
                  size="small" 
                  type="primary"
                >
                  {`阵容数:${searchResult.count}`}
                </Button>
              </Link>
            </span>
            <span style={{marginLeft: '20px'}}>
              <Button
                size="small"
                type="link"
              >
                <Icon type="dislike" theme={"outlined"} style={{ color: '#008dff' }} />
                {`${searchResult.down}`}
              </Button>
            </span>
            <span style={{ marginLeft: '5px' }}>
              <Button
                size="small"
                type="link"
              >
                <Icon type="like" theme={"outlined"} />
                {`${searchResult.up}`}
              </Button>
            </span>
          </div>
        </div>
      );

    });

    return (
      <div>
        {battleData}
      </div>
    );
  }

  private onSearch = async () => {
    const {
      isLoading,
      selectedCharas,
    } = this.state;
    const def: number[] = Array.from(selectedCharas);

    if (isLoading) return;
    if (def.length <= 0) {
      return Modal.info({
        title: '请至少选择一名角色',
      });
    }
    console.log('onsearch');
    const nonce = generateNonce();
    const ts = parseInt(moment().format('X'), 10);

    const body: ManualPartyRequest = {
      def,
      nonce,
      region: this.props.server.server,
      ts,
    };
    body._sign = calcHash(body);

    this.setState({
      isLoading: true,
    });

    try {
      const result = await postServer('/manualparty', stringify(body));
      console.log(result);
      this.setState({
        isLoading: false,
      });
      if (result.code === 0) {
        const { data }: { data: ManualPartyResult[] } = result;
        this.setState({
          data,
        });
      } else if (result.code === 1) {
        return LoginModal();
      } else if (result.code === -429) {
        return TooManyModal();
      } else if (result.code === 600) {
        return Modal.info({
          title: `暂时不支持该区域`,
        });
      } else {
        return ErrorModal();
      }
    } catch (e) {
      this.setState({
        isLoading: false,
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
)(Battle);