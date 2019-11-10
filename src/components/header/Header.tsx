import Character from '@components/character/Character';
import { routerName } from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState } from '@store/store';
import { Drawer, Menu, Modal } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery, { MediaQueryMatchers } from 'react-responsive';
import { MorphIcon } from 'react-svg-buttons';
import { bindActionCreators, Dispatch } from 'redux';

declare type MenuMode = 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | 'inline';
interface HeaderState {
  isMount: boolean,
  menuOpened: boolean,
  selectedKeys: string[],
}

interface HeaderProps extends AppState {
  actions: actions.Actions
}

const mobileWidth = 900;

class HeaderComponent extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      isMount: false,
      menuOpened: false,
      selectedKeys: [],
    };
  }

  public componentDidMount() {
    this.setState({
      isMount: true,
    });
  }

  public onMobileMenuChange = () => {
    this.setState({
      menuOpened: !this.state.menuOpened
    });
  }


  public render() {
    const { isMount } = this.state;
    const responsive: Partial<MediaQueryMatchers> = { deviceWidth: 320 };
    return (
      <div className="header_component_style">
        <div className="header_ctn">
          <Link href="/">
            <a className="header_ctn_title">
              <img src={"/static/apple-touch-icon.png"} className="header_ctn_logo" />
              {"公主连结Re: Dive Fan Club"}
            </a>
          </Link>
          <MediaQuery 
            minWidth={mobileWidth} 
            values={isMount ? undefined : responsive}
          >
          {(matches) => {
            if (matches) {
              return this.renderMenu("horizontal");
            } else {
              return this.renderMobileMenu();
            }
          }}
          </MediaQuery>
        </div>
      </div>
    );
  }

  private logOut = async() => {
    try {
      const r = await this.props.actions.LogOut();
      if (r.code !== 0) {
        Modal.error({ title: "网络错误，再试一次吧_(:з」∠)_" });
      }
    } catch(e) {
      console.log(e);
      Modal.error({title: "网络错误，再试一次吧_(:з」∠)_"});
    }
  }

  private onMenuClick = (e: ClickParam) => {
    this.setState({
      menuOpened: false,
      selectedKeys: e.keyPath,
    });
    console.log(e);
    switch(e.key) {
      case "0":
        return Router.push("/");
      case "1":
        return Router.push("/battle");
      case "3":
        return Router.push("/login");
      case "settings":
        return Router.push("/settings");
      case "logout":
        return this.logOut();
      case "hot":
        return Router.push("/hot");
      case "units":
        return Router.push("/units");
      case "autoparty":
        return Router.push("/autoparty");
      case "manualparty":
        return Router.push("/autoparty/search");
      case "tools_status":
        return Router.push("/tools/status");
      case "tools_timeline":
        return Router.push("/tools/timeline");
      case "tools_atkrange":
        return Router.push("/tools/atkrange");
      case "combinations":
        return Router.push("/data/combinations");
      case "permission":
        return Router.push("/d/hikari/users");
      case "myupload":
        return Router.push("/myupload");
      default:
        return Modal.info({
          title: "开发中..."
        });
    }
  }

  private renderMenu(mode: MenuMode) {
    const { isLogin, userInfo } = this.props.user;
    let subMenu;
    if (isLogin && userInfo) {
      subMenu =
      <Menu.SubMenu
        title={<Character 
            cid={userInfo.avatar} 
            width={mode === 'inline' ? 38 : 60} 
            noBorder={true} 
            selected={true} 
            style={{borderRadius: '30px', display: 'block', marginBottom: '3px'}}
          />}
        key="4"
      >
        <Menu.ItemGroup
          title={userInfo.username}
        >
          <Menu.Item key="settings">
            {routerName.settings}
          </Menu.Item>
          <Menu.Item key="myupload">
            {routerName.myupload}
          </Menu.Item>
          {
            userInfo.role === 12
              ?
              <Menu.Item key="permission">
                权限管理
              </Menu.Item>
              :
              null
          }
          <Menu.Item key="logout">
            退出登录
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu.SubMenu>;
    } else {
      subMenu = <Menu.Item key="3">{routerName.login}</Menu.Item>;
    }
    return (
      <div id="header_menu_ctn" className="header_menu_ctn">
        <Menu
          mode={mode}
          style={{ lineHeight: '68px', width: (mode === 'inline' ? 180 : 'inherit') }}
          onClick={this.onMenuClick}
          selectedKeys={this.state.selectedKeys}
        >
          {
            mode === 'inline'
              ?
              <Menu.Item key="0">主页</Menu.Item>
              :
              null
          }
          <Menu.Item key="1">{routerName.battle}</Menu.Item>
          <Menu.SubMenu key="sub1" title="PVP">
            <Menu.ItemGroup title="登场率数据">
              <Menu.Item key="hot">
                {routerName.hot}
              </Menu.Item>
              <Menu.Item key="units">
                {routerName.units}
              </Menu.Item>
              <Menu.Item key="combinations">
                {routerName.data_combinations}
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="队伍相关">
              <Menu.Item key="autoparty">
                {routerName.autoparty}
              </Menu.Item>
              {
                isLogin && userInfo
                  ?
                  <Menu.Item key="manualparty">
                    {routerName.manualparty}
                  </Menu.Item>
                  :
                  null
              }
            </Menu.ItemGroup>
            <Menu.ItemGroup title="计算器">
              <Menu.Item key="tools_atkrange">
                {routerName.atkrange}
              </Menu.Item>
            </Menu.ItemGroup>            
          </Menu.SubMenu>

          <Menu.SubMenu key="sub2" title="工会战">
            <Menu.ItemGroup title="计算器">
              <Menu.Item key="tools_status">
                {routerName.tools_status}
              </Menu.Item>
              <Menu.Item key="tools_timeline">
                {routerName.tools_timeline}
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
          {subMenu}
        </Menu>
      </div>
    );
  }

  private renderMobileMenu() {
    const { menuOpened } = this.state;
    return (
      <div style={{marginTop: '13px'}}>
        <MorphIcon
          type={menuOpened ? 'cross' : 'bars'}
          size={40}
          onClick={this.onMobileMenuChange}
        />
        <Drawer
          title="菜单"
          placement={"left"}
          onClose={this.onMobileMenuChange}
          visible={menuOpened}
          width={200}
        >
          <div id="header_menu">
            {this.renderMenu('inline')}
          </div>
        </Drawer>
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
)(HeaderComponent);