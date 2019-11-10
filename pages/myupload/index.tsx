import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import Units from '@config/constants/unito.json';
import { calcHash, routerName, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { BattleComment, BattleResult, DeletePrivateBattleRequest, PrivateBattleRequest } from '@type/battle';
import { UnitObject } from '@type/unit';
import { generateNonce } from '@utils/functions';
import { ErrorModal, LoginModal, TooManyModal } from '@utils/modals';
import { postServer } from '@utils/request';
import { Button, Icon, Modal, Spin } from 'antd';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import Router from 'next/router';
import { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery, { MediaQueryMatchers } from 'react-responsive';
import { bindActionCreators, Dispatch } from 'redux';


const ButtonGroup = Button.Group;
const mobileWidth = 501;
const { confirm } = Modal;

const responsive: Partial<MediaQueryMatchers> = { deviceWidth: 320 };
const UnitObj: UnitObject = Units as UnitObject;

interface BattleProps extends AppState {
  actions: actions.Actions
}

interface BattleState {
  isMount: boolean,
  isLoading: boolean,
  data: BattleResult | null,
}


class Battle extends Component<BattleProps, BattleState> {
  constructor(props: BattleProps) {
    super(props);
    this.state = {
      isMount: false,
      isLoading: false,
      data: null,
    };
  }


  public async componentDidMount() {
    this.setState({
      isMount: true,
    });
    
    try {
      await this.onSearch(1);
    } catch(e) {
      console.log(e);
      ErrorModal();
    }
  }

  public render() {
    const { isMount } = this.state;
    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.battle} - ${siteName}`}</title>
          <meta name="description" content={`公主连结竞技场数据查询 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{ paddingBottom: '60px', minHeight: '80vh' }}>
          <div className="home_notification_ctn">
            <div className="battle_title_ctn">
              <div className="body_title">
                {routerName.myupload}
              </div>
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
            <div className="autoparty_rules_ctn" style={{marginTop: '20px'}}>
              {"*这里可以查看和管理私有作业"}
            </div>
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

  private renderBattleResult(isMobile: boolean) {
    const { data } = this.state;
    if (!data) {
      const spinIcon = <Icon type="loading" style={{ fontSize: 60 }} spin={true} />;
      return (
        <div className="global_isloading_center">
          <Spin indicator={spinIcon} />
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
    data.result.forEach(battleResult => {
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
      let comment = "";
      if (comments.length > 0) {
        comment = comments[0].msg;
      }

      battleData.push(
        <div className="battle_search_single_result_ctn" key={battleResult.id}>
          <div className="battle_search_single_result">
            <div className="battle_search_result" style={{ marginRight: '20px' }}>
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
              <div style={{ margin: '3px 0' }}>
                <span>
                  {`${comment}  `}
                </span>
              </div>
              :
              null
          }
          <div className="battle_search_single_meta">
            <div className="battle_search_result_btns">
              <Button
                size="small"
                type="primary"
                onClick={() => this.handleDelete(battleResult.id)}
              >
                删除
              </Button>
            </div>
            <div className="battle_search_result_btns">
              {moment(battleResult.updated).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
        </div>
      );

    });

    return (
      <div>
        {battleData}
        {this.renderPagination()}
      </div>
    );
  }

  private renderPagination() {
    const { isLoading, data } = this.state;
    if (data && data.result) {
      const enablePrev: boolean = data.page.page !== 1;
      const enableNext: boolean = data.page.hasMore;
      return (
        <ButtonGroup size="small" style={{ float: 'right' }}>
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
    const { isLogin, userInfo } = this.props.user;
    if (isLogin && userInfo) {
      Router.push("/battle/upload");
    } else {
      return LoginModal();
    }
  }

  private onChangePage = async (next: boolean) => {
    const { data } = this.state;
    if (!data || !data.result) return;
    if (next && !data.page.hasMore) return;
    if (!next && data.page.page === 1) return;

    let targetPage = next ? data.page.page + 1 : data.page.page - 1;
    if (targetPage < 1) targetPage = 1;
    return this.onSearch(targetPage);
  }

  private handleDelete = (id: string) => {
    confirm({
      title: '确定删除吗？',
      onOk: () => this.onDelete(id),
    });
  }

  private onDelete = async(id: string) => {
    console.log(id);
    const nonce = generateNonce();
    const ts = parseInt(moment().format('X'), 10);

    const body: DeletePrivateBattleRequest = {
      id,
      nonce,
      ts,
    };
    body._sign = calcHash(body);

    try {
      const result = await postServer('/search/private/delete', stringify(body));
      if (result.code === 0) {
        const { data } = this.state;
        if (data && data.result instanceof Array) {
          data.result = data.result.filter(e => e.id !== id);
          this.setState({
            data,
          });
        }
      }
      else if (result.code === 1) {
        return LoginModal();
      }
      else if (result.code === -429) {
        return TooManyModal();
      }
      else {
        return ErrorModal();
      }
    } catch (e) {
      this.setState({
        isLoading: false,
      });
      return ErrorModal();
    }
  }

  private onSearch = async (page = 1) => {
    const {
      isLoading,
    } = this.state;

    if (isLoading) return;
    if (page > 30) {
      return Modal.info({
        title: '没有更多了！',
      });
    }

    const nonce = generateNonce();
    const ts = parseInt(moment().format('X'), 10);

    const body: PrivateBattleRequest = {
      nonce,
      page,
      ts,
    };
    body._sign = calcHash(body);

    this.setState({
      isLoading: true,
    });

    try {
      const result = await postServer('/search/private', stringify(body));
      console.log(result);
      this.setState({
        isLoading: false,
      });

      if (result.code === 0) {
        const { data }: { data: BattleResult } = result;
        this.setState({
          data,
        });
      }
      else if (result.code === 1) {
        return LoginModal();
      }
      else if (result.code === -429) {
        return TooManyModal();
      }
      else {
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