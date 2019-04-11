<template>
  <transition name="bounce">
    <div class="search affiche-search">
      <div class="searchs">
        <div class="seabox">
          <div class="simpleBox">
            <form action="" onsubmit=" return false; ">
              <input id='simple' type="text" placeholder="证券简称/代码" @input="searchInput1" v-model="SIMvalues"
                     @keyup.13="searchList()">
              <img v-lazy="close" alt="" @click="closeInputVals1" class="closeInputVals1" style="right:67%;">
            </form>
          </div>
          <div class="ipvtextbox">
            <form action="" onsubmit=" return false; ">
              <input id="ipvtext" type="text" class="text" :placeholder="placeholder" @focus="searchFocus"
                     @blur="searchBlur" v-model="values" @input="searchInput"/>
              <img v-lazy="close" alt="" @click="closeInputVals" class="closeInputVals">
            </form>
          </div>
        </div>
        <div class="icon-search" @click="searchList()"><i class="icon iconfont icon-tripsousuo"></i></div>
      </div>
      <div class="groupDsearch">
        <!--最近搜索-->
        <div class="dsearch">
          <div class="dseText"><span class="dsearchbox"></span>{{dsearch}}</div>
          <div class="dseClear" @click="dseClear">{{cleartext}}&nbsp;<i class="icon iconfont icon-shanchu"></i>
          </div><!--清除按钮-->
        </div>
        <div class="HistoryS">您还没有历史记录！</div>
        <div class="dseResult dseMixHeight">
          <button :key="index" type="button" v-for="(list,index) in Newarr" @click="dseResultOne(index)">{{list}}
          </button>
          <div class="desResBox"></div>
        </div>
        <!--热门推荐-->
        <div class="dsearch dseOver">
          <div class="dseText"><span class="dsearchbox"></span>{{hotSearch}}</div>
          <div class="dseClear" @click="InABatchS">{{InAbatch}}&nbsp;<i class="icon iconfont icon-huanyipi"></i>
          </div>
        </div>
        <div class="dseResult">
          <button :key="index" type="button" v-for="(list,index) in hotResult" @click="dseResultTwo(index)">{{list}}
          </button>
        </div>
        <div class="showBox">
          <div class="snake-circle snake-size"></div>
        </div>
      </div>
      <!--提示搜索-->
      <div class="prestrain" id="preStar">
        <div :key="index" v-for="(list,index) in prestrain" @click="gocontent(index)">{{list.title}}</div>
      </div>
      <!--提示公司代码/简称-->
      <div class="codeTip">
        <div :key="index" class="codeTipText" v-for="(list,index) in codeTip" @click="companyContent(index)">
          <span style="font-size: 15px;font-weight: 600;color:#323232;">{{ list.name }}</span>
          <span style="color:#a2a2a2;font-weight: normal;margin-left: 8px;" v-html="key(list.code)"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'affiche-search',
    data() {
      return {
        close: this.$image.personal.close,
        loading: this.$image.rules.loading,
        clear: this.$image.rules.clear,
        InABatch: this.$image.rules.InABatch,
        dsearch: "最近搜索",
        hotSearch: '热门推荐',
        InAbatch: '换一批',
        cleartext: '清除',
        value: '',
        values: "",
        SIMvalues: "",
        prestrain: [],
        codeTip: [],//联想 公司代码/简称
        placeholder: "搜索公告名称",
        defaultResult: [],
        hotResult: [],
        top: 1,
        bottom: 15,
        num: '',
        Newarr: [],
        isSearch: false,
      };
    },
    created() {
      // console.log(this.$route.query.inputCode);
    },
    mounted() {
      clearInterval(window.timePianli)
      this.hotResults();
      //点击列表页的词块
      this.inputIss();
      //console.log(this.$route.query.valuess);
      this.localStorageAll();
      if (this.$route.query.inputCode == 1) {
        document.querySelector('#simple').focus();
      } else {
        document.querySelector('#ipvtext').focus();
      }
    },
    methods: {
      key(str) {
        var star = [];
        star = this.SIMvalues.trim().split(" ");
        for (var i = 0; i < star.length; i++) {
          if (star[i] == "" || typeof (star[i]) == "undefined") {
            star.splice(i, 1);
            i = i - 1;
          }
        }
        for (var i = 0; i < star.length; i++) {
          var fen = str.split(star[i]);
          str = fen.join('<span style="color:#ffc051;">' + star[i] + '</span>');
          if (/android/i.test(navigator.userAgent)) { //  android
            str = fen.join('<span style="color:#ffc051;">' + star[i] + '</span>');
          }
        }
        return str;
      },
      //传值是否存在,是否有逗号
      inputIss() {
        //console.log(this.$route.query.valuess);
        if (this.$route.query.valuess !== undefined) {
          if (this.$route.query.valuess.indexOf(",") !== -1) {
            var arr = this.$route.query.valuess.split(',');
            this.values = arr.join(" ");
          } else {
            this.values = this.$route.query.valuess;
          }
          document.querySelector('.closeInputVals').style.display = 'block';
        }
        if (this.$route.query.code !== undefined) {
          this.SIMvalues = this.$route.query.code;
          $(".closeInputVals1").show();
        }
      },
      //判断有localStorage
      localStorageAll() {
        console.log(window.localStorage.getItem('HistorySearchA'));
        if (window.localStorage.getItem('HistorySearchA') === null) {
          //没有localStorage的情况
          document.querySelector('.HistoryS').style.display = 'block';
          document.querySelector('.dseMixHeight').style.display = 'none';
        } else {
          document.querySelector('.dseMixHeight').style.display = 'block';
          document.querySelector('.HistoryS').style.display = 'none';
          var read = window.JSON.parse(window.localStorage.getItem('HistorySearchA'));//读取数组
          this.defaultResult = read;
          for (let i = 0; i < read.length; i++) {
            if (read[i].length > 10) {
              this.sArr = read[i].substring(0, 10) + "...";
            } else {
              this.sArr = read[i];
            }
            this.Newarr.push(this.sArr);
          }
        }
      },
      //获取热门推荐
      hotResults() {
        document.querySelector('.showBox').style.display = 'block';
        /*this.$http ({
          method: "GET",
          url: this.$api.disclosure.getHotSearch,
        })*/
        this.$axios.disclosure.getHotSearch({}).then((res) => {
          document.querySelector('.showBox').style.display = 'none';
          this.hotResult = res.data.returnObject;
        }).catch((err) => {
          console.log(err)
        });
      },
      //localStorage方法
      localStorageSystem(storage) {
        function unique(arr) {//数组去重
          var result = [];
          var obj = {};
          for (let i = 0; i < arr.length; i++) {
            if (!obj.hasOwnProperty(arr[i])) {
              result.push(arr[i]);
              obj[arr[i]] = 0;
            }
          }
          return result
        }
        if (window.localStorage.getItem('HistorySearchA') !== null) {
          let read = window.JSON.parse(window.localStorage.getItem('HistorySearchA'));//读取数组
          read.unshift(storage);
          console.log(read);
          if (unique(read).length > 10) {
            let arr = unique(read).slice(0, 10);
            localStorage.setItem('HistorySearchA', window.JSON.stringify(arr));//存入localStorage
          } else {
            localStorage.setItem('HistorySearchA', window.JSON.stringify(unique(read)));//存入localStorage
          }
        } else {
          localStorage.setItem('HistorySearchA', window.JSON.stringify([storage]));
        }
      },
      //点击按钮搜索
      searchList() {
        this.isSearch = true;
        if (this.SIMvalues.length !== 0 && this.values.trim().length == 0) {
          this.localStorageSystem(this.SIMvalues);
          let params ={
            key: this.SIMvalues,
          }
          this.$axios.common.autoComplete(params).then(res => {
            if (res.data.returnCode == 1) {
              this.codeTip = res.data.returnObject;
              console.log('this.codeTip', this.codeTip, res)
              this.$router.push({
                path: '/afficheList',
                query: {code: this.codeTip[0].fullCode, name: this.codeTip[0].name}
              });
            } else {
              this.$vux.toast.show({
                text: res.data.returnMsg,
                position: 'middle',
                type: 'text',
                width: 'auto',
                time: 2500
              });
            }
          }).catch((err) => {
            console.log(err);
            this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
          })
        } else if (this.SIMvalues.length == 0 && this.values.trim().length !== 0) {
          this.localStorageSystem(this.values);
          this.$router.push({path: '/searchList', query: {inputVal: this.values}});
        } else if (this.SIMvalues.length !== 0 && this.values.trim().length !== 0) {
          this.localStorageSystem(this.values);
          this.localStorageSystem(this.SIMvalues);
          this.$router.push({path: '/searchList', query: {inputVal: this.values, inputCode: this.SIMvalues}});
        }
      },
      //搜索.get("")
      searchInput() {
        if (this.values.trim().length === 0) {
          document.querySelector('.closeInputVals').style.display = 'none';
          document.querySelector('.prestrain').style.display = 'none';
        } else {
          //搜索公告名称关键字autocomplete
        }
      },
      //证券代码联想获取
      searchInput1() {
        function removeAllSpace(str) {
          return str.replace(/\s+/g, "");
        }

        //console.log(this.SIMvalues,removeAllSpace(this.SIMvalues))
        if (this.SIMvalues.length == 0) {
          $(".codeTip").hide();
          $(".closeInputVals1").hide();
        } else {
          this.SIMvalues = removeAllSpace(this.SIMvalues);
          document.querySelector('.closeInputVals1').style.display = 'block';
          $(".closeInputVals1").show();
          $(".codeTip").show();
          let params ={
            key: this.SIMvalues,
          }
          this.$axios.common.autoComplete(params).then(res => {
            this.codeTip = res.data.returnObject;
          }).catch((err) => {
            console.log(err)

          })
        }
      },
      //高亮方法
      keyCode(idVal, keyword, classs) {
        var hlValue = new RegExp("(" + keyword + ")(?=[^<>]*<)", "gi");
        $ID(idVal).innerHTML = $ID(idVal).innerHTML.replace(hlValue, "<span class=" + classs + ">$1</span>");

        /*getElement object*/
        function $ID(idVal) {
          return document.getElementById(idVal);
        }
      },
      //调用滚动
      searchHint(done) {
        this.searchInput();
        if (this.bottom >= this.num) {
          setTimeout(() => {
            done(true);
          }, 1500);
          return;
        }
        setTimeout(() => {
          this.bottom = this.bottom + 10;
          setTimeout(() => {
            done()
          })
        }, 1500)
      },
      //input聚焦
      searchFocus() {
        $(".codeTip").hide();
      },
      //input失去焦点
      searchBlur() {
        if (this.values.length === 0) {
          this.values = "";
          document.querySelector('.groupDsearch').style.display = 'block';
          document.querySelector('.prestrain').style.display = 'none';
        }
      },
      //搜索的预提示
      gocontent(index) {
        window.sessionStorage.setItem("afficheContentId", this.prestrain[index].mainId);
        this.$router.push({path: '/afficheContent', query: {id: this.prestrain[index].mainId}});
        this.localStorageSystem(this.values);
      },
      //公司代码提示点击跳转
      companyContent(index) {
        this.SIMvalues = this.codeTip[index].code;
        $(".codeTip").hide();
        //this.searchInput1();
      },
      //清除按钮
      dseClear() {
        window.localStorage.removeItem("HistorySearchA");
        this.Newarr = [];
        document.querySelector('.HistoryS').style.display = "block";
      },
      //点击换一换
      InABatchS() {
        this.hotResults();
      },
      //最近搜索按钮 //跳转至公告搜索结果列表页面
      dseResultOne(index) {
        var str = this.defaultResult[index];
        var pattern = /^[0-9]\d*$/;
        var flag = pattern.test(str);
        if (flag == true || str.indexOf('*st') >= 0 || str.indexOf('*ST') >= 0 || str.indexOf('ST') >= 0 || str.indexOf('st') >= 0 || str.indexOf('SH') >= 0 || str.indexOf('sh') >= 0 || str.indexOf('SZ') >= 0 || str.indexOf('sz') >= 0) { //公司代码/简称
          this.SIMvalues = this.defaultResult[index];
          document.querySelector('#simple').focus();
        } else if (flag == false) { //公告名称
          this.values = this.defaultResult[index];
          document.querySelector('#ipvtext').focus();
        }
      },
      //相关推荐按钮 //跳转至公告搜索结果列表页面
      dseResultTwo(index) {
        this.values = this.hotResult[index];
        if (this.isSearch) {
          this.localStorageSystem(this.hotResult[index]);
        }
      },
      //input清除按钮
      closeInputVals() {
        this.values = '';
        document.querySelector('.closeInputVals').style.display = 'none';
        document.querySelector('.prestrain').style.display = 'none';
        document.querySelector('#ipvtext').focus();
      },
      closeInputVals1() {
        this.SIMvalues = '';
        document.querySelector('.closeInputVals1').style.display = 'none';
        document.querySelector('.prestrain').style.display = 'none';
        document.querySelector('#simple').focus();
        $(".codeTip").hide();
      }
    }
  }
</script>

<style scoped lang="scss">
  .affiche-search {
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
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
      .seabox {
        width: 91%;
        height: 100%;
        position: relative;
        background: #f0f1f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .simpleBox {
          height: 100%;
          width: 36%;
          border-radius: 2px;
          form {
            width: 100%;
            height: 100%;
            input {
              width: 100%;
              height: 100%;
              background: #fff;
              color: #8d8d8d;
              display: inline-block;
              box-sizing: border-box;
              -webkit-appearance: none;
              border-radius: 2px;
              border: 0;
              font-size: 15px;
              padding: 0 8px;
              outline: none;
              font-weight: lighter;
              &::-webkit-input-placeholder {
                font-weight: lighter !important;
              }
            }
          }
        }
        .ipvtextbox {
          height: 100%;
          width: 62%;
          background: white;
          border-radius: 2px;
          form {
            width: 100%;
            height: 100%;
            input {
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
              padding: 0 8px;
              outline: none;
              font-weight: lighter;
              &::-webkit-input-placeholder {
                font-weight: lighter !important;
              }
            }
          }
        }
      }
      .icon-search {
        i {
          font-size: 25px;
          color: rgba(114, 114, 144, 1);
        }
      }
    }
  }
  .highlight {
    background: rgba(255, 255, 255, 0.4);
    color: #ffb148;
  }
  @media screen and (max-width: 360px) {
    .search .seabox input {
      width: 100%;
      height: 100%;
      background: #fff;
      color: #8d8d8d;
      display: inline-block;
      box-sizing: border-box;
      -webkit-appearance: none;
      border-radius: 2px;
      border: 0;
      font-size: 15px;
      padding: 6px;
      outline: none;
      font-weight: lighter !important;
    }
  }
  .search .icon-shanchu, .icon-huanyipi {
    font-size: 16px;
  }
  .dsearch {
    height: 45px;
    line-height: 45px;
    padding: 0 12px;
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
    color: #ffb148;
    font-size: 15px;
  }
  .dsearch .dseClear * {
    color: #ffb148;
  }
  .dsearch .dseClear img {
    float: right;
    padding: 14px 0 14px 3px;
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
    line-height: 30px;
  }
  .dseResult button:active {
    background-color: #f0f1f5;
    border-color: #f0f1f5;
  }
  .dseResult .desResBox {
    padding-right: 12px;
  }
  .prestrain, .codeTip {
    position: fixed;
    left: 0;
    width: 100%;
    top: 50px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: white;
    display: none;
  }
  .prestrain div, .codeTip div {
    height: 45px;
    line-height: 45px;
    padding: 0 14px 0 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    background-color: white;
    border-bottom: 1px solid #e3e3e3;
  }
  /***************************************/
  .showBox {
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
    margin: 0 auto;
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
    padding: 10px 0 25px 0;
    text-align: center;
    display: none;
    font-size: 15px;
    color: #8d8d8d;
  }
  /*清除按钮*/
  .search .closeInputVals, .search .closeInputVals1 {
    position: absolute;
    top: 9.5px;
    right: 2%;
    height: 16px;
    display: none;
  }
</style>
