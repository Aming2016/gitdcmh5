'use strict';
const SERVER_IPS = ["https://custapis.shyj.cn/custAppApi","http://112.74.181.229:7031/custAppApi"];//api接口
const SERVERINDEX = 0;
const SERVER_IP = SERVER_IPS[SERVERINDEX];
const $axios = axios.create({
    baseURL: SERVER_IP,
    timeout: 5000,
//  headers: {
//      "Content-Type": "application/json;charset=UTF-8",
//      "scity":JSON.parse(window.sessionStorage.project).scity
//  }
});
//添加unique-code 用户标识
// $axios.defaults.headers.common['unique-code'] = "d2ViX2U5ZjdkYWJmLTFhNDYtNDdmMC04ZjA5LTRiNzlhMDJlYmMzMF84ODQwMDAwMDA=";

let TWOHOUSEUSED = SERVER_IP + "/contrast/used-house";  //二手房对比
let HOUSECONTRAST = SERVER_IP + "/statistics/houseUsed"; //查询房价统计
let STATISTICS = SERVER_IP + "/statistics/trend"; //查询 趋势统计
let HOUSINGCS = SERVER_IP + '/statistics/housing60-days'//查看最近60天成交房源
let GUIDEHAND = SERVER_IP + '/info/purchase-guide/index'//购房指南首页信息
let GUIDEHANDETAIL = SERVER_IP + '/info/'//获取资讯内容详情
let CONSULTANTINFO = SERVER_IP + '/consultant/info'//获取顾问详情
let PROBLEMINFO = SERVER_IP + '/consultant/problem_info'//获取问题详情
let TWOHOUSELIST = SERVER_IP + '/house/query'//二手房列表
let RENTHOUSELIST = SERVER_IP + '/rentHouse/query'//租房列表
let CODEKEY = "29e94f94-8664-48f2-a4ff-7a5807e13b68"//验证码
let ADDCODE =  SERVER_IP+'/member/fetchSmsCode'//获取验证码接口

let MYDATA = SERVER_IP+"/member/myinfo";//个人信息获取接口

let AGREET = SERVER_IP + '/consultant/adopt'//采纳
let LOOK = SERVER_IP + '/consultant/concern'//是否关注
//积分
let SCOREGIFT = SERVER_IP+'/score/queryGoodsList'//查询积分可兑换商品列表
let GETGOODSDETAIL = SERVER_IP+'/score/getGoodsDetail'//查看商品的详细信息\
let EXCHANGE = SERVER_IP + '/score/exchange'//积分兑换礼品
let GETCOUPONDETAIL = SERVER_IP + '/coupon/getCouponDetail'//已兑换的卡劵详情
let GETGIVECOUPONDETAIL = SERVER_IP + '/coupon/getGiveCouponDetail'//已转赠卡劵详情
let GENERALIZE = SERVER_IP + '/version/generalize'//安卓推广接口

