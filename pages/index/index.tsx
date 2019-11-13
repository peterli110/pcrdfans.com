import ItemBox from '@components/itembox/ItemBox';
import LogoButton from '@components/logobutton/LogoButton';
import MessageBox from '@components/messagebox/MessageBox';
import { routerName } from '@config/index';
import { randomInt } from '@utils/functions';
import { Button, Col, Row } from 'antd';
import { Component } from 'react';


interface PageProps  {
  changeIcon: boolean
}

class Home extends Component<PageProps, any> {
  public static async getInitialProps() {
    const rand = randomInt(1, 5);
    return {
      changeIcon: rand === 5
    };
  }

  public render() {
    const twitterBtn =
    <Button 
      type="primary" 
      icon="twitter" 
      style={{ backgroundColor: '#1b95e0', borderColor: '#1b95e0' }} 
      size="small"
      onClick={this.onGoTwitter}
    >
      ヒカリ@プリコネ
    </Button>;
    return (
      <div className="body_div_ctn">
        <ItemBox>
          <div className="home_notification_ctn">
            <div className="body_title">
              公告
            </div>
            <MessageBox
              title={"公主连结Re: Dive Fan Club开始测试了~"}
              date={"2019/05/18 02:00"}
              type={"info"}
            />
            <MessageBox
              title={"(ﾉ>ω<)ﾉ这是一个硬核的竞技场数据分析站，更多功能持续开发中"}
              date={"2019/05/18 02:00"}
              type={"info"}
            />
            <MessageBox
              title={"Bug和问题反馈: "}
              date={"2019/9/25 16:40"}
              type={"info"}
              extra={twitterBtn}
            />
          </div>
        </ItemBox>
        <ItemBox style={{marginTop: '40px'}}>
          <div className="body_title">
            功能列表
          </div>
          <Row gutter={16} style={{marginTop: '30px'}}>
            <Col xs={12} sm={8} md={6}>
              <LogoButton 
                title={routerName.battle}
                logo={"battle"}
                href={"/battle"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton 
                title={routerName.login}
                logo={"login"}
                href={"/login"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton 
                title={routerName.signup}
                logo={"signup"}
                href={"/signup"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={routerName.hot}
                logo={"data"}
                href={"/hot"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={routerName.units}
                logo={"units"}
                href={"/units"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={routerName.data_combinations}
                logo={"emt"}
                href={"/data/combinations"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={routerName.autoparty}
                logo={"party"}
                href={"/autoparty"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={routerName.tools_status}
                logo={"ramu"}
                href={"/tools/status"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={routerName.tools_timeline}
                logo={"remu"}
                href={"/tools/timeline"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={routerName.atkrange}
                logo={"skill"}
                href={"/tools/atkrange"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <LogoButton
                title={"持续更新中"}
                logo={"unknown"}
                kyaru={this.props.changeIcon}
              />
            </Col>
            
          </Row>
        </ItemBox>
        <ItemBox style={{marginTop: '40px'}}>
          <div className="home_notification_ctn">
            <div className="body_title">
              更新历史
            </div>
            <MessageBox
              title={"三个服务器分开了，优化了上传时移动端不好选星级的问题"}
              date={"2019/11/12 16:32"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"加入了国服的选项，现在上传和评论作业以及不需要登录了，增加了修改密码的功能，修复了一些bug"}
              date={"2019/11/10 02:00"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"优化了竞技场查询，现在能上传非公开作业了。修复了自动配队的一些bug，现在不需要设置box了"}
              date={"2019/11/02 02:07"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"增加了攻击范围计算器，欢迎测试并反馈结果"}
              date={"2019/10/31 01:04"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"加入了热门搜索的统计，为了使结果更准确，一段时间内的重复搜索不会计入"}
              date={"2019/10/23 19:42"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"增加了一个查询防守队伍的功能"}
              date={"2019/09/13 18:34"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"修复了一个因为服务端内存泄漏导致的沙雕崩溃问题"}
              date={"2019/09/04 18:53"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"更新了卡池，6星信息并修复了登陆弹的沙雕提示"}
              date={"2019/08/31 00:16"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"自动配队2.1更新，详情请参考页面内说明"}
              date={"2019/08/15 19:43"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"自动配队2.0更新，大幅提高了作业质量"}
              date={"2019/07/09 16:50"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"大幅优化了竞技场组合排名的加载速度"}
              date={"2019/07/08 16:30"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"增加了竞技场组合排名，以后将会作为自动配队的参考条件之一"}
              date={"2019/07/02 20:48"}
              type={"update"}
              showImage={false}
            />
            <MessageBox
              title={"增加了角色属性计算器和时间轴计算器(测试中)"}
              date={"2019/07/01 17:45"}
              type={"update"}
              showImage={false}
            />
          </div>
        </ItemBox>
      </div>
    );
  }

  private onGoTwitter = () => {
    window.open('https://twitter.com/hikari_xb2', '_blank');
  }
}

export default Home;