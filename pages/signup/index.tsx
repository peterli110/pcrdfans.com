import ItemBox from '@components/itembox/ItemBox';
import LoginComponent from '@components/login/Login';
import { routerName, siteDescription, siteName } from '@config/index';
import Head from 'next/head';
import Link from 'next/link';
import { Component } from 'react';




class Login extends Component<any, any> {
  public render() {
    return (
      <div>
        <div style={{ margin: "15vh auto" }}>
          <Head>
            <title>{`${routerName.signup} - ${siteName}`}</title>
            <meta name="description" content={`注册 - ${siteDescription}`} />
          </Head>
          <ItemBox className="page_login_item_box">
            <Link href="/">
              <div className="page_login_ctn">
                <a>
                  <img
                    src="/static/apple-touch-icon.png"
                    className="logo"
                    alt="logo"
                  />
                  <span className="title">
                    {`公主连结Re: Dive Fan Club`}
                  </span>
                </a>
              </div>
            </Link>
            <LoginComponent
              loginType="signup"
              redirect={"/"}
            />
          </ItemBox>
        </div>

      </div>
    );
  }
}

export default Login;