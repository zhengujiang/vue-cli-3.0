<template>
  <transition name="bounce">
    <div id="addfocus" class="addfocus" ref="addfocusDom">
      <div class="searchs" ref="searchDom">
        <div class="seabox">
          <form action="" onsubmit=" return false">
            <input ref="boxDom" type="search" class="text" :placeholder="placeholder" @focus="searchFocus"
                   id="searchCode" @blur="searchBlur" v-model.trim="values" @input="searchInput"
                   @keyup.13="searchInput">
            <img :src="close" alt="" v-show="values.length>0" @click="closeInputVal" class="closeInputVal">
          </form>
        </div>
        <div class="icon" @click="searchInput"></div>
      </div>
      <div class="chooseall" :style="{height:boxsearchHeight+'px'}">
        <div class="chose-title">
          <ul class="choosegle">
            <li class="choose vux-1px-b">
              <div class="choseBox" ref="titleDom">
                <div class="AddChoose">为您推荐：{{DefName}}</div>
                <span class="Addglfoc addfoc">
                <img v-show="includesShow" :src="includes" class="includess" @click="includeSClick">
                <img v-show="!includesShow" :src="offIncludes" class="includess" @click="includeSClick">
              </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="addfocus-box" ref="addfocusbox" :style="{height:boxHeight+'px'}">
          <ul class="choosegle infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
              :infinite-scroll-distance="30">
            <li class="choose li" v-for="(list,index) in defaultAddFocus">
              <div class="choseBox-item vux-1px-b">
                <div class="choseBox">
                  <div class="AddChoose">{{list.name}} <span style="margin-left: 8px">{{list.code}}</span>
                  </div>
                  <span class="Addglfoc addfoc" :key="index">
                  <img v-show="list.status" :src="closefoc" class="focimg" @click="addfoc(0,index)">
                  <img v-show="!list.status" :src="foc" class="focimg" @click="addfoc(0,index)">
              </span>
                </div>
              </div>
            </li>
          </ul>
          <p v-show="infLoading" class="infinite-loading">
            <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
          </p>
        </div>
      </div>
      <!---->
      <transition name="bounce">
        <div class="addSearchBox addsearch-box" ref="addsearchbox" v-show="addSearchBox"
             :style="{height:boxsearchHeight+'px'}">
          <div class="addSearchBox-scroll">
            <ul class="choosegle">
              <li class="choose li" v-for="(list,index) in adds">
                <div class="choseBox-item vux-1px-b">
                  <div class="choseBox">
                    <div class="AddChoose">{{list.name}} <span style="margin-left: 8px" v-html="key(list.code)"></span>
                    </div>
                    <span class="Addglfoc addfoc" :key="index">
                  <img v-show="list.status" :src="closefoc" class="focimg" @click="addfoc(1,index)">
                  <img v-show="!list.status" :src="foc" class="focimg" @click="addfoc(1,index)">
              </span>
                  </div>
                </div>
              </li>
            </ul>
            <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText"
                            :isShowBtn="false" :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import XiaoanWarning from '../../components/warning/warning'

  export default {
    name: 'addfocus',
    data() {
      return {
        warning: {
          top: '24%',
          show: true,
          img: this.$image.rules.trySenior,
          text: '搜索不到相关内容！',
          btnText: ''
        },
        includesShow: true,
        addSearchBox: false,
        wingl: '',
        close: this.$image.personal.close,
        show: '你还未完善信息',
        placeholder: "搜索证券简称/代码/拼音缩写",
        search: this.$image.personal.search,
        closefoc: this.$image.personal.closefoc,
        foc: this.$image.personal.foc,
        includes: this.$image.personal.include,
        offIncludes: this.$image.personal.offInclude,
        adds: [],
        defaultAddFocus: [],
        DefName: '',
        number: '',
        top: 1,
        bottom: 20,
        values: '',
        counts: 0,
        user_id: '',
        companyIds: [],
        searchStatus: true,
        focusStatus: true,
        type: "",
        companyids: "",
        boxHeight: '',
        boxsearchHeight: '',
        totalInfinite: {
          pageIndex: 1,
          pageSize: 20,
          totalNumber: 0,
        },
        infLoading: true,
        loading: false,
        allLoaded: true,
      }
    },
    components: {
      XiaoanWarning,
    },
    created() {
      this.user_id = this.$cookie.getCookie("userId");
      if (this.$cookie.isLogin()) {
        this.infinite();
      } else {
        this.$storage.loginStatus(this, '添加关注', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.boxsearchHeight = this.$refs.addfocusDom.clientHeight - this.$refs.searchDom.clientHeight;
        this.boxHeight = this.boxsearchHeight - this.$refs.titleDom.clientHeight;
      });
      var adverttitle = '';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/rule'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    beforeDestroy() {
      // 离开页面销毁focus事件
      this.$refs.boxDom.blur();
      this.$indicator.close();
    },
    methods: {
      // 关键字高亮
      key(str) {
        let star = [];
        star = this.values.trim().split(" ");
        for (let i = 0; i < star.length; i++) {
          if (star[i] == "" || typeof(star[i]) == "undefined") {
            star.splice(i, 1);
            i = i - 1;
          }
        }
        for (let i = 0; i < star.length; i++) {
          let fen = str.split(star[i]);
          str = fen.join('<span style="color:#ffc051;">' + star[i] + '</span>');
          if (/android/i.test(navigator.userAgent)) { //  android
            str = fen.join('<span style="color:#ffc051;">' + star[i] + '</span>');
          }
        }
        return str;
      },
      // 小按钮
      closeInputVal() {
        if (this.values.length != 0) {
          this.values = '';
          document.querySelector('.text').focus();
        } else {
          this.adds = [];
          this.warning.show = true
        }
        this.searchInput()
      },
      // 无限加载器
      loadMore() {
        let lastValue = this.totalInfinite.pageIndex;
        if (lastValue < this.totalInfinite.totalNumber) {
          this.loading = true;
          this.allLoaded = true;
        } else {
          this.loading = false;
          this.allLoaded = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.totalInfinite.totalNumber) {
            this.totalInfinite.pageIndex += 1;
            this.infinite();
            console.log("123", this.loading);
            this.allLoaded = true;
          }
          setTimeout(() => {
            this.loading = false;
            this.allLoaded = false;
          }, 5000);
        }, 300);
      },
      // 推荐股票代码
      infinite() {
        let params = {
          pageSize: this.totalInfinite.pageSize,
          pageIndex: this.totalInfinite.pageIndex
        }
        /*this.$http({
          methods: "GET",
          url: this.$api.attention.getIndustry,
          params: {
            pageSize: this.totalInfinite.pageSize,
            pageIndex: this.totalInfinite.pageIndex
          }
        })*/
        this.$axios.attention.getIndustry(params).then((res) => {
          console.log("123123213", res)
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.type == 1) {
              // 输出沪深涨跌幅前十
              this.DefName = '沪深涨幅前十';
              this.defaultAddFocus = res.data.returnObject.data;
              this.infLoading = false;
            } else if (res.data.returnObject.type == 0) {
              // 输出相关行业
              this.DefName = res.data.returnObject.industry;
              let number = res.data.total;
              console.log('number', number)
              this.totalInfinite.totalNumber = this.$array.totalPage(number, this.totalInfinite.pageSize);
              //控制下拉刷新
              let newData = res.data.returnObject.data;
              this.defaultAddFocus = this.$array.loadMore(this.defaultAddFocus, newData);
            }
            // 获取数据拼接Code 执行
            let idArr = [];
            this.defaultAddFocus.forEach((item) => {
              idArr.push(item.code)
            });
            this.companyids = idArr.join(',');
            this.type = res.data.returnObject.type;
          } else if (res.data.returnCode == -1) {
          }
        }).catch((err) => {
          this.$vux.toast.show({text: '网络异常', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 一键关注
      oneKeyAttention() {
        /*this.$http({
          methods: "GET",
          url: this.$api.attention.oneKeyAttention,
          params: {
            pageSize: this.totalInfinite.pageSize * this.totalInfinite.pageIndex,
            pageIndex: 1,
            type: this.type,
            companyIds: this.companyids,
          }
        })*/
        let params = {
          pageSize: this.totalInfinite.pageSize * this.totalInfinite.pageIndex,
          pageIndex: 1,
          type: this.type,
          companyIds: this.companyids
        }
        this.$axios.attention.oneKeyAttention(params).then((res) => {
          console.log(res.data.returnCode);
          if (res.data.returnCode == 1 || this.focusStatus == true) {
            this.includesShow = false;
            this.$vux.toast.show({text: '一键关注成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.counts++;
            this.totalInfinite.pageIndex = 1;
            this.defaultAddFocus = []
            this.adds = [];
            this.infinite();
            this.focusStatus = false;
          } else {
            this.$vux.toast.show({text: '网络异常', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err + "一键关注所有");
        })
      },
      // 一键取消
      oneKeyCancel() {
        /*this.$http({
          methods: "GET",
          url: this.$api.attention.oneKeyCancel,
          params: {
            companyIds: this.companyids
          }
        })*/
        let params = {
          companyIds: this.companyids
        }
        this.$axios.attention.oneKeyCancel(params).then((res) => {
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '取消关注成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.includesShow = true;
            this.totalInfinite.pageIndex = 1;
            this.defaultAddFocus = []
            this.adds = [];
            this.infinite();
            this.focusStatus = true;
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: '网络异常', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 点击一键触发方法
      includeSClick() {
        if (this.includesShow) {
          this.oneKeyAttention();
        } else {
          this.oneKeyCancel();
        }
      },
      // input 失焦
      searchBlur() {
        if (this.values.trim().length == 0) {
          this.adds = [];
          this.warning.show = true;
        }
        this.placeholder = '搜索股票代码/简称/拼音缩写';
        this.searchInput();
      },
      // input 聚焦   /*placeholder='搜索股票代码/简称/拼音缩写'*/
      searchFocus() {
        this.addSearchBox = true;
      },
      //
      searchInput() {
        this.values = this.$array.trim(this.values);
        this.searchStatus = false;
        this.searchStock();
        if (this.values.length !== 0) {
          this.warning.show = false;
          this.addSearchBox = true;
        } else {
          this.addSearchBox = false;
          this.adds = [];
        }
      },
      //
      searchStock() {
        /*this.$http({
          methods: "GET",
          url: this.$api.attention.searchStock,
          params: {
            searchStr: this.values.trim(),
          }
        })*/
        let params = {searchStr: this.values.trim()}
        this.$axios.attention.searchStock(params).then((res) => {
          if (res.data.returnCode == 1) {
            this.adds = res.data.returnObject;
          } else if (res.data.returnCode == -1) {
            this.adds = [];
            this.warning.show = true;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 根据用户填的股票代码的到他的行业分类在以此来推荐
      addAttention(type, index) {
        let companyId = '';
        let companyFullCode = '';
        switch (type) {
          case 0:
            companyId = this.defaultAddFocus[index].code;
            companyFullCode = this.defaultAddFocus[index].fullCode;
            break;
          case 1:
            companyId = this.adds[index].code;
            companyFullCode = this.adds[index].fullCode;
            break;
        }
        /*this.$http({
          methods: "GET",
          url: this.$api.attention.addAttention,
          params: {
            companyId: companyId,
            companyFullCode: companyFullCode,
          }
        })*/
        let params = {
          companyId: companyId,
          companyFullCode: companyFullCode
        }
        this.$axios.attention.addAttention(params).then((res) => {
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '关注成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.searchStock();
            this.totalInfinite.pageIndex = 1;
            this.defaultAddFocus = []
            this.adds = [];
            this.infinite();
          }
        }).catch((err) => {
        });
      },
      //
      deleteAttention(type, index) {
        let companyId = '';
        let companyFullCode = '';
        switch (type) {
          case 0:
            companyId = this.defaultAddFocus[index].code;
            companyFullCode = this.defaultAddFocus[index].fullCode;
            break;
          case 1:
            companyId = this.adds[index].code;
            companyFullCode = this.adds[index].fullCode;
            break;
        }
        /*this.$http({
          methods: "GET",
          url: this.$api.attention.deleteAttention,
          params: {
            companyId: companyId,
            companyFullCode: companyFullCode,
          }
        })*/
        let params = {
          companyId: companyId,
          companyFullCode: companyFullCode,
        }
        this.$axios.attention.deleteAttention(params).then((res) => {
          this.$vux.toast.show({text: '取消关注', position: 'middle', type: 'text', width: 'auto', time: 2500});
          this.searchStock();
          this.totalInfinite.pageIndex = 1;
          this.defaultAddFocus = []
          this.adds = [];
          this.infinite();
        }).catch((err) => {
          this.$vux.toast.show({text: '网络异常', position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      addfoc(type, index) {
        switch (type) {
          case 0:
            if (this.defaultAddFocus[index].status) {
              this.deleteAttention(type, index);
            } else {
              this.addAttention(type, index);
            }
            break;
          case 1:
            if (this.adds[index].status) {
              this.deleteAttention(type, index);
            } else {
              this.addAttention(type, index);
            }
            break;
        }
      }
    }
  }
</script>

<style lang="scss">
  .addfocus {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .searchs {
      width: 100%;
      height: 50px;
      background: #f0f1f5;
      padding: 7.5px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 500;
      .seabox {
        width: 91%;
        height: 100%;
        position: relative;
        form {
          height: 100%;
          width: 100%;
          input.text {
            font-size: 15px;
            font-family: PingFangSC-Regular, sans-serif;
            width: 100%;
            height: 100%;
            background: #fff;
            color: #323232;
            display: inline-block;
            box-sizing: border-box;
            -webkit-appearance: none;
            border-radius: 2px;
            border: 0;
            padding: 8px;
            -webkit-box-sizing: border-box;
            outline: none;
          }
          input.text::-webkit-search-cancel-button {
            display: none;
            opacity: 0;
          }
          .closeInputVal {
            position: absolute;
            top: 28%;
            right: 8px;
            height: 16px;
          }
        }
      }
      .icon {
        width: 26px;
        height: 26px;
        display: inline-block;
        background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/search@3x.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
    .addfoc img {
      width: auto;
      height: 24px;
    }
    .chooseall {
      .chose-title {
        ul.choosegle {
          li.choose {
            height: 50px;
            border: none;
            padding-left: 12px;
            padding-right: 12px;
            overflow: hidden;
            color: #323232;
            position: relative;
            z-index: 500;
            background-color: white;

            .choseBox {
              display: table;
              height: 100%;
              width: 100%;
              table-layout: fixed;
              word-wrap: break-word;
              .AddChoose {
                display: table-cell;
                vertical-align: middle;
                color: #323232;
                font-size: 15px;
                font-weight: 600;
                width: 78%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              .Addglfoc {
                display: table-cell;
                vertical-align: middle;
                text-align: right;
                width: 22%;
                img {
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
      .addfocus-box {
        position: relative;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        ul {
          li.choose {
            height: 50px;
            border: none;
            padding-left: 12px;
            padding-right: 12px;
            overflow: hidden;
            color: #323232;
            position: relative;
            z-index: 500;
            background-color: white;
            box-sizing: border-box;
            .choseBox-item {
              height: 100%;
            }
            .choseBox {
              display: table;
              height: 100%;
              width: 100%;
              table-layout: fixed;
              word-wrap: break-word;
              .AddChoose {
                display: table-cell;
                vertical-align: middle;
                color: #323232;
                font-size: 15px;
                font-weight: 600;
                width: 78%;
                overflow: hidden;
              }
              .Addglfoc {
                display: table-cell;
                vertical-align: middle;
                text-align: right;
                width: 22%;
                img {
                  vertical-align: middle;
                }
              }
            }
          }
        }
        .choosegle {
          width: 100%;
        }
        .infinite-loading {
          text-align: center;
          height: 45px;
          line-height: 45px;
          .mint-spinner-snake {
            height: 14px !important;
            width: 14px !important;
            border: 2px solid transparent;
            border-top-color: rgb(252, 199, 127) !important;
            border-left-color: rgb(252, 199, 127) !important;
            border-bottom-color: rgb(252, 199, 127) !important;
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
        }
      }
    }
    .addSearchBox.addsearch-box {
      position: absolute;
      top: 50px;
      left: 0;
      width: 100%;
      z-index: 2000;
      background-color: #FFFFFF;
      .addSearchBox-scroll {
        height: 100%;
        width: 100%;
        position: relative;
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
      ul {
        li.choose {
          height: 50px;
          border: none;
          padding-left: 12px;
          padding-right: 12px;
          overflow: hidden;
          color: #323232;
          position: relative;
          z-index: 500;
          background-color: white;
          box-sizing: border-box;
          .choseBox-item {
            height: 100%;
          }
          .choseBox {
            display: table;
            height: 100%;
            width: 100%;
            table-layout: fixed;
            word-wrap: break-word;
            .AddChoose {
              display: table-cell;
              vertical-align: middle;
              color: #323232;
              font-size: 15px;
              font-weight: 600;
              width: 78%;
              overflow: hidden;
            }
            .Addglfoc {
              display: table-cell;
              vertical-align: middle;
              text-align: right;
              width: 22%;
              img {
                vertical-align: middle;
              }
            }
          }
        }
      }
      .choosegle {
        width: 100%;
      }
      .infinite-loading {
        text-align: center;
        height: 45px;
        line-height: 45px;
        .mint-spinner-snake {
          height: 14px !important;
          width: 14px !important;
          border: 2px solid transparent;
          border-top-color: rgb(252, 199, 127) !important;
          border-left-color: rgb(252, 199, 127) !important;
          border-bottom-color: rgb(252, 199, 127) !important;
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
      }
    }
  }
</style>
