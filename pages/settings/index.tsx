import Character from '@components/character/Character';
import ItemBox from '@components/itembox/ItemBox';
import Collapse from '@components/react-collapse';
import UnitsA from '@config/constants/unita.json';
import { calcHash, pubKey, routerName, siteName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { UserInfo } from '@store/user/userReducers';
import { UpdateUserReq } from '@type/oauth';
import { UnitData } from '@type/unit';
import { ChangePWData, ChangePWRequest } from '@type/user';
import { generateNonce, reverseCompare } from '@utils/functions';
import { ErrorModal, LoginModal, SaveSuccessModal, TooManyModal } from '@utils/modals';
import { postServer } from '@utils/request';
import { Button, Form, Icon, Input, Modal, Spin, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Head from 'next/head';
import Router from 'next/router';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';


const UnitsArr: UnitData[] = UnitsA;
const InputGroup = Input.Group;
const FormItem = Form.Item;


interface SettingsProps extends AppState {
  actions: actions.Actions
}

interface SettingsState {
  isMounted: boolean,
  selected: number,
  unitVisible: boolean,
  enable2x: boolean,
  isBtnLoading: boolean,
  nickname: string,
  userInfo: UserInfo | null,
  area: string,
  phone: string,
  answer: string,
  isPWBtnLoading: boolean,
  isAnsBtnLoading: boolean,
}

class Settings extends Component<SettingsProps & FormComponentProps, SettingsState> {
  constructor(props: SettingsProps & FormComponentProps) {
    super(props);
    this.state = {
      isMounted: false,
      selected: 100101,
      unitVisible: false,
      enable2x: false,
      isBtnLoading: false,
      nickname: "",
      userInfo: null,
      area: "",
      phone: "",
      answer: "",
      isPWBtnLoading: false,
      isAnsBtnLoading: false,
    };
  }

  public async componentDidMount() {
    try {
      const r = await this.props.actions.IsLogin();
      if (r.code === 0) {
        // login
        this.setState({
          isMounted: true,
          selected: r.data.avatar,
          enable2x: r.data.enable2x,
          nickname: r.data.nickname,
          userInfo: r.data,
          area: r.data.area || "86",
          phone: r.data.phone || "",
        });
      } else {
        // not login
        Router.replace("/login");
      }
    } catch (err) {
      console.log(err);
      return Modal.error({
        title: '(╥﹏╥)好像哪里出错了，再试一次吧',
      });
    }
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    if (!this.state.isMounted) {
      const spinIcon = <Icon type="loading" style={{ fontSize: 60 }} spin={true} />;
      return (
        <div className="global_isloading_center">
          <ItemBox style={{minHeight: '50vh', minWidth: '70vw'}}>
            <Spin indicator={spinIcon} />
          </ItemBox>
        </div>
      );
    }

    const { 
      selected, 
      unitVisible, 
      enable2x, 
      nickname, 
      userInfo,
      area,
      phone,
      answer,
    } = this.state;
    const Charas = UnitsArr.sort(reverseCompare).map((e, i) => {
      return (
        <Character
          cid={e.id}
          key={i}
          width={40}
          selected={e.id === selected}
          onSelect={() => this.onUnitChange(e.id)}
        />
      );
    });

    return (
      <div className="body_div_ctn">
        <Head>
          <title>{`${routerName.settings} - ${siteName}`}</title>
        </Head>
        <ItemBox style={{padding: '6px 30px', marginBottom: '30px'}}>
          <div className="body_title">
            {routerName.settings}
          </div>
        </ItemBox>
        <ItemBox>
          <div>
            <div className="body_title">
              {"基本设置"}
            </div>
            <div className="battle_title_ctn" style={{padding: '0 5px', marginTop: '20px'}}>
              <div className="body_subtitle">
                {"更改昵称（将会在评论中显示）"}
              </div>
              <div>
                <Input
                  placeholder="昵称"
                  value={nickname}
                  onChange={this.onInputChange}
                />
              </div>
            </div>
            <div className="battle_title_ctn" style={{ padding: '0 5px', marginTop: '20px'}}>
              <div className="body_subtitle">
                {"更改头像"}
              </div>
              <div>
                <Button
                  size="small"
                  type="primary"
                  style={{margin: '5px 0', fontSize: '0.9rem'}}
                  onClick={this.toggleUnitVisible}
                  icon={unitVisible ? "up" : "down"}
                >
                  {unitVisible ? "收起" : "显示"}
                </Button>
              </div>
            </div>
            <Collapse isOpen={unitVisible}>
              <div>
                {Charas}
              </div>
            </Collapse>
            <div className="battle_title_ctn" style={{padding: '0 5px', lineHeight: '1.25rem', marginTop: '20px'}}>
              <div className="body_subtitle" style={{lineHeight: '1.25rem'}}>
                {"3星以下模式"}
              </div>
              <div style={{padding: '5px 0'}}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  defaultChecked={true}
                  onChange={this.toggle2x}
                  checked={enable2x}
                />
              </div>
            </div>
            {
              userInfo && userInfo.role >= 10
                ?
                <div className="battle_title_ctn" style={{padding: '0 5px', marginTop: '20px'}}>
                  <div className="body_subtitle">
                    {"手机号"}
                  </div>
                  <div>
                    <InputGroup compact={true}>
                      <Input
                        style={{ width: '30%' }}
                        placeholder={"国家区号"}
                        prefix="+"
                        value={area}
                        onChange={(s) => this.onPhoneChange(true, s.target.value)}
                      />
                      <Input
                        style={{ width: '70%' }}
                        placeholder={"手机号"}
                        value={phone}
                        onChange={(s) => this.onPhoneChange(false, s.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
                :
                null
            }
            <div style={{marginTop: '20px'}}>
              <Button type="primary" onClick={this.onSubmit} loading={this.state.isBtnLoading}>
                {"保存设置"}
              </Button>
            </div>
          </div>
        </ItemBox>
        <ItemBox style={{marginTop: '30px'}}>
          <div>
            <div className="body_title">
              {"提示区域受限了？"}
            </div>
            <div className="body_subtitle">
              {"回答一个问题即可解锁：对不起，______（两个字，简繁都行）"}
            </div>
            <div>
              <Input
                placeholder=""
                value={answer}
                onChange={this.onAnswerChange}
                style={{width: '200px', margin: '10px 0'}}
              />
            </div>
            <Button
              type="primary"
              onClick={this.onAnswerSubmit}
              loading={this.state.isAnsBtnLoading}
            >
              提交
            </Button>
          </div>
        </ItemBox>
        <ItemBox style={{marginTop: '30px'}}>
          <div>
            <div className="body_title">
              {"修改密码"}
            </div>
            <div style={{maxWidth: '300px'}}>
              <Form onSubmit={this.handleChangePW}>
                <FormItem>
                  {getFieldDecorator('original', {
                    rules: [{
                      validator: this.checkPassowrd,
                    }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={"原密码"} />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{
                      validator: this.checkPassowrd,
                    }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={"新密码"} />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('confirm', {
                    rules: [{
                      validator: this.confirmPassowrd,
                    }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={"确认密码"} />
                  )}
                </FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="global_login_button"
                  loading={this.state.isPWBtnLoading}
                >
                  {"修改密码"}
                </Button>
              </Form>
            </div>
          </div>
        </ItemBox>
      </div>
    );
  }

  private onPhoneChange = (isArea: boolean, t: string) => {
    if (!/^\d+$/.test(t) && t !== "") {
      return;
    }

    if (isArea && t.length > 4) {
      return;
    }

    if (!isArea && t.length > 12) {
      return;
    }

    if (isArea) {
      this.setState({
        area: t,
      });
    } else {
      this.setState({
        phone: t,
      });
    }
  }

  private checkPassowrd = (_: any, value: string, callback: (s?: string) => void) => {
    if (!value) {
      return callback("请输入密码(ﾉ>ω<)ﾉ");
    }
    else if (value && value.length < 6) {
      return callback("密码至少6位哦╮(╯_╰)╭");
    }
    else if (value && value.length > 64) {
      return callback("密码太长了(･ω´･ )");
    }
    callback();
  }

  private confirmPassowrd = (_: any, value: string, callback: (s?: string) => void) => {
    const { form } = this.props;
    if (!value) {
      callback("请确认密码(ﾉ>ω<)ﾉ");
    }
    else if (value && value !== form.getFieldValue('password')) {
      callback("两次输入的密码不一样呢(ﾉ>ω<)ﾉ");
    } else {
      callback();
    }
  }


  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 10) {
      return;
    }
    this.setState({
      nickname: e.target.value,
    });
  }

  private onAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      answer: e.target.value,
    });
  }

  private onUnitChange = (e: number) => {
    this.setState({
      selected: e,
    });
  }

  private toggleUnitVisible = () => {
    this.setState({
      unitVisible: !this.state.unitVisible,
    });
  }

  private toggle2x = (e: boolean) => {
    this.setState({
      enable2x: e,
    });
  }

  private onAnswerSubmit = async() => {
    const { answer } = this.state;
    if (!["优衣", "優衣"].includes(answer)) {
      return Modal.info({
        title:"再想想答案吧",
        content: "其他主角分别是狼，侦探，狗，剑圣...（不断增加中",
      });
    }
    this.setState({
      isAnsBtnLoading: true,
    });

    try {
      const r = await postServer("/user/region");
      this.setState({
        isAnsBtnLoading: false,
      });
      if (r.code === 0) {
        return Modal.success({
          title: "已经解除限制了（"
        });
      }
      else if (r.code === 1) {
        return LoginModal();
      }
      else if (r.code === -429) {
        return TooManyModal();
      }
      else {
        return ErrorModal();
      }
    } catch (err) {
      this.setState({
        isAnsBtnLoading: false,
      });
      return ErrorModal();
    }
  }

  private onSubmit = async() => {
    const { isLogin, userInfo } = this.props.user;
    if (!(isLogin && userInfo)) {
      return LoginModal();
    }

    const { selected, enable2x, nickname, area, phone } = this.state;
    this.setState({
      isBtnLoading: true,
    });

    try {
      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);

      const body: UpdateUserReq = {
        area,
        avatar: selected,
        enable2x,
        nickname,
        nonce,
        phone,
        ts,
      };
      body._sign = calcHash(body);
      console.log(body);
      const r = await postServer("/user", stringify(body));
      console.log(r);
      this.setState({
        isBtnLoading: false,
      });
      if (r.code === 0) {
        SaveSuccessModal();
        await this.props.actions.IsLogin();
      }
      else if (r.code === 1) {
        return LoginModal();
      }
      else if (r.code === -429) {
        return TooManyModal();
      }
      else {
        return ErrorModal();
      }

    } catch(err) {
      console.log(err);
      this.setState({
        isBtnLoading: false,
      });
      return ErrorModal();
    }
  }

  private handleChangePW = async(e: React.FormEvent) => {
    e.preventDefault();
    let values: any;
    try {
      values = await this.props.form.validateFields();
      console.log(values);
    } catch(err) {
      console.log('err is', err);
      return;
    }

    if (!values) {
      return;
    }

    const { original, password } = values;
    if (!original || !password) {
      return;
    }

    this.setState({
      isPWBtnLoading: true,
    });

    const { JSEncrypt } = require('jsencrypt');
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubKey);

    try {
      const enc: ChangePWData = {
        kyaru: original,
        kaori: password,
      };

      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);
      const encrypted = encrypt.encrypt(stringify(enc));

      const body: ChangePWRequest = {
        data: encrypted,
        nonce,
        ts,
      };
      body._sign = calcHash(body);
      const result = await postServer("/changepw", stringify(body));
      this.setState({
        isPWBtnLoading: false,
      });
      if (result.code === 0) {
        this.props.form.resetFields();
        return Modal.success({
          title: "密码修改成功",
        });
      }
      if (result.code === 108) {
        return Modal.info({
          title: `密码好像不太对呢(:3 」∠ )_`,
        });
      }
      if (result.code === -429) {
        return TooManyModal();
      }
      return ErrorModal();

    } catch(err) {
      console.log(err);
      this.setState({
        isPWBtnLoading: false,
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
)(Form.create<SettingsProps & FormComponentProps>()(Settings));