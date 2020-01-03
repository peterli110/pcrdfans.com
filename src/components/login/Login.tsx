import { calcHash, pubKey, specialChara } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { OAuthData, OAuthRequest } from '@type/oauth';
import { generateNonce } from '@utils/functions';
import { ErrorModal, TooManyModal } from '@utils/modals';
import { Button, Form, Icon, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import stringify from 'json-stable-stringify';
import moment from 'moment-timezone';
import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
// import Fingerprint2 from 'fingerprintjs2';



const FormItem = Form.Item;
interface LoginProps extends AppState {
  loginType: 'login' | 'signup',
  redirect: string,
  actions: actions.Actions,
}

interface LoginState {
  isBtnLoading: boolean,
}

class LoginComponent extends Component<LoginProps & FormComponentProps, LoginState> {
  public fingerprint: string;
  public fingerprintTimer: number;
  constructor(props: LoginProps & FormComponentProps) {
    super(props);
    this.state = {
      isBtnLoading: false,
    };
    this.fingerprint = "";
    this.fingerprintTimer = 0;
  }

  public componentDidMount() {
    /*
    const options = {
      excludes: { plugins: true, adBlock: true }
    };
    */

    if (this.props.user.isLogin && this.props.user.userInfo) {
      Router.replace("/");
    }
    /*
    if (window.requestIdleCallback) {
      window.requestIdleCallback(async () => {
        const components = await Fingerprint2.getPromise(options);
        const values = components.map((e) => e.value);
        this.fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
      });
    } else {
      this.fingerprintTimer = window.setTimeout(async() => {
        const components = await Fingerprint2.getPromise(options);
        const values = components.map((e) => e.value);
        this.fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
      }, 500);
    }
    */
  }

  public componentWillUnmount() {
    if (this.fingerprintTimer) {
      window.clearTimeout(this.fingerprintTimer);
    }
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const { loginType } = this.props;

    return (
      <div className="global_login_ctn">
        <div style={{margin: 'auto'}}>
          <div className="global_login_title">
            {loginType === 'login' ? "欢迎回来" : "新用户注册"}
          </div>
          <Form onSubmit={this.handleSubmit} className="global_login_box">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{
                  validator: this.checkUserName,
                }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder={"用户名(区分大小写)"} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{
                  validator: this.checkPassowrd,
                }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={"密码"} />
              )}
            </FormItem>
            {
              loginType === 'signup'
                ?
                <div>
                  <FormItem>
                    {getFieldDecorator('confirm', {
                      rules: [{
                        validator: this.confirmPassowrd,
                      }],
                    })(
                      <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={"确认密码"} />
                    )}
                  </FormItem>
                  <FormItem label="昵称（可选，将会在评论中显示）">
                    {getFieldDecorator('nickname', {
                      rules: [{
                        max:10,
                        message: "昵称太长了~",
                      }],
                    })(
                      <Input prefix={<Icon type="smile" style={{ fontSize: 13 }} />} placeholder={"昵称"} />
                    )}
                  </FormItem>
                </div>
                :
                null
            }
            <Button
              type="primary"
              htmlType="submit"
              className="global_login_button"
              loading={this.state.isBtnLoading}
            >
              {loginType === 'login' ? "登录" : "注册"}
            </Button>
            {
              loginType === 'login' ?
              <div className="global_login_md_row">
                <div>
                  {"没有账号？"} <Link href="/signup"><a>{"去注册"}</a></Link>
                </div>
              </div>
              :
              <div className="global_login_md_row">
                <div>
                  {"已经有账号了？"} <Link href="/login"><a>{"去登录"}</a></Link>
                </div>
              </div>
            }
          </Form>
        </div>
      </div>
    );
  }

  private handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const { loginType } = this.props;
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

    const { userName, password } = values;
    if (!userName || !password) {
      return;
    }

    /*
    if (!this.fingerprint) {
      return Modal.error({
        title: `验证信息加载中，请稍后再试`,
      });
    }
    */

    if (loginType === 'signup') {
      console.log('regex test');
      if (specialChara.test(userName)) {
        console.log('regex test failed');
        return Modal.error({
          title: `用户名不能包含特殊字符和空格_(:з」∠)_`,
        });
      }
    }

    // start process
    this.setState({
      isBtnLoading: true
    });

    const { JSEncrypt } = require('jsencrypt');
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubKey);

    try {
      const enc: OAuthData = {
        kyoka: userName,
        kokoro: password,
        m: loginType,
        fp: "pcrdfans.com", 
      };

      if (loginType === 'signup') {
        enc.n = values.nickname;
      }

      const nonce = generateNonce();
      const ts = parseInt(moment().format('X'), 10);
      const encryptd = encrypt.encrypt(stringify(enc));

      const body: OAuthRequest = {
        data: encryptd,
        nonce,
        ts,
      };

      body._sign = calcHash(body);
      const result = await this.props.actions.HandleOAuth(stringify(body));
      this.setState({
        isBtnLoading: false,
      });
      console.log(result);
      if (result.code === 0) {
        return Router.replace("/");
      }
      if (result.code === 107) {
        return Modal.info({
          title: `好像没有这个账号呢_(:3 」∠ )_`,
        });
      }
      if (result.code === 106) {
        return Modal.info({
          title: `用户已存在，换个用户名吧_(:3 」∠ )_`,
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
        isBtnLoading: false,
      });
      return ErrorModal();
    }
  }

  private checkUserName = (_: any, value: string, callback: (s?: string) => void) => {
    if (!value) {
      return callback("请输入用户名(ﾉ>ω<)ﾉ");
    }
    else if (value && value.length < 6) {
      return callback("用户名太短了(･ω´･ )");
    }
    else if (value && value.length > 64) {
      return callback("用户名太长了(･ω´･ )");
    }
    callback();
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
  mapDispatchToProps
)(Form.create<LoginProps & FormComponentProps>()(LoginComponent));