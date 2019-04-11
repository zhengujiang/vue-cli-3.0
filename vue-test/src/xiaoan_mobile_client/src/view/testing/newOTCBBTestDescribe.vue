<template>
  <div id="newOTCBBTestDescribe" class="newOTCBBTestDescribe">
    <div class="newOTCBBTestDescribeScroll">
      <div class="newOTCBBTestDescribe-content-middle">
        <div class="newOTCBBTestDescribe-content-middle-item">
          <span class="newOTCBBTestDescribe-content-middle1"><div></div></span>
          <span class="newOTCBBTestDescribe-content-middle-text">{{inform[0]}}</span>
          <span class="newOTCBBTestDescribe-content-middle2"><div></div></span>
        </div>
      </div>
      <!---->
      <div class="newOTCBBTestDescribe-docOne docBox">
        <div class="newOTCBBTestDescribe-docBox">
          <div class="newOTCBBTestDescribe-docBoxAll">
            <p v-for="list in gongneng">
              <span class="newOTCBBTest-docBoxAllOneA">
                  <span class="newOTCBBTest-docBoxAllOne">
                      <span>{{list.id}}</span>
                  </span>
              </span>
              <span>{{list.name}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="newOTCBBTestDescribe-content-middle">
        <div class="newOTCBBTestDescribe-content-middle-item">
          <span class="newOTCBBTestDescribe-content-middle1"><div></div></span>
          <span class="newOTCBBTestDescribe-content-middle-text">{{inform[1]}}</span>
          <span class="newOTCBBTestDescribe-content-middle2"><div></div></span>
        </div>
      </div>
      <!---->
      <div class="newOTCBBTestDescribe-docOne">
        <div class="newOTCBBTestDescribe-docBox">
          <div class="newOTCBBTestDescribe-docBoxAll">
            <p v-for="list in fufei">
                            <span class="newOTCBBTest-docBoxAllOneA"><span
                              class="newOTCBBTest-docBoxAllOne"><span>{{list.id}}</span></span></span>
              <span>{{list.name}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <footer class="newOTCBBTestDescribe-foot">
      <button class="newOTCBBTest-footBtnone">
        <span class="footBtnoneS1">{{priceText[0]}}<span class="footBtnoneS2">{{priceText[1]}}</span></span>
      </button>
      <button class="newOTCBBTest-footBtnTwo" v-if="payMode == 0" @click="payMoney">{{priceText[2]}}</button>
      <button class="newOTCBBTest-footBtnTwo1" v-else-if="payMode ==1 && payModeTime != 0">{{priceText[3]}}
      </button>
      <button class="newOTCBBTest-footBtnTwo" v-else>{{priceText[2]}}</button>
    </footer>
  </div>
</template>
<script>
  export default {
    name: 'newOTCBBTestDescribe',
    data() {
      return {
        inform: ["功能介绍", "付费通知"],
        priceText: ["限时优惠￥199/年", "(￥699)", "支  付", "已支付"],
        gongneng: [
          {id: "1", name: "系统涵盖全国中小企业股份转让系统的最新考纲和所有题库，根据最新一期董秘资格考试的题型、分值实时更新模拟考试系统，结合最新考点、重点智能组卷。"},
          {id: "2", name: "系统根据测试结果自动归集错题，并提供错题收藏功能；系统还会对测试结果进行详细能力解析，提示复习重点，提高学习效率。"},
          {id: "3", name: "信公小安自带资本市场法规库，用户可以便捷的查询相关法规，并在信公商学院进一步学习海量资本市场实务课程。"},
        ],
        fufei: [
          {id: "1", name: "功能说明：您即将付费开通“新三板董秘测评”功能，上海信公印诚信息技术有限公司具有该功能使用的相关解释权；"},
          {id: "2", name: "开通费用：￥199/年，包含1年无限次使用第一条所述相关功能；"},
          {id: "3", name: "退款说明：该付费功能在付费成功后自动开通，一旦付费开通，将不支持退款；"},
          {id: "4", name: "发票申请：请微信添加“信公小安”客服（微信ID：infaithjinjin），或至电“021-20740303”。"}
        ],
        payMode: "",
        examCount: "",
        expirationTime: "",
        shareuserTestInfo: "",
        nowDate: "",
        nowTime: "",
        payModeTime: "",
      }
    },
    watch: {
      /*"$route": function () {
        window.location.reload();
      }*/
    },
    updated() {
      this.lineHeight();
      console.log("121212121",);
    },
    created: function () {
      this.userTestInfo()
    },
    mounted: function () {
      this.lineHeight();
      /**/
      var adverttitle = "专业董秘才敢做的测试题！";
      var sharelink2 = decodeURI(window.location.href.split("#/")[0] + "#/testing");//分享链接
      var shareDesc = "";//描述
      /**/
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.testingImg, true);
      /**/
    },
    methods: {
      lineHeight() {
        let hei = document.body.clientHeight;
        let foot = document.querySelector(".newOTCBBTestDescribe-foot").clientHeight;
        document.querySelector(".newOTCBBTestDescribeScroll").style.height = (hei - foot) + "px";
      },
      userTestInfo() {
       this.$axios.testing.userTestInfo().then(res => {
          console.log(res);
          if (res.data.returnCode === 1) {
            this.payMode = res.data.returnObject.userPayMode.payMode;//免费 0 和付费 1
            this.nowTime = Math.ceil((this.expirationTime - this.nowDate) / 86400000);
            this.examCount = res.data.returnObject.userPayMode.examCount;//免费 cishu
            this.expirationTime = res.data.returnObject.userPayMode.expirationTime;//免费 cishu
            this.shareuserTestInfo = res.data.returnObject.userPayMode.share;//免费 cishu
            this.nowDate = res.data.returnObject.nowDate;//服务器当前时间
            if (this.payMode == 1) {
              this.payModeTime = Math.ceil((this.expirationTime - this.nowDate) / 86400000)
            } else {

            }
          } else {

          }
        }).catch((err) => {
          console.error(err);
        })
      },
      payMoney() {
        let money = 1;
         this.$axios.testing.checkWxIdByUserId().then(res => {
          let wxID = res.data.returnObject;
          if (wxID === null || wxID == "") {
            this.$vux.toast.show({text: '请重新登录付费', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$cookie.apiUserClear(this);
            // this.exit();
          } else {
            console.log(res, "=|||=", wxID);
            this.WxJSBridge(this, money, wxID);
          }
        }).catch((err) => {
          console.error(err.data, "getWxInfo错误");
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
        });
      },
      /* exit() {
         this.$http ({
           method: 'GET',
           url: this.$api.user.exit,
           params: {
             userId: this.$cookie.getCookie("userId"),
           }
         }).then((res) => {
           if (res.data.returnCode == 1) {
             window.localStorage.removeItem("token");
             window.localStorage.removeItem("weixinId");
             this.$cookie.deleteCookie("userId");
             this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
           }
         }).catch((err) => {
           console.error(err);
         })
       },*/
      /*微信支付*/
      WxJSBridge(vue, totalFee, wxId) {
        let signature = ""; //需要生成的签名
        let params = {
            totalFee: totalFee,
            openId: wxId,
          }
        vue.$axios.wxpay.payexam(params).then(res => {
          signature = res.data.returnObject;
          console.log("========>wxpay/payexam", res, signature, signature.appId,
            signature.timeStamp, signature.nonceStr,
            signature.thePackage, signature.signType,
            signature.sign);

          function onBridgeReady() {
            WeixinJSBridge.invoke(
              "getBrandWCPayRequest", {
                "appId": signature.appId,     //公众号名称，由商户传入
                "timeStamp": signature.timeStamp,  //时间戳，自1970年以来的秒数
                "nonceStr": signature.nonceStr, //随机串
                "package": signature.thePackage,//后台给的
                "signType": signature.signType,  //微信签名方式：
                "paySign": signature.sign //微信签名
              },
              function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  vue.userTestInfo();
                  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                  vue.$vux.toast.show({text: '支付成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
                  vue.$router.push({path: "/newOTCBBTestingEnd"});
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                  vue.$vux.toast.show({text: '取消支付', position: 'middle', type: 'text', width: 'auto', time: 2500});
                } else {
                  vue.$vux.toast.show({text: '支付失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
                }
              }
            );
          }

          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
          } else {
            console.log("调用微信");
            onBridgeReady();
          }
        }).catch((err) => {
          console.error(err, "wxpay/payexam/错误");
          // console.log(err.response.data);
          // console.log(err.response.status);
          // console.log(err.response.headers);
        });

      },
    }
  }
</script>

<style lang="scss">
  .newOTCBBTestDescribe {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-size: 100% 100%;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    .newOTCBBTestDescribeScroll {
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .newOTCBBTestDescribe-content-middle {
        height: 50px;
        line-height: 50px;
        /* margin-top: 12px;*/
        .newOTCBBTestDescribe-content-middle-item {
          text-align: center;
          color: #f0cf8d;
          .newOTCBBTestDescribe-content-middle1, .newOTCBBTestDescribe-content-middle2 {
            width: 60px;
            height: 1px;
            display: inline-block;
            vertical-align: middle;
            border-bottom: 0.5px solid #f0cf8d;
            position: relative;
            top: -3px;
          }
          .newOTCBBTestDescribe-content-middle1 {
            div {
              height: 3px;
              width: 3px;
              background-color: #f0cf8d;
              position: absolute;
              border-radius: 50%;
              right: 0;
              top: 0;
            }
          }
          .newOTCBBTestDescribe-content-middle-text {
            padding: 0 24px;
            font-size: 15px;
            font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          }
          .newOTCBBTestDescribe-content-middle2 {
            div {
              height: 3px;
              width: 3px;
              background-color: #f0cf8d;
              position: absolute;
              border-radius: 50%;
              left: 0;
              top: 0;
            }
          }
        }
      }
      .newOTCBBTestDescribe-docOne {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 0 20px 10px 20px;
        overflow: hidden;
        .newOTCBBTestDescribe-docBox {
          width: 100%;
          max-height: 220px;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          box-sizing: border-box;
          padding: 15px 10px;
          .newOTCBBTestDescribe-docBoxAll {
            /*max-height: 190px;*/
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            p {
              font-size: 13px;
              color: rgba(255, 255, 255, .8);
              overflow: hidden;
              text-align: justify;
              font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
              display: table;
              width: 100%;
              margin-bottom: 7px;
              .newOTCBBTest-docBoxAllOneA {
                width: 23px;
                vertical-align: top;
                .newOTCBBTest-docBoxAllOne {
                  width: 16.5px;
                  border: 0;
                  border-radius: 50%;
                  height: 16px;
                  font-size: 10px;
                  color: rgba(240, 207, 141, 1);
                  background-color: rgba(240, 207, 141, 0.15);
                  display: inline-block;
                  text-align: center;
                  position: relative;
                  span {
                    line-height: 1;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                  }
                }
              }
              span {
                display: table-cell;
              }
            }
          }
        }
      }
      .docBox {
        padding-bottom: 0;
      }
    }
    .newOTCBBTestDescribe-foot {
      height: 50px;
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      font-size: 0;
      display: table;
      button {
        height: 100%;
        display: table-cell;
        border: 0;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
      }
      .newOTCBBTest-footBtnone {
        width: 65%;
        font-size: 15px;
        color: #fff;
        background-color: rgba(240, 207, 141, 0.44);
        position: relative;
        display: table-cell;
        .footBtnoneS1 {
          display: table-cell;
          width: 65%;
          text-align: center;
          position: relative;
        }
        .footBtnoneS2 {
          color: #f0cf8d;
          font-size: 18px;
          text-align: right;
          text-decoration: line-through;
          position: absolute;
          top: -30%;
        }
      }
      .newOTCBBTest-footBtnTwo1 {
        width: 35%;
        font-size: 15px;
        color: #fff;
        background-color: rgba(240, 241, 245, 0.7);
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
      }
      .newOTCBBTest-footBtnTwo {
        width: 35%;
        font-size: 15px;
        color: #fff;
        background-color: #f0cf8d;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
      }
    }
  }

</style>
