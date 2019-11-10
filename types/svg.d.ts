declare module "*.svg" {
  const content: {
    content: string,
    id: string,
    viewBox: string
  };
  export default content;
}

declare module 'react-adsense';

declare interface Window {
  adsbygoogle: any[];
}

declare var adsbygoogle: any[];