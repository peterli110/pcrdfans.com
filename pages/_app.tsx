import '@common/less/global.less';
import '@common/less/index.less';
import AdSense from '@components/adsense';
import HeaderComponent from '@components/header/Header';
import {
  adsenseClient,
  adsenseSlot1,
  adsenseSlot2,
  googleAnalytics,
  isDev,
  siteDescription,
  siteName,
} from '@config/index';
import * as actions from '@store/actions/actions';
import { AppState, initStore } from '@store/store';
import '@type/index';
import moment from 'moment-timezone';
import withRedux from 'next-redux-wrapper';
import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import React from 'react';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { Store } from 'redux';

moment.tz.setDefault('Asia/Shanghai');
const pages = ['/login', '/signup'];

interface PageState {
  showAd: boolean;
}

class MyApp extends App<{ store: Store<AppState> }, PageState> {
  public static async getInitialProps({ Component, ctx }: NextAppContext) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }
  constructor(props: any) {
    super(props);
    this.state = {
      showAd: true,
    };
  }

  public componentDidMount() {
    ReactGA.initialize(googleAnalytics);
    ReactGA.pageview(window.location.pathname + window.location.search);
    Router.onRouteChangeStart = () => {
      this.setState(
        {
          showAd: false,
        },
        () => {
          this.setState({
            showAd: true,
          });
        }
      );
    };
    Router.onRouteChangeComplete = () => {
      ReactGA.pageview(window.location.pathname + window.location.search);
      this.setState({
        showAd: true,
      });
    };

    this.props.store.dispatch<any>(actions.IsLogin());
    this.props.store.dispatch<any>(actions.UnitsDiff());
    if (window.localStorage) {
      const r = window.localStorage.getItem('Selected_Server');
      if (r) {
        this.props.store.dispatch<any>(actions.SetServer(parseInt(r, 10)));
      }
    }
  }

  public render() {
    const {
      Component,
      pageProps,
      store,
      router: { pathname },
    } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
            <meta name="renderer" content="webkit" />
            <meta
              httpEquiv="description"
              content="公主连结Re: Dive Fan Club 公主连接 公主链接"
            />
            <meta name="description" content={siteDescription} />
            <meta
              name="keywords"
              content="princess connect,re-dive,pcrd,cygames,公主连结,公主连接,公主链接"
            />
            <meta name="author" content="Xinkai Li" />
            <meta name="copyright" content="pcrdfans.com" />
            <meta name="revisit-after" content="7 days" />
            <meta httpEquiv="Cache-Control" content="no-siteapp" />
            <link
              rel="shortcut icon"
              type="image/x-icon"
              href="/static/favicon.ico"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/static/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/static/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/static/favicon-16x16.png"
            />
            <link rel="manifest" href="/static/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/static/safari-pinned-tab.svg"
              color="#5bbad5"
            />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />
            <title>{siteName}</title>
          </Head>
          {!pages.includes(pathname) ? (
            <div>
              <HeaderComponent />
              <div className="_push" />
            </div>
          ) : (
            ''
          )}
          <div className="body_container">
            {this.state.showAd && !isDev && !pages.includes(pathname) ? (
              <div className="adsense_wrapper">
                <AdSense
                  client={adsenseClient}
                  slot={adsenseSlot1}
                  className="adsbygoogle adsense_responsive"
                  style={{
                    display: 'inline-block',
                    height: '100px',
                    maxHeight: '100px',
                    width: '100%',
                    maxWidth: '800px',
                  }}
                />
              </div>
            ) : null}
            <Component {...pageProps} />
            {this.state.showAd && !isDev && !pages.includes(pathname) ? (
              <div className="adsense_wrapper">
                <AdSense
                  client={adsenseClient}
                  slot={adsenseSlot2}
                  className="adsbygoogle adsense_responsive"
                  style={{
                    display: 'inline-block',
                    height: '300px',
                    maxHeight: '300px',
                    width: '100%',
                    maxWidth: '800px',
                  }}
                />
              </div>
            ) : null}
          </div>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(withRouter(MyApp as any));
