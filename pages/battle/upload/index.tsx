import Character from '@components/character/Character';
import CharaSelect from '@components/charaselect/CharaSelect';
import ItemBox from '@components/itembox/ItemBox';
import Units from '@config/constants/unito.json';
import { calcHash, siteDescription, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { BattleDetail, BattleUploadRequest } from '@type/battle';
import { UnitObject } from '@type/unit';
import { generateNonce, sortUnitId } from '@utils/functions';
import { LoginModal } from '@utils/modals';
import { postServer } from '@utils/request';
import { Button, Input, Modal, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import Router from 'next/router';
import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery, { MediaQueryMatchers } from 'react-responsive';
import { bindActionCreators, Dispatch } from 'redux';


const mobileWidth = 501;
const UnitObj: UnitObject = Units as UnitObject;
const { TextArea } = Input;

type showModalType = 'atk' | 'def' | null;

interface PageProps extends AppState {
  actions: actions.Actions
}

interface UploadState {
  atk: Set<number>,
  atkDetail: BattleDetail[],
  def: Set<number>,
  defDetail: BattleDetail[],
  comment: string,
  isMount: boolean,
  activePanel: string[],
  isBtnLoading: boolean,
  showModal: showModalType,
  uploadType: number,
  showDetail: boolean,
  detailType: showModalType,
  detailIdx: number,
}

class Upload extends React.Component<PageProps, UploadState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      atk: new Set(),
      atkDetail: [],
      def: new Set(),
      defDetail: [],
      comment: "",
      isMount: false,
      isBtnLoading: false,
      activePanel: ['front', 'center', 'back'],
      showModal: null,
      uploadType: 1,
      showDetail: false,
      detailType: null,
      detailIdx: 0,
    };
  }

  public componentDidMount() {
    this.setState({
      isMount: true,
    });
  }

  public render() {
    const { isMount, activePanel, showModal, atk, def, showDetail } = this.state;
    const { isLogin, userInfo } = this.props.user;
    const responsive: Partial<MediaQueryMatchers> = { deviceWidth: 320 };

    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`战绩上传 - ${siteName}`}</title>
          <meta name="description" content={`公主连结竞技场战绩上传 - ${siteDescription}`} />
        </Head>
        <ItemBox style={{paddingBottom: '60px'}}>
          <div className="home_notification_ctn">
            <div className="battle_title_ctn">
              <div className="body_title">
                战绩上传
              </div>
              <div>
                <Button
                  size="small"
                  type="primary"
                  style={{ margin: '5px 5px', fontSize: '0.9rem' }}
                  onClick={() => Router.push("/battle")}
                  icon="rollback"
                >
                  返回
                </Button>
              </div>
            </div>
            <div className="battle_upload_description_ctn">
              <p>{'*注意事项'}</p>
              <p>
                数据是以日服最新数据为基准的，选国服/台服的时候请确认
                <span style={{ color: "#ff2d54"}}>
                  星数，专武
                </span>
                是否符合当前版本
              </p>
            </div>
            <div>
              <div className="body_subtitle" style={{marginTop: '20px'}}>
                选择角色范围
              </div>
              <Radio.Group
               value={this.props.server.server} 
               buttonStyle="solid"
               onChange={this.onRegionChange}
              >
                <Radio.Button value={1}>全部</Radio.Button>
                <Radio.Button value={2}>国服</Radio.Button>
                <Radio.Button value={3}>台服</Radio.Button>
                <Radio.Button value={4}>日服</Radio.Button>
              </Radio.Group>
            </div>
            <div className="battle_search_select battle_search_result_ctn">
              <div style={{ fontSize: '0.8rem' }}>
                *上传后会自动分配可能对应的服务器，如果有特殊条件请写在评论里
              </div>
            </div>
            <div style={{marginTop: '20px'}}>
              <MediaQuery
                minWidth={mobileWidth}
                values={isMount ? undefined : responsive}
              >
                {(matches) => {
                  return (
                    <div>
                      {this.renderSelect(false, !matches)}
                      {
                        !matches
                          ?
                          <div className="battle_search_select battle_search_result_ctn">
                            <div style={{ fontSize: '0.8rem' }}>
                              *手机如果不方便点星级专武的话可以点角色头像放大
                            </div>
                          </div>
                          :
                          null
                      }
                      {this.renderSelect(true, !matches)}
                    </div>
                  );
                }}
              </MediaQuery>
            </div>
            <div>
              <div className="body_subtitle" style={{marginTop: '20px'}}>
                公开范围
              </div>
              <Radio.Group
               value={this.state.uploadType} 
               buttonStyle="solid"
               onChange={this.onTypeChange}
               disabled={!(isLogin && userInfo)}
              >
                <Radio.Button value={1}>公开</Radio.Button>
                <Radio.Button value={2}>非公开</Radio.Button>
              </Radio.Group>
              <div className="body_subtitle" style={{ marginTop: '20px' }}>
                评论（最多50字）
              </div>
              <div>
                <TextArea 
                  rows={4}
                  onChange={this.onInputChange}
                  value={this.state.comment}
                />
              </div>
            </div>
            <div>
              <Button
                type="primary"
                size="large"
                className="body_submit_button"
                style={{display: 'block'}}
                onClick={this.onSubmit}
                loading={this.state.isBtnLoading}
              >
                提交
              </Button>
            </div>
          </div>
        </ItemBox>
        <Modal
          visible={!!showModal}
          title={null}
          footer={null}
          onOk={() => this.showSelectModal(null)}
          onCancel={() => this.showSelectModal(null)}
          width={"600px"}
          style={{minWidth:"300px"}}
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
        <Modal
          visible={showDetail}
          title={null}
          footer={null}
          onOk={() => this.hideDetailModal()}
          onCancel={() => this.hideDetailModal()}
          width={"200px"}
          style={{minWidth:"150px"}}
        >
          {this.renderDetailModal()}
        </Modal>
      </div>
    );
  }

  private onTypeChange = (e: RadioChangeEvent) => {
    console.log(e.target.value);
    this.setState({
      uploadType: e.target.value,
    });
  }

  private calcSet = (e: Set<number>, value: number) => {
    const { server } = this.props;
    if (value === 2) {
      const cn = new Set(server.cn);
      return new Set([...e].filter(x => !cn.has(x)));
    }
    if (value === 3) {
      const tw = new Set(server.tw);
      return new Set([...e].filter(x => !tw.has(x)));
    }
    return e;
  }

  private onRegionChange = (event: RadioChangeEvent) => {
    const { value } = event.target;
    const { atk, def } = this.state;
    if (window.localStorage) {
      window.localStorage.setItem('Selected_Server', value);
    }
    this.props.actions.SetServer(value);
    const atkDiff = this.calcSet(atk, value);
    const defDiff = this.calcSet(def, value);
    const atkArr = sortUnitId(Array.from(atkDiff));
    const atkDetail: BattleDetail[] = atkArr.map(e => {
      return {
        equip: UnitObj[e] && UnitObj[e].equip,
        id: e,
        star: UnitObj[e].maxrarity, // initialize with max stars
      };
    });
    const defArr = sortUnitId(Array.from(defDiff));
    const defDetail: BattleDetail[] = defArr.map(e => {
      return {
        equip: UnitObj[e] && UnitObj[e].equip,
        id: e,
        star: UnitObj[e].maxrarity, // initialize with 5 stars
      };
    });
    this.setState({
      atk: atkDiff,
      atkDetail,
      def: defDiff,
      defDetail,
    });
  }

  private onSubmit = async() => {
    const { atkDetail, defDetail, comment, uploadType } = this.state;

    if (atkDetail.length !== 5 || defDetail.length !== 5) {
      return Modal.info({
        title: "请选满5个角色(つ´ω`)つ"
      });
    }

    console.log(atkDetail, defDetail, comment);
    this.setState({
      isBtnLoading: true,
    });
    try {
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);
      const body: BattleUploadRequest = {
        atk: atkDetail,
        comment,
        def: defDetail,
        nonce,
        private: uploadType,
        ts,
      };
      body._sign = calcHash(body);
      const r = await postServer("/upload", stringify(body));
      this.setState({isBtnLoading: false});
      console.log(r);
      if (r.code === 0) {
        this.clearAll();
        return Modal.success({
          title: "保存成功!",
          content: "ヽ(●´∀`●)ﾉ",
          onOk: () => Router.push("/battle"),
        });
      } else if (r.code === 1) {
        return LoginModal();
      }
      else if (r.code === 3) {
        return Modal.info({
          title: "已经有相同阵容了",
          content: "写点评论再提交一次吧(๑• . •๑)",
        });
      }
      else if (r.code === 4) {
        this.clearAll();
        return Modal.success({
          title: "保存成功!",
          content: "已有相同阵容，更新了时间和评论( • ̀ω•́ )",
          onOk: () => Router.push("/battle"),
        });
      }
      else {
        return Modal.error({
          title: `请求失败，请重试(ノ▼Д▼)ノ`,
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({isBtnLoading: false});
      return Modal.error({
        title: `请求失败，请重试(ノ▼Д▼)ノ`,
      });
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

  private clearAll = () => {
    this.setState({
      atk: new Set(),
      atkDetail: [],
      def: new Set(),
      defDetail: [],
      comment: "",
    });
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
  }

  private onPanelSwitch = (e: string[]) => {
    this.setState({
      activePanel: e,
    });
  }

  private setStar = (t: showModalType, idx: number, star: number) => {
    const { atkDetail, defDetail } = this.state;

    if (t === 'atk') {
      atkDetail[idx].star = star;
      if (star < UnitObj[atkDetail[idx].id].rarity) {
        atkDetail[idx].star = UnitObj[atkDetail[idx].id].rarity;
      }
      this.setState({
        atkDetail
      });
    }

    if (t === 'def') {
      defDetail[idx].star = star;
      if (star < UnitObj[defDetail[idx].id].rarity) {
        defDetail[idx].star = UnitObj[defDetail[idx].id].rarity;
      }
      this.setState({
        defDetail
      });
    }
  }

  private setEquip = (t: showModalType, idx: number, equip: boolean) => {
    const { atkDetail, defDetail } = this.state;
    if (t === 'atk') {
      atkDetail[idx].equip = equip;
      this.setState({
        atkDetail
      });
    }

    if (t === 'def') {
      defDetail[idx].equip = equip;
      this.setState({
        defDetail
      });
    }
  }

  private showSelectModal = (t: showModalType) => {
    const { atk, def, showModal } = this.state;
    if (t === null) {
      if (showModal === 'atk') {
        const atkArr = sortUnitId(Array.from(atk));
        const atkDetail: BattleDetail[] = atkArr.map(e => {
          return {
            equip: UnitObj[e] && UnitObj[e].equip,
            id: e,
            star: UnitObj[e].maxrarity, // initialize with max stars
          };
        });
        this.setState({
          showModal: t,
          atkDetail,
        });
      } else if (showModal === 'def') {
        const defArr = sortUnitId(Array.from(def));
        const defDetail: BattleDetail[] = defArr.map(e => {
          return {
            equip: UnitObj[e] && UnitObj[e].equip,
            id: e,
            star: UnitObj[e].maxrarity, // initialize with 5 stars
          };
        });
        this.setState({
          showModal: t,
          defDetail,
        });
      }
    } else {
      this.setState({
        showModal: t,
      });
    }
  }

  private hideDetailModal = () => {
    this.setState({
      showDetail: false,
    });
  }

  private showDetailModal = (isMobile: boolean, type: showModalType, idx: number) => {
    if (!isMobile) return;
    this.setState({
      showDetail: true,
      detailType: type,
      detailIdx: idx,
    });
  }

  private renderDetailModal() {
    const { 
      atkDetail,
      defDetail,
      showDetail,
      detailType,
      detailIdx,
    } = this.state;

    if (showDetail && detailType) {
      const target = detailType === "atk" ? atkDetail : defDetail;
      const v = target[detailIdx];
      const idx = detailIdx;
      let starMap = Array(5).fill(1);
      const is6x = UnitObj[v.id].maxrarity === 6;
      if (is6x) {
        starMap = Array(6).fill(1);
      }
      return (
        <div style={{width: '100%', minHeight: '200px'}}>
          <div style={{width: "100px", margin: "0px auto", marginTop: "15px"}}>
            <Character
              cid={v.id}
              selected={true}
              noBorder={true}
              width={100}
              show6x={is6x && v.star === 6}
            />
          </div>
          <div className="battle_star_select_ctn" style={{marginTop: '15px'}}>
            {starMap.map((_, i) => {
              const rotate = is6x && i === 5 ? 'hue-rotate(270deg)' : 'unset';
              return (
                <span className="star_ctn" key={i} onClick={() => this.setStar(detailType, idx, i + 1)}>
                  <img
                    src={`/static/icon/star${i < v.star ? "" : "_disabled"}.png`}
                    className="battle_star_img"
                    style={{filter: rotate, width: "20px"}}
                  />
                </span>
              );
            })}
          </div>
          {
            UnitObj[v.id.toString()] && UnitObj[v.id.toString()].equip
              ?
              <div className="battle_equip_select_ctn" style={{marginTop: "15px"}}>
                <span onClick={() => this.setEquip(detailType, idx, !v.equip)}>
                  <img
                    src={"/static/icon/equip.png"}
                    className={`battle_equip_img${v.equip ? "" : " battle_equip_img_disabled"}`}
                    style={{width: "25px"}}
                  />
                </span>
              </div>
              :
              null
          }
        </div>
      );
    }
  }

  private renderSelect(isDef: boolean, isMobile: boolean) {
    const { atkDetail, defDetail } = this.state;
    const selected: any[] = [];
    const empty: any[] = [];
    // atk
    if (!isDef) {
      atkDetail.forEach((v, idx) => {
        let starMap = Array(5).fill(1);
        const is6x = UnitObj[v.id].maxrarity === 6;
        if (is6x) {
          starMap = Array(6).fill(1);
        }
        selected.push(
          <div key={v.id}>
            <Character
              cid={v.id}
              selected={true}
              noBorder={true}
              width={isMobile ? 40 : 60}
              show6x={is6x && v.star === 6}
              onSelect={() => this.showDetailModal(isMobile, "atk", idx)}
            />
            <div className="battle_star_select_ctn">
              {starMap.map((_, i) => {
                const rotate = is6x && i === 5 ? 'hue-rotate(270deg)' : 'unset';
                return (
                  <span className="star_ctn" key={i} onClick={() => this.setStar('atk', idx, i + 1)}>
                    <img
                      src={`/static/icon/star${i < v.star ? "" : "_disabled"}.png`}
                      className="battle_star_img"
                      style={{filter: rotate}}
                    />
                  </span>
                );
              })}
            </div>
            {
              UnitObj[v.id.toString()] && UnitObj[v.id.toString()].equip
                ?
                <div className="battle_equip_select_ctn">
                  <span onClick={() => this.setEquip('atk', idx, !v.equip)}>
                    <img
                      src={"/static/icon/equip.png"}
                      className={`battle_equip_img${v.equip ? "" : " battle_equip_img_disabled"}`}
                    />
                  </span>
                </div>
                :
                null
            }
          </div>
        );
      });
      for (let i = 0; i < 5 - atkDetail.length; ++i) {
        empty.push(
          <div className="battle_search_empty" key={i} />
        );
      }
    }

    // def
    else {
      defDetail.forEach((v, idx) => {
        let starMap = Array(5).fill(1);
        const is6x = UnitObj[v.id].maxrarity === 6;
        if (is6x) {
          starMap = Array(6).fill(1);
        }
        selected.push(
          <div key={v.id}>
            <Character
              cid={v.id}
              selected={true}
              noBorder={true}
              width={isMobile ? 40 : 60}
              show6x={is6x && v.star === 6}
              onSelect={() => this.showDetailModal(isMobile, "def", idx)}
            />
            <div className="battle_star_select_ctn">
              {starMap.map((_, i) => {
                const rotate = is6x && i === 5 ? 'hue-rotate(270deg)' : 'unset';
                return (
                  <span className="star_ctn" key={i} onClick={() => this.setStar('def', idx, i + 1)}>
                    <img
                      src={`/static/icon/star${i < v.star ? "" : "_disabled"}.png`}
                      className="battle_star_img"
                      style={{filter: rotate}}
                    />
                  </span>
                );
              })}
            </div>
            {
              UnitObj[v.id.toString()] && UnitObj[v.id.toString()].equip
                ?
                <div className="battle_equip_select_ctn">
                  <span onClick={() => this.setEquip('def', idx, !v.equip)}>
                    <img
                      src={"/static/icon/equip.png"}
                      className={`battle_equip_img${v.equip ? "" : " battle_equip_img_disabled"}`}
                    />
                  </span>
                </div>
                :
                null
            }
          </div>
        );
      });
      for (let i = 0; i < 5 - defDetail.length; ++i) {
        empty.push(
          <div className="battle_search_empty" key={i} />
        );
      }
    }

    return (
      <div>
        <div>
          <Button
            type="primary"
            style={{width: '15rem'}}
            onClick={() => this.showSelectModal(isDef ? 'def' : 'atk')}
          >
            {`选择${isDef ? '防守' : '进攻'}阵容`}
          </Button>
        </div>
        <div className="battle_search_select">
          <div
            style={{
              backgroundImage: `url('/static/icon/${isDef ? 'lose' : 'win'}.png')`,
              height: isMobile ? '20px' : '60px',
              width: isMobile ? '30px' : '70px',
              marginTop: isMobile ? '10px' : '0',
            }}
            className="battle_search_single_logo"
          />
          {selected}
          {empty}
        </div>
      </div>
    );
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
)(Upload);