import Character from '@components/character/Character';
import CharaSelect from '@components/charaselect/CharaSelect';
import ItemBox from '@components/itembox/ItemBox';
import Units from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { BattleComment, BattleDetail, BattleRequest, BattleResult, LikeRequest, UpdateCommentRequest } from '@type/battle';
import { UnitObject } from '@type/unit';
import { generateNonce, sortUnitId } from '@utils/functions';
import { ErrorModal, LoginModal, TooManyModal } from '@utils/modals';
import { postServer } from '@utils/request';
import { Button, Collapse, Icon, Input, message, Modal, Radio, Tabs } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import Router, { SingletonRouter, withRouter } from 'next/router';
import { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery, { MediaQueryMatchers } from 'react-responsive';
import { bindActionCreators, Dispatch } from 'redux';
import ATKRange from '../tools/atkrange';



const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const mobileWidth = 501;

const { TextArea } = Input;
const responsive: Partial<MediaQueryMatchers> = { deviceWidth: 320 };
const { TabPane } = Tabs;
const { Panel } = Collapse;
const UnitObj: UnitObject = Units as UnitObject;

interface BattleProps extends AppState {
  router: SingletonRouter,
  actions: actions.Actions,
}

interface BattleState {
  activePanel: string[],
  selectedCharas: Set<number>,
  cachedCharas: number[],
  cachedCharaByTab: number[][],
  sort: number,
  btnTitle: '展开' | '收起',
  isMount: boolean,
  isLoading: boolean,
  data1: BattleResult | null,
  data2: BattleResult | null,
  data3: BattleResult | null,
  comment: string,
  commentVisible: boolean,
  commentID: string,
  cmtBtnLoading: boolean,
  selectedComments: BattleComment[],
  showComments: boolean,
  currentTab: TabInfo,
  hotSearch: number[][],
  showHotSearch: boolean,
  hotSearchKey: string[],
  showAtkRange: boolean,
  atkRangeAtk: number[],
  atkRangeDef: number[],
}

type TabInfo = 'data1' | 'data2' | 'data3';

class Battle extends Component<BattleProps, BattleState> {
  constructor(props: BattleProps) {
    super(props);
    this.state = {
      activePanel: [],
      selectedCharas: new Set(),
      sort: 1,
      btnTitle: '展开',
      isMount: false,
      isLoading: false,
      data1: null,
      data2: null,
      data3: null,
      comment: "",
      commentVisible: false,
      commentID: "",
      cmtBtnLoading: false,
      selectedComments: [],
      showComments: false,
      currentTab: 'data1',
      cachedCharas: [],
      cachedCharaByTab: [[], [], []],
      hotSearch: [],
      showHotSearch: false,
      hotSearchKey: ['1'],
      showAtkRange: false,
      atkRangeAtk: [],
      atkRangeDef: [],
    };
  }


  public async componentDidMount() {
    console.log(this.props);
    this.setState({
      isMount: true,
    });

    try {
      // check if query existed
      const { query } = this.props.router;
      if (query && query.id instanceof Array && query.id.length > 0 && query.id.length <= 5) {
        const arr: number[] = [];
        query.id.forEach(e => {
          const id = parseInt(e, 10);
          if (!UnitObj[id]) {
            return;
          }
          arr.push(id);
        });
        this.setState({
          selectedCharas: new Set(arr),
        }, async() => {
          await this.onSearch(true);
        });
      }

      // get hot search data
      const result = await postServer('/search/hot');
      console.log(result);
      if (result.code === 0 && result.data.data instanceof Array && result.data.data.length > 0) {
        this.setState({
          showHotSearch: true,
          hotSearch: result.data.data,
        });
      }
    } catch(e) {
      console.log(e);
    }
    
  }

  public render() {
    const { activePanel, selectedCharas, isMount, currentTab } = this.state;
    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.battle} - ${siteName}`}</title>
          <meta name="description" content={`公主连结竞技场数据查询 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{paddingBottom: '60px'}}>
          <div className="home_notification_ctn">
            <div className="battle_title_ctn">
              <div className="body_title">
                {routerName.battle}
              </div>
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
                <Button
                  size="small"
                  type="primary"
                  style={{margin: '5px 5px', fontSize: '0.9rem'}}
                  onClick={this.handleUpload}
                  icon="upload"
                >
                  上传
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
            <Tabs
              defaultActiveKey="data1"
              onChange={(e) => this.onTabSwitch(e as TabInfo)}
              activeKey={currentTab}
            >
              <TabPane tab="1队" key="data1">
                <MediaQuery
                  minWidth={mobileWidth}
                  values={isMount ? undefined : responsive}
                >
                  {(matches) => {
                    return (
                      <div>
                        {this.renderBattleResult(!matches, currentTab)}
                      </div>
                    );
                  }}
                </MediaQuery>
              </TabPane>
              <TabPane tab="2队" key="data2">
                <MediaQuery
                  minWidth={mobileWidth}
                  values={isMount ? undefined : responsive}
                >
                  {(matches) => {
                    return (
                      <div>
                        {this.renderBattleResult(!matches, currentTab)}
                      </div>
                    );
                  }}
                </MediaQuery>
              </TabPane>
              <TabPane tab="3队" key="data3">
                <MediaQuery
                  minWidth={mobileWidth}
                  values={isMount ? undefined : responsive}
                >
                  {(matches) => {
                    return (
                      <div>
                        {this.renderBattleResult(!matches, currentTab)}
                      </div>
                    );
                  }}
                </MediaQuery>
              </TabPane>
            </Tabs>
          </div>
          <Modal
            visible={this.state.commentVisible}
            title={null}
            width={600}
            onCancel={this.closeNewComment}
            maskClosable={true}
            okText={"提交"}
            cancelText={"取消"}
            confirmLoading={this.state.cmtBtnLoading}
            onOk={this.onUpdateComment}
            style={{minWidth:'300px'}}
          >
            <div>
              <div className="body_title">写评论</div>
              <p>{"*每个账号在同一条记录下的新评论会覆盖旧评论"}</p>
              <p>{"*每条评论最多50字，每条记录会保留20条最新评论"}</p>
              <TextArea 
                rows={4}
                onChange={this.onInputChange}
                value={this.state.comment}
              />
            </div>
          </Modal>
          {this.renderComment()}
          {this.renderAtkRange()}
          <MediaQuery
            minWidth={mobileWidth}
            values={isMount ? undefined : responsive}
          >
            {(matches) => {
              return (
                <div>
                  {this.renderHotSearch(!matches)}
                </div>
              );
            }}
          </MediaQuery>
        </ItemBox>
      </div>
    );
  }

  private renderAtkRange = () => {
    const { user } = this.props;
    if (user.isLogin && user.userInfo) {
      return (
        <Modal
          visible={this.state.showAtkRange}
          title={null}
          width={800}
          onCancel={this.onCloseAtkRange}
          maskClosable={true}
          style={{minWidth:'300px'}}
          bodyStyle={{padding: '0'}}
          footer={null}
          destroyOnClose={true}
        >
          <ATKRange
            fromSearch={true}
            atk={this.state.atkRangeAtk}
            def={this.state.atkRangeDef}
          />
        </Modal>
      );
    }
  }

  private onCloseAtkRange = () => {
    this.setState({
      showAtkRange: false,
      atkRangeAtk: [],
      atkRangeDef: [],
    });
  }

  private onOpenAtkRange = (atk: BattleDetail[], def: BattleDetail[]) => {
    console.log(atk, def);
    const atkArr = atk.map(e => e.id);
    const defArr = def.map(e => e.id);
    this.setState({
      showAtkRange: true,
      atkRangeAtk: atkArr,
      atkRangeDef: defArr,
    });
  }

  private onTabSwitch = (e: TabInfo) => {
    const { cachedCharaByTab } = this.state;
    if (e === 'data1') {
      this.setState({
        currentTab: e,
        cachedCharas: cachedCharaByTab[0],
        selectedCharas: new Set(cachedCharaByTab[0])
      });
    } else if (e === 'data2') {
      this.setState({
        currentTab: e,
        cachedCharas: cachedCharaByTab[1],
        selectedCharas: new Set(cachedCharaByTab[1])
      });
    } else {
      this.setState({
        currentTab: e,
        cachedCharas: cachedCharaByTab[2],
        selectedCharas: new Set(cachedCharaByTab[2])
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

  private onHotSearchSwitch = (e: any) => {
    this.setState({
      hotSearchKey: e,
    });
  }

  private onRadioChange = (e: RadioChangeEvent) => {
    const v: number = e.target.value;
    this.setState({
      sort: v
    }, () => {
      this.onSearch();
    });
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

  // WTF??? component will not update??? bug?
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
                防守方：
              </div>
              :
              null
          }
          {selected}
          {empty}
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
        <div className="battle_search_select battle_search_result_ctn">
          <div style={{ fontSize: '0.8rem' }}>
            *搜索的结果只会返回已选择服务器里存在的角色
          </div>
        </div>
        <div style={{minWidth: '254px'}}>
          <RadioGroup
            onChange={this.onRadioChange} 
            value={this.state.sort} 
            buttonStyle="solid" 
            className="battle_search_radio"
          >
            <RadioButton value={1}>综合排序</RadioButton>
            <RadioButton value={2}>按时间</RadioButton>
            <RadioButton value={3}>按评价</RadioButton>
          </RadioGroup>
          <Button
            type="primary"
            icon="search"
            className="battle_search_button"
            onClick={() => this.onSearch(true)}
            loading={this.state.isLoading}
          >
            搜索
          </Button>
        </div>
      </div>
    );
  }

  private renderBattleResult(isMobile: boolean, activeKey: TabInfo) {
    const data = this.state[activeKey];
    if (!data) {
      return (
        <div className="battle_search_select battle_search_result_ctn">
          <div style={{ fontSize: '0.8rem' }}>
            *请选择对方的防守阵容
          </div>
        </div>
      );
    }

    // BattleResult.result is null, findnothing
    if (data.result && data.result.length <= 0) {
      return (
        <div className="battle_search_select battle_search_result_ctn">
          <div style={{ fontSize: '0.8rem' }}>
            <span>
              (ノ▼Д▼)ノ没有找到相关结果呢，去
            </span>
            <Button
              size="small"
              type="primary"
              style={{ margin: '0 5px', fontSize: '0.9rem' }}
              onClick={this.handleUpload}
              icon="upload"
            >
              上传
            </Button>
            <span>
              一个记录吧
            </span>
          </div>
        </div>
      );
    }

    const battleData: any[] = [];
    data.result.forEach((battleResult, idx) => {
      const atk: any[] = [];
      const def: any[] = [];
      battleResult.atk.forEach(v => {
        let starMap = [1, 1, 1, 1, 1];
        const is6x = UnitObj[v.id].maxrarity === 6;
        if (is6x) {
          starMap = [1, 1, 1, 1, 1, 1];
        }
        atk.push(
          <div key={v.id} className="battle_result_detail_ctn">
            <Character
              cid={v.id}
              selected={true}
              noBorder={true}
              width={isMobile ? 40 : 50}
              show6x={is6x && v.star === 6}
            />
            {
              v.star > 0
                ?
                <div className="battle_result_star_ctn">
                  {starMap.map((_, i) => {
                    const rotate = is6x && i === 5 ? 'hue-rotate(270deg)' : 'unset';
                    return (
                      <span className="star_ctn" key={i}>
                        <img
                          src={`/static/icon/star${i < v.star ? "" : "_disabled"}.png`}
                          className="battle_result_star_img"
                          style={{filter: rotate}}
                        />
                      </span>
                    );
                  })}
                </div>
                :
                null
            }
            {
              v.equip
                ?
                <div className="battle_result_equip_ctn">
                  <img
                    src={"/static/icon/equip.png"}
                    className="battle_result_equip_img"
                  />
                </div>
                :
                null
            }
          </div>
        );
      });

      battleResult.def.forEach(v => {
        let starMap = [1, 1, 1, 1, 1];
        const is6x = UnitObj[v.id].maxrarity === 6;
        if (is6x) {
          starMap = [1, 1, 1, 1, 1, 1];
        }
        def.push(
          <div key={v.id} className="battle_result_detail_ctn">
            <Character
              cid={v.id}
              selected={true}
              noBorder={true}
              width={isMobile ? 40 : 50}
              show6x={is6x && v.star === 6}
            />
            {
              v.star > 0
                ?
                <div className="battle_result_star_ctn">
                  {starMap.map((_, i) => {
                    const rotate = is6x && i === 5 ? 'hue-rotate(270deg)' : 'unset';
                    return (
                      <span className="star_ctn" key={i}>
                        <img
                          src={`/static/icon/star${i < v.star ? "" : "_disabled"}.png`}
                          className="battle_result_star_img"
                          style={{filter: rotate}}
                        />
                      </span>
                    );
                  })}
                </div>
                :
                null
            }
            {
              v.equip
                ?
                <div className="battle_result_equip_ctn">
                  <img
                    src={"/static/icon/equip.png"}
                    className="battle_result_equip_img"
                  />
                </div>
                :
                null
            }
          </div>
        );
      });

      const comments = battleResult.comment.sort((a: BattleComment, b: BattleComment) => {
        return +new Date(b.date) - +new Date(a.date);
      });
      let multiComments = false;
      let comment = "";
      if (comments.length > 0) {
        comment = comments[0].msg;
        if (comments.length > 1) multiComments = true;
      }

      battleData.push(
        <div className="battle_search_single_result_ctn" key={battleResult.id}>
          <div className="battle_search_single_result">
            <div className="battle_search_result" style={{marginRight: '20px'}}>
              <div
                style={{
                  backgroundImage: `url('/static/icon/win.png')`,
                  height: isMobile ? '12px' : '40px',
                  width: isMobile ? '20px' : '50px',
                }}
                className="battle_search_single_logo"
              />
              {atk}
            </div>
            <div className="battle_search_result">
              <div
                style={{
                  backgroundImage: `url('/static/icon/lose.png')`,
                  height: isMobile ? '12px' : '40px',
                  width: isMobile ? '20px' : '50px',
                }}
                className="battle_search_single_logo"
              />
              {def}
            </div>
          </div>
          {
            comment
              ?
              <div style={{margin: '3px 0'}}>
                <span>
                  {`${comment}  `}
                </span>
                {
                  multiComments
                    ?
                    <Button
                      type="primary"
                      size="small"
                      icon="bulb"
                      onClick={() => this.showComment(comments)}
                    >
                      更多
                    </Button>
                    :
                    null
                }
              </div>
              :
              null
          }
          <div className="battle_search_single_meta">
            {
              battleResult.private
                ?
                <div className="battle_search_result_btns">
                  <div className="battle_search_private">
                    非公开
                  </div>
                </div>
                :
                <div className="battle_search_result_btns">
                  <Button
                    size="small"
                    type="link"
                    onClick={() => this.handleLike(battleResult.id, 'like', battleResult.liked, idx)}
                  >
                    <Icon type="like" theme={battleResult.liked ? "filled" : "outlined"} />
                    {`  ${battleResult.up}`}
                  </Button>
                  <Button
                    size="small" 
                    type="link" 
                    style={{marginLeft: '10px'}}
                    onClick={() => this.handleLike(battleResult.id, 'dislike', battleResult.disliked, idx)}
                  >
                    <Icon type="dislike" theme={battleResult.disliked ? "filled" : "outlined"} style={{ color: '#008dff'}} />
                    {`  ${battleResult.down}`}
                  </Button>
                  <Button
                    size="small" 
                    type="primary" 
                    style={{marginLeft: '10px'}}
                    onClick={() => this.addComment(battleResult.id)}
                  >
                    {`写评论`}
                  </Button>
                  {
                    battleResult.iseditor
                      ?
                      <div className="battle_search_iseditor">
                        上传者
                      </div>
                      :
                      null
                  }
                </div>
            }
            <div className="battle_search_result_btns">
              {moment(battleResult.updated).format("YYYY-MM-DD HH:mm")}
              {
                this.props.user.isLogin && this.props.user.userInfo
                  ?
                  <Button
                    size="small" 
                    type="primary" 
                    style={{marginLeft: '10px'}}
                    onClick={() => this.onOpenAtkRange(battleResult.atk, battleResult.def)}
                  >
                    {`攻击范围计算`}
                  </Button>
                  :
                  null
              }
            </div>
          </div>
        </div>
      );

    });

    return (
      <div>
        {battleData}
        {this.renderPagination(activeKey)}
      </div>
    );
  }

  private renderComment() {
    const { selectedComments } = this.state;
    const comments: any = [];
    selectedComments.forEach((e, i) => {
      comments.push(
        <div key={i} className="battle_more_comment">
          <div className="title">
            <div>
              <Character
                cid={e.avatar ? e.avatar : 105801}
                width={20}
                selected={true}
                noBorder={true}
                style={{borderRadius: '20px', float: 'left'}}
              />
              {e.nickname ? e.nickname : "无名"}
            </div>
            <div>
              {moment(e.date).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
          <div>
            {e.msg}
          </div>
        </div>
      );
    });
    return (
      <Modal
        visible={this.state.showComments}
        title={null}
        width={600}
        onCancel={this.closeCommentModal}
        maskClosable={true}
        footer={null}
        style={{minWidth:'300px'}}
      >
        <div>
          <div className="body_title">更多评论</div>
          {comments}
          <Button
            type="primary" 
            size="small" 
            style={{margin:'auto', display:'block'}}
            onClick={this.closeCommentModal}
          >
            关闭
          </Button>
        </div>
      </Modal>
    );
  }

  private renderHotSearch = (isMobile?: boolean) => {
    const margin = isMobile ? "auto 5px" : "auto 20px";
    const padding = isMobile ? "2px 3px" : "5px 10px";
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };

    if (this.state.showHotSearch) {
      const hotData = [] as any;
      this.state.hotSearch.forEach((searchRes, idx) => {
        const data = [] as any;
        searchRes.forEach(res => {
          data.push(
            <div key={res} className="battle_result_detail_ctn">
              <Character
                cid={res}
                selected={true}
                noBorder={true}
                width={isMobile ? 40 : 55}
              />
            </div>
          );
        });
        
        hotData.push(
          <div className="battle_search_single_result" key={idx}>
            <div className="battle_search_result" style={{padding}}>
              {data}
              <Button
                type="primary" 
                icon="search"
                size={isMobile ? "small" : "default"}
                style={{margin}}
                onClick={() => this.onSearchFromHot(searchRes)}
              >
                搜索
              </Button>
            </div>
          </div>
        );
      });
      return (
        <div className="body_margin_content">
          <Collapse
            bordered={false}
            activeKey={this.state.hotSearchKey}
            onChange={this.onHotSearchSwitch}
          >
            <Panel header="热门搜索" key="1" style={customPanelStyle}>
              {hotData}
            </Panel>
          </Collapse>
        </div>
      );
    }
    
  }

  private showComment = (c: BattleComment[]) => {
    this.setState({
      selectedComments: c,
      showComments: true,
    });
  }

  private closeCommentModal = () => {
    this.setState({
      selectedComments: [],
      showComments: false,
    });
  }

  private addComment = (id: string) => {
    this.setState({
      comment: "",
      commentVisible: true,
      commentID: id,
    });
  }

  private closeNewComment = () => {
    console.log('close');
    this.setState({
      comment: "",
      commentVisible: false,
      commentID: "",
    });
  }

  private onUpdateComment = async() => {
    const { comment, commentID, currentTab } = this.state;

    if (!comment) {
      return Modal.info({
        "title": "写点东西吧（",
      });
    }
    const nonce = generateNonce();
    const ts = parseInt(moment().format('X'), 10);

    const body: UpdateCommentRequest = {
      comment,
      id: commentID,
      nonce,
      ts,
    };
    body._sign = calcHash(body);
    this.setState({
      cmtBtnLoading: true,
    });

    try {
      const result = await postServer('/battle/comment', stringify(body));
      console.log(result);
      this.setState({
        cmtBtnLoading: false,
      });

      if (result.code === 0) {
        message.success("提交成功");
        this.closeNewComment();
        if (this.state[currentTab]) {
          this.onSearch(false, (this.state[currentTab] as BattleResult).page.page);
        }
      }
      else if (result.code === 1) {
        this.closeNewComment();
        return LoginModal();
      }
      else if (result.code === -429) {
        this.closeNewComment();
        return TooManyModal();
      }
      else {
        return ErrorModal();
      }
    } catch(e) {
      this.setState({
        cmtBtnLoading: false,
      });
      return ErrorModal();
    }
  }

  private onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 50) {
      return;
    }
    this.setState({
      comment: e.target.value,
    });
  }

  private renderPagination(activeKey: TabInfo) {
    const data = this.state[activeKey];
    const { isLoading } = this.state;
    if (data && data.result) {
      const enablePrev: boolean = data.page.page !== 1;
      const enableNext: boolean = data.page.hasMore;
      return (
        <ButtonGroup size="small" style={{float: 'right'}}>
          <Button
            type="primary"
            disabled={!enablePrev || isLoading}
            style={{ fontSize: '0.8rem' }}
            onClick={() => this.onChangePage(false)}
          >
            <Icon type="left" />
            上一页
          </Button>
          <Button
            type="primary"
            disabled={!enableNext || isLoading}
            style={{ fontSize: '0.8rem' }}
            onClick={() => this.onChangePage(true)}
          >
            下一页
            <Icon type="right" />
          </Button>
        </ButtonGroup>
      );
    }
  }

  private handleUpload = () => {
    /*
    const { isLogin, userInfo} = this.props.user;
    if (isLogin && userInfo) {
      Router.push("/battle/upload");
    } else {
      return LoginModal();
    }
    */
    Router.push("/battle/upload");
  }

  private onChangePage = async(next: boolean) => {
    const { currentTab } = this.state;
    const data = this.state[currentTab];
    if (!data || !data.result) return;
    if (next && !data.page.hasMore) return;
    if (!next && data.page.page === 1) return;

    let targetPage = next ? data.page.page + 1 : data.page.page - 1;
    if (targetPage < 1) targetPage = 1;
    return this.onSearch(false, targetPage);
  }

  private onSearchFromHot = (team: number[]) => {
    this.setState({
      selectedCharas: new Set(team),
    }, async() => {
      await this.onSearch(true);
    });
  }

  private onSearch = async(fromButton = false, page = 1) => {
    const { 
      isLoading, 
      sort, 
      selectedCharas, 
      currentTab, 
      cachedCharas,
      cachedCharaByTab,
      hotSearch,
      showHotSearch,
    } = this.state;
    const def: number[] = fromButton ? Array.from(selectedCharas) : cachedCharas;
    
    if (isLoading) return;
    if (page > 30) {
      return Modal.info({
        title: '没有更多了！',
      });
    }
    
    if (def.length <= 0) {
      if (fromButton) {
        return Modal.info({
          title: '请至少选择一名角色',
        });
      }
      else return;
    }
    console.log('onsearch');
    const nonce = generateNonce();
    const ts = parseInt(moment().format('X'), 10);

    const body: BattleRequest = {
      def,
      nonce,
      page,
      region: this.props.server.server,
      sort,
      ts,
    };
    body._sign = calcHash(body);
    this.setState({
      isLoading: true,
    });
    try {
      const result = await postServer('/search', stringify(body));
      console.log(result);
      this.setState({
        isLoading: false,
      });

      if (result.code === 0) {
        const { data }: {data: BattleResult} = result;
        if (currentTab === 'data1') {
          cachedCharaByTab[0] = def;
          this.setState({
            data1: data,
            cachedCharas: def,
            cachedCharaByTab
          });
        } else if (currentTab === 'data2') {
          cachedCharaByTab[1] = def;
          this.setState({
            data2: data,
            cachedCharas: def,
            cachedCharaByTab
          });
        } else {
          cachedCharaByTab[2] = def;
          this.setState({
            data3: data,
            cachedCharas: def,
            cachedCharaByTab
          });
        }
        if (data.result.length > 0) {
          this.setState({
            hotSearchKey: [],
          });
        } else if (showHotSearch && hotSearch.length > 0) {
          this.setState({
            hotSearchKey: ['1'],
          });
        }
      }
      else if (result.code === -429) {
        return TooManyModal();
      }
      else {
        return ErrorModal();
      }
    } catch(e) {
      this.setState({
        isLoading: false,
      });
      return ErrorModal();
    }
  }

  private handleLike = async (id: string, action: 'like' | 'dislike', triggered: boolean, idx: number) => {
    const { isLogin, userInfo } = this.props.user;
    const { currentTab } = this.state;
    if (!(isLogin && userInfo)) {
      return LoginModal();
    }

    try {
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);

      const body: LikeRequest = {
        action,
        cancel: triggered,
        id,
        nonce,
        ts
      };
      body._sign = calcHash(body);
      const r = await postServer('/battle/like', stringify(body));
      console.log(r);
      if (r.code === 0 && this.state[currentTab]) {
        const { result } = this.state[currentTab] as BattleResult;
        if (result instanceof Array) {
          const target = result[idx];
          // like
          if (action === 'like') {
            if (triggered) {
              target.up -= 1;
              target.liked = false;
            } else {
              target.up += 1;
              target.liked = true;
              if (target.disliked) {
                target.down -= 1;
                target.disliked = false;
              }
            }
          }
          // dislike
          else {
            if (triggered) {
              target.down -= 1;
              target.disliked = false;
            } else {
              target.down += 1;
              target.disliked = true;
              if (target.liked) {
                target.up -= 1;
                target.liked = false;
              }
            }
          }

          const obj:any = {};
          obj[currentTab] = this.state[currentTab];
          this.setState(obj);
        }
      }
      else if (r.code === -429) {
        return TooManyModal();
      }
      else {
        return ErrorModal();
      }
    } catch(err) {
      console.log(err);
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
)(withRouter(Battle));