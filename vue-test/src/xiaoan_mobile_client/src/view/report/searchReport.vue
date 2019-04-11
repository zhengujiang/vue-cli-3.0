<template>
  <transition name="bounce">
    <div class="searchReport" id="searchReport" ref="searchReportDom">
      <div class="searchS" ref="searchDom">
        <div class="seaBox">
          <form action="" onsubmit=" return false;">
            <input id="searchReportText" type="search" class="text" :placeholder="placeholder"
                   @blur="searchBlur" v-model="values" @input="searchInput" @keyup.13="searchList"/>
            <i v-show="values.length != 0" class="icon iconfont closeInputVals icon-X"
               @click="closeInputVals"></i>
          </form>
        </div>
        <div class="" @click="searchList"><i class="icon iconfont icon-tripsousuo"></i></div>
      </div>
      <div v-show="groupSearch">
        <!--最近搜索-->
        <div class="dsearch">
          <div class="dseText"><span class="dsearchbox"></span>{{dsearch}}</div>
          <div class="dseClear" @click="dseClear">{{cleartext}}<i class="icon iconfont icon-shanchu"></i>
          </div>
        </div>
        <div class="HistoryS" v-show="notHistory">{{HistoryText}}</div>
        <div class="dseResult" v-show="!notHistory">
          <button type="button" v-for="(list,index) in Newarr" @click="dseResultOne(index)">{{newBtnArr(list)}}
          </button>
        </div>
      </div>
      <!--提示搜索-->
      <div class="prestrains" id="preStar" v-show="prestrains" :style="{height:prestrainHeight+'px'}">
        <ul>
          <li v-for="(list,index) in prestrain" @click="gocontent(index)">
            <div class="prestrains_div vux-1px-b" v-html="$array.key(values,list.subject)"></div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import loading from "../../components/warning/loading.vue"

  export default {
    name: 'searchReport',
    data() {
      return {
        prestrainHeight: 0,
        close: this.$image.personal.close,
        loading: this.$image.rules.loading,
        clear: this.$image.rules.clear,
        InABatch: this.$image.rules.InABatch,
        dsearch: "最近搜索",
        hotSearch: '热门推荐',
        InAbatch: '换一批',
        cleartext: '清除',
        HistoryText: "您还没有历史记录！",
        value: '',
        values: "",
        prestrain: [],
        placeholder: "搜索研报，多个关键字空格隔开",
        defaultResult: [],
        hotResult: [],
        top: 1,
        bottom: 10,
        num: '',
        notHistory: false,
        groupSearch: true,
        Newarr: [],
        showLoading: false,
        isSearch: false,
        prestrains: false,
        closeVal: false,
      }
    },
    components: {
      'xiaoan-loading': loading
    },
    mounted() {
      /**/
      let userId = this.$cookie.getCookie("userId");
      if (!this.$cookie.isLogin()) {
        this.loadingDis = true;
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      this.$nextTick(() => {
        this.prestrainHeight = this.$refs.searchReportDom.clientHeight - this.$refs.searchDom.clientHeight;
      })
      //点击列表页的词块
      this.inputIss();
      $('#searchReportText').focus();
      if (this.values.trim().length != 0) {
        this.closeVal = true;
      }
      let defaultResult = this.$storage.localStorageAll("HistorySearchReport");
      defaultResult = this.$array.ImpArr(defaultResult);
      if (defaultResult == null || defaultResult == [] || defaultResult.length == 0) {
        this.notHistory = true;
      } else {
        this.notHistory = false;
      }
      this.defaultResult = defaultResult;
      this.Newarr = defaultResult;
      console.log(this.defaultResult, this.$route.query.value);
      if (this.$route.query.value == undefined || this.$route.query.value == null) {

      } else {
        this.values = (this.$route.query.value).split(",").join(" ");
        $("#searchReportText").focus();
      }
      /**/
      let adverttitle = "信公小安 x 天风证券研究所";
      let sharelink2 = decodeURI(window.location.href);//分享链接
      let shareDesc = "用信公小安，随时掌握最新研报";//描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2,this.$api.share.defaultImg, false);

      document.querySelector('#searchReportText').addEventListener('click', function (event) {
        (this || delegate.obj).focus();
      }, false);
    },
    methods: {
      //传值是否存在,是否有逗号
      inputIss() {
        if (this.$route.query.valuess !== undefined) {
          if (this.$route.query.valuess.indexOf(",") !== -1) {
            let arr = this.$route.query.valuess.split(',');
            this.values = arr.join(" ");
          } else {
            this.values = this.$route.query.valuess;
          }
        }
      },
      //判断有localStorage 读取localStorage
      localStorageAll() {
        if (window.localStorage.getItem('HistorySearchReport') === null) {
          //没有localStorage的情况
          this.notHistory = true;
        } else {
          this.notHistory = false;
          let read = window.JSON.parse(window.localStorage.getItem('HistorySearchReport'));//读取数组
          this.defaultResult = read;
          this.Newarr = read;
        }
      },
      newBtnArr(str) {
        if (str.length >= 10) {
          return str = str.substring(0, 10) + '...';
        } else {
          return str
        }
      },
      //localStorage方法
      localStorageSystem(key, storage) {
        if (window.localStorage.getItem(key) !== null) {
          let read = window.JSON.parse(window.localStorage.getItem(key));//读取数组
          read = this.$array.ImpArr(read);
          read.unshift(storage);
          if (this.$array.unique(read).length > 10) {
            let arr = this.$array.unique(read).slice(0, 20);
            localStorage.setItem(key, window.JSON.stringify(arr));//存入localStorage
          } else {
            localStorage.setItem(key, window.JSON.stringify(this.$array.unique(read)));//存入localStorage
          }
        } else {
          localStorage.setItem(key, window.JSON.stringify([storage]));
        }
      },
      //点击按钮搜索
      searchList() {
        this.isSearch = true;
        let value = this.values.trim();
        let valArr;
        if (value.indexOf(" ") > -1) {
          valArr = value.split(" ");
          valArr = this.$array.ImpArr(valArr);
          value = valArr.join(",");
          let vel = valArr.join(" ");
          /*for (let i in valArr) {*/
          this.localStorageSystem("HistorySearchReport", vel);
          /*}*/
        } else {
          this.localStorageSystem("HistorySearchReport", value);
        }
        if (value == "" || value.length == 0) {
        } else {
          $("#searchReportText").blur();
          setTimeout(() => {
            this.$router.push({path: "/listReport", query: {value: value}});
          })
        }
      },
      //搜索.get("")
      searchInput() {
        if (this.values.trim().length === 0) {
          this.closeVal = false;
          this.prestrains = false;
          this.prestrain = [];
        } else {
          let value = "", valArr = [];
          this.closeVal = true;
          if (this.values.indexOf(" ") > -1) {
            valArr = this.values.split(" ");
            valArr = this.$array.ImpArr(valArr);
            value = valArr.join(",");
          } else {
            value = this.values;
          }
          console.log("==>", valArr, this.values.indexOf(" "));
          let params = {
            keyWord: value,
            pageSize: 10,
            pageNum: 1
          }
          this.$axios.report.searchReports(params).then(res => {
            if (res.data.returnObject.length == 0) {
              this.prestrains = false;
              this.prestrain = [];
            } else {
              this.prestrain = res.data.returnObject;
              this.prestrains = true;
            }
            //关键词高亮
            //---------------------------
          }).catch((err) => {
          });
        }
      },
      //input失去焦点
      searchBlur() {
        if (this.values.length === 0) {
          this.values = "";
          this.groupSearch = true;
          this.prestrains = false;
        }
      },
      //搜索的预提示
      gocontent(index) {
        var aa = this.values.trim();
        this.localStorageSystem("HistorySearchReport", aa);
        $("#searchReportText").blur();
        setTimeout(() => {
          this.$nextTick(() => {
            this.$router.push({path: '/report/details', query: {id: this.prestrain[index].id}});
          })
        }, 500)
      },
      //清除按钮
      dseClear() {
        window.localStorage.removeItem("HistorySearchReport");
        this.Newarr = [];
        this.notHistory = true;
      },
      //最近搜索按钮
      dseResultOne(index) {
        this.values = this.defaultResult[index];
        $('#searchReportText').focus();
        this.searchInput();
      },
      //input清除按钮
      closeInputVals() {
        this.values = '';
        this.closeVal = false;
        this.prestrains = false;
        $('#searchReportText').focus();
      }
    }
  }
</script>

<style>
  .dseResult button:last-child {
    margin-right: 0 !important;
  }
  .prestrains_div > span > span {
    margin-right: 0 !important;
  }
</style>

<style scoped lang="scss">
  input[type=search]::-webkit-search-cancel-button {
    -webkit-appearance: none; /*//此处就是去掉默认的小×*/
  }
  .searchReport {
    height: 100%;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    background-color: #FFFFFF;
  }
  #searchReport .searchS {
    width: 100%;
    height: 50px;
    background: #f0f1f5;
    padding: 7.5px 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #searchReport .seaBox {
    width: 90%;
    height: 100%;
    position: relative;
    background: white;
    border-radius: 2px;
    overflow: hidden;
  }
  #searchReport .seaBox input {
    width: 90%;
    height: 100%;
    background: #fff;
    color: #8d8d8d;
    display: inline-block;
    box-sizing: border-box;
    -webkit-appearance: none;
    border-radius: 2px;
    border: 0;
    font-size: 15px;
    padding: 7px 8px;
    outline: none;
  }
  .searchReport .seaBox input::-webkit-input-placeholder {
    font-weight: lighter !important;
  }
  .searchReport .icon-tripsousuo {
    font-size: 26px;
    color: #8d8d8d;
  }
  .searchReport .icon-shanchu, .icon-huanyipi2 {
    font-size: 16px;
  }
  .dsearch {
    height: 45px;
    line-height: 45px;
    padding: 0 12px;
    margin-top: 10px;
    box-sizing: border-box;
    background-color: white;
    z-index: 20;
  }
  .dseOver {
    border-top: 1px solid #f0f1f5;
  }
  .dsearch .dseText {
    font-size: 15px;
    color: #ffb148;
    display: inline-block;
    height: 45px;
  }
  .dsearch .dseClear {
    display: inline-block;
    float: right;
    height: 45px;
    font-size: 15px;
    color: #ffb148;
  }
  .dsearch .dseClear * {
    color: #ffb148;
  }
  .dsearch .dseClear:active {
    /*background-color: #f0f1f5;*/
    opacity: 0.4;
  }
  .dsearch .dseClear img {
    float: right;
    padding: 14.5px 0 0 3px;
    height: 15px;
    width: 15px;
    margin-top: 1px;
  }
  .dsearch .dsearchbox {
    display: inline-block;
    height: 15px;
    width: 2px;
    background-color: #ffb148;
    float: left;
    margin: 15px 3px 16px 0;
  }
  .dseResult {
    padding: 1px 12px 0 12px;
    box-sizing: border-box;
    position: relative;
    max-height: 118px;
    overflow: hidden;
  }
  #searchReport .dseResultDsearch {
    height: 180px;
  }
  .dseMixHeight {
    font-weight: lighter !important;
    max-height: 116px !important;
    z-index: 10 !important;
    overflow: hidden !important;
  }
  .dseResult button {
    display: inline-block;
    height: 30px;
    text-align: center;
    padding: 0 10px;
    font-size: 13px;
    border: 1px solid #e3e3e3;
    background-color: white;
    border-radius: 2px;
    color: #8d8d8d;
    margin: 0 10px 9px 0;
    z-index: 100;
  }
  .dseResult button:last-child {
    margin-right: 0;
  }
  .dseResult button:active {
    /*background-color: #f0f1f5;
    border-color: #f0f1f5;*/
    opacity: 0.4;
  }
  .dseResult .desResBox {
    padding-right: 12px;
  }
  #searchReport .prestrains {
    position: absolute;
    left: 0;
    width: 100%;
    top: 50px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: white;
    -webkit-overflow-scrolling: touch;
    z-index: 1000;
    ul {
      li {
        background-color: #FFFFFF;
        padding: 0 12px;
        .prestrains_div {
          height: 45px;
          line-height: 45px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 15px;
          text-align: justify;
        }
        &:active {
          background-color: #f0f1f5;
        }
      }
    }
  }
  /***************************************/
  #searchReport .showBox {
    height: 44px;
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    overflow: hidden;
    background-color: white;
    opacity: 0.5;
    z-index: 1000;
    display: none;
  }
  .snake-size {
    height: 20px !important;
    width: 20px !important;
  }
  .snake-circle {
    height: 20px;
    width: 20px;
    -webkit-animation: snake-rotate 0.8s infinite linear;
    animation: snake-rotate 0.8s infinite linear;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: rgb(246, 144, 12);
    border-left-color: rgb(246, 144, 12);
    border-bottom-color: rgb(246, 144, 12);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  @keyframes snake-rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  /***********************************/
  .HistoryS {
    padding: 10px 0 24px 0;
    text-align: center;
    font-size: 15px;
    color: #8d8d8d;
  }
  /*清除按钮*/
  .searchReport .closeInputVals {
    color: #c1c1c1;
  }
</style>
