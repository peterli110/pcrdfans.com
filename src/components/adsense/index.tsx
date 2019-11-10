import { Component, CSSProperties } from 'react';

interface AdsenseProps {
  className?: string;
  client: string;
  slot: string;
  style?: CSSProperties;
}


export default class Adsense extends Component<AdsenseProps, any> {
  public componentDidMount() {
    if(window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }


  public render() {
    return (
      <ins
        className={this.props.className}
        style={this.props.style}
        data-ad-client={this.props.client}
        data-ad-slot={this.props.slot}
      />
    );
  }

}