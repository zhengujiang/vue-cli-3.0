<template>
  <div id="applicationList" ref="boxDom">
    <div class="AppList-content" :style="{height: contentHeight+'px'}">
      <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                   :bottom-all-loaded="allLoaded" ref="loadmore">
        <div class="AppList-Loadmore">
          <div class="AppList-List" v-for="(list,index) in appList">
            <div class="AppList-item" @click="goMoney(index)">
              <div class="AppList-money">{{openKey+"&ensp;"}}{{list.invoiceMoney}}</div>
              <div class="AppList-One">
                <div class="AppList-One-date">申请日期{{$const.format(list.createDate)}}</div>
              </div>
              <div class="AppList-Two">
                <div class="AppList-Two-List" v-if="list.invoiceStatus == 1">
                  <span class="AppList-Two-open" style="color: #7fc76d">已开票&ensp;</span>
                  <span>|</span>
                  <span class="AppList-Two-date">寄送日期{{$const.format(list.sendDate)}}</span>
                  <span>|</span>
                  <span class="AppList-Two-key">快递单号{{list.courierNumber}}</span>
                </div>
                <div class="AppList-Two-List" v-else>
                  <span class="AppList-Two-open" style="color: #ffb148">开票中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="bottom" class="mint-loadmore-bottom">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop'}">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
          <span v-show="bottomStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
        </div>
      </mt-loadmore>
    </div>
    <div class="AppList-Tishi" v-show="AppListWaring">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAAC1CAYAAAC00qYAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkE0ODMwRjk4QUQ5MTFFNzg1NkRDREZFQUNGMDcyQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkE0ODMwRkE4QUQ5MTFFNzg1NkRDREZFQUNGMDcyQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQTQ4MzBGNzhBRDkxMUU3ODU2RENERkVBQ0YwNzJCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQTQ4MzBGODhBRDkxMUU3ODU2RENERkVBQ0YwNzJCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnPIOVgAAAvcSURBVHja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"
        alt="">
      <div>您还没有已受理的发票！</div>
    </div>
    <footer class="AppListFooter" ref="footerDom">
      <button class="AppList-BtnOne" @click="BtnOne">申请发票</button>
      <button class="AppList-BtnTwo" @click="BtnTwo">返回小鹅通</button>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'applicationList',
    data() {
      return {
        openKey: '开票金额¥',
        appList: [],
        pageIndex: 1,
        bottomStatus: '',
        zongshu: '10',
        allLoaded: false,
        AppListWaring: true,
        tempUserIdS: '',
        contentHeight: '',
        user_Id: ''
      }
    },
    watch: {
      '$route'(to, from) {
        //console.log(, to.name, from.name);
        window.location.reload();
      }
    },
    updated() {
      // this.upHeight();
    },
    created() {
      let wxAuth = window.localStorage.getItem('wx-auth');
      console.log('wxAuth', wxAuth);
      let user_id = this.$cookie.getCookie("userId");
      this.user_Id = user_id;
      if (wxAuth) {
        // 有
        this.tempUserIdS = window.JSON.parse(wxAuth).openId;
      } else {
        // 没有
      }
      if (this.$route.query.weixinId) {
        this.getInvoiceList();
      } else {
        this.$weixin.wxAuthRedirect(this, 'INVOICE');
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.contentHeight = this.$refs.boxDom.clientHeight - this.$refs.footerDom.clientHeight;
      })
      /* *
       * todo
       * */
      let adverttitle = "信公商学院";
      let sharelink2 = "https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/";//分享链接
      let shareDesc = "";//描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      /**/
      getInvoiceList() {
        let params = {
          page: this.pageIndex,
          weixinId: this.$route.query.weixinId
        }
        this.$axios.invoice.getInvoiceList(params).then(res => {
          console.log("allLoaded", res);
          //var global = this.appList;
          if (res.data.returnCode == 1) {
            this.AppListWaring = false;
            this.zongshu = res.data.returnObject.pageCount;
            if (this.appList.length > 0 && res.data.returnObject.infoList !== null) {
              for (let i in res.data.returnObject.infoList) {
                this.appList.push(res.data.returnObject.infoList[i]);
              }
            } else if (this.appList.length == 0 && res.data.returnObject.infoList !== null) {
              this.appList = res.data.returnObject.infoList;
            } else {
              this.appList = [];
            }
            this.rulesListNum = this.appList.length;
          } else if (res.data.returnCode == 100) {
            // 走授权
            //  this.$weixin.wxAuthRedirect(this, 'INVOICE');
          } else {
            this.AppListWaring = true;
            this.zongshu = "0";
          }

        }).catch((err) => {

        })
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      //加载更多
      loadBottom() {
        setTimeout(() => {
          let lastValue = this.pageIndex;
          if (lastValue < this.zongshu) {
            this.pageIndex += 1;
            this.getInvoiceList();
          } else {
            //this.allLoaded = true;  //全部加载完毕
            // $(".snake").text('没有更多了!');
          }
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      upHeight() {
        let hei = document.body.clientHeight;
        let AppListFooter = document.querySelector(".AppListFooter").clientHeight;
        let ghg = (hei - AppListFooter) + "px";
        document.querySelector(".AppList-content").style.height = ghg;
      },
      goMoney(index) {

      },
      BtnOne() {
        this.$router.push({path: '/application', query: Object.assign({}, this.$route.query)});
      },
      BtnTwo() {
        window.location.href = "https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/";
      },
    },
  }
</script>

<style lang="scss">
  #applicationList .mint-spinner-snake {
    border-top-color: rgb(252, 199, 127) !important;
    border-left-color: rgb(252, 199, 127) !important;
    border-bottom-color: rgb(252, 199, 127) !important;
    height: 14px !important;
    width: 14px !important;
    -webkit-animation: mint-spinner-rotate 0.8s infinite linear !important;
    animation: mint-spinner-rotate 0.8s infinite linear !important;
    border: 2px solid transparent;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
  }
  .snake {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #535353;
    height: 50px;
    box-sizing: border-box;
    text-align: center;
  }
</style>

<style scoped lang="scss">
  #applicationList {
    width: 100%;
    height: 100%;
    background-color: #f0f1f5;
  }
  #applicationList .AppList-content {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }
  #applicationList .AppList-List {
    box-sizing: border-box;
    padding: 15px 12px 0 12px;
  }
  #applicationList .AppList-List:last-child {
    padding-bottom: 15px;
  }
  #applicationList .AppList-item {
    height: 110px;
    width: 100%;
    background-color: white;
    box-sizing: border-box;
    padding: 0 8px;
    position: relative;
    /*justify-content: center; !*!/子元素水平居中*!
    align-items: center; !*!/子元素垂直居中*!
    display: -webkit-flex;*/
  }
  #applicationList .AppList-money {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    /*text-align: center;*/
    font-size: 17px;
    white-space: nowrap;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  #applicationList .AppList-One {
    height: 70%;
    border-bottom: 0.5px solid #f0f1f5;
  }
  #applicationList .AppList-One-date {
    font-size: 12px;
    color: #8d8d8d;
    padding-top: 12.5px;
    box-sizing: border-box;
  }
  #applicationList .AppList-Two {
    height: 30%;
    width: 100%;
    font-size: 0;
  }
  #applicationList .AppList-Two-List {
    height: 100%;
    width: 100%;
    display: table;
  }
  #applicationList .AppList-Two-List span {
    font-size: 12px;
    display: table-cell;
    vertical-align: middle;
    color: #8d8d8d;
  }
  #applicationList .AppList-Two-key {
    text-align: right;
  }
  #applicationList .AppList-Two-date {
    text-align: center;
  }
  #applicationList .AppList-Tishi {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0f1f5;
  }
  #applicationList .AppList-Tishi img {
    width: 50px;
    position: absolute;
    top: 25%;
    left: 50%;
    margin-left: -25px;
    /*-webkit-transform: translateX(-50%);*/
  }
  #applicationList .AppList-Tishi div {
    position: absolute;
    top: 37%;
    left: 50%;
    -webkit-transform: translateX(-50%);
    color: #bfbfbf;
    font-size: 15px;
  }
  #applicationList .AppListFooter {
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
    left: 0;
    font-size: 0;
    border-top: 1px solid #f0f1f5;
    z-index: 2000;
  }
  #applicationList .AppList-BtnOne {
    display: inline-block;
    height: 50px;
    width: 50%;
    color: #ffb148;
    background-color: white;
    border: 0;
    font-size: 18px;
  }
  #applicationList .AppList-BtnTwo {
    width: 50%;
    display: inline-block;
    height: 50px;
    background-color: #ffb148;
    border: none;
    font-size: 18px;
    color: white;
  }

</style>
