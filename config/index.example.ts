export const isDev: boolean = false;
export const profileMaxIndex = 174;
export const comicMaxIndex = 63;

export const SERVERADDRESS = isDev
  ? 'http://localhost:8000/x/v1'
  : 'https://api.pcrdfans.com/x/v1';
export const siteName =
  '公主连结Re: Dive Fan Club - 硬核的竞技场数据分析站 公主连接 公主链接 JJC';
export const siteDescription =
  '公主连结Re: Dive Fan Club是一个硬核的竞技场数据分析站，提供一些查询和分析功能。公主连接JJC 公主链接';

export const specialChara = new RegExp(
  "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_ ]"
);
export const calcHash = (b: any) => {
  return b + "";
};

export const adsenseClient = '';
export const adsenseSlot1 = '';
export const adsenseSlot2 = '';
export const googleAnalytics = '';

export const routerName = {
  autoparty: '自动配队2.2',
  battle: '竞技场查询',
  hot: '登场率排名',
  login: '登录',
  manualparty: '查询防守队',
  settings: '设置中心',
  signup: '注册',
  tools_status: '角色属性计算器',
  tools_timeline: '时间轴计算器(测试版)',
  units: '角色登场率',
  data_combinations: '竞技场组合排名',
  atkrange: '攻击范围计算器',
  myupload: '我的作业',
};

export const pubKey = "";
