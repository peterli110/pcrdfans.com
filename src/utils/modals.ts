import { Modal } from 'antd';
import Router from 'next/router';


export const LoginModal = () => {
  Modal.confirm({
    title: "还没登录呢（",
    content: "需要登录账号才能使用(´・ω・`)",
    onOk: () => Router.push("/login"),
    okText: "去登录",
    maskClosable: true,
    icon: "info-circle",
    cancelText: "取消",
  });
};

export const ErrorModal = () => {
  Modal.error({
    title: '(╥﹏╥)好像哪里出错了，请点击OK刷新页面',
    onOk: () => {location.reload(true);}
  });
};

export const TooManyModal = () => {
  Modal.info({
    title: `操作太频繁了，要被玩坏了_(:3 」∠ )_`,
  });
};

export const SaveSuccessModal = () => {
  Modal.success({
    title: '保存成功(✪ω✪)'
  });
};

export const RegionNotSupportModal = () => {
  Modal.info({
    title: `暂时不支持该区域`,
  });
};