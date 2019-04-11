<template>
  <transition name="bounce">
    <div class="search" id="search" ref="searchDom">
      <div class="searchs">
        <div class="seabox">
          <form action="" onsubmit=" return false">
            <input ref="ipvtextDom" id="ipvtext" type="search" class="text" :placeholder="placeholder"
                   @blur="searchBlur" v-model="values" @input="searchInput" @keyup.13="searchList"/>
            <i class="icon iconfont closeInputVals icon-X" @click="closeInputVal()"
               v-show="closeInputVals"></i>
          </form>
        </div>
        <div class="" @click="searchList()"><i class="icon iconfont icon-tripsousuo"></i></div>
      </div>
      <div class="groupDsearch" :style="{height:perHeight+'px'}" ref="groupDom">
        <!--最近搜索-->
        <div class="dsearch">
          <div class="dseText" id="dseText"><span class="dsearchbox"></span>{{dsearch}}</div>
          <div class="dseClear" @click="dseClear()">{{cleartext}}&nbsp;<i
            class="icon iconfont icon-shanchu"></i>
          </div>
        </div>
        <div class="HistoryS" v-show="HistoryS">{{HistoryText}}</div>
        <div class="dseResult dseMixHeight" v-show="!HistoryS">
          <button class="vux-1px" type="button" v-for="(list,index) in Newarr" @click="dseResultOne(index)">
            {{newBtnArr(list)}}
          </button>
          <div class="desResBox"></div>
        </div>
        <!--相关推荐-->
        <div class="dsearch dseOver">
          <div class="dseText"><span class="dsearchbox"></span>{{hotSearch}}</div>
          <div class="dseClear" @click="InABatchS()">{{InAbatch}}&nbsp;<i
            class="icon iconfont icon-huanyipi2"></i>
          </div>
        </div>
        <div class="dseResult dseResultDsearch">
          <button class="vux-1px" type="button" v-for="(list,index) in hotResult" @click="dseResultTwo(index)">
            {{list}}
          </button>
          <xiaoan-loading v-show="showLoading" borderWidth="2px" width="18px"></xiaoan-loading>
        </div>
      </div>
      <!--提示搜索-->
      <transition name="bounce">
        <ul class="prestrains" id="preStar" v-show="prestrains" :style="{height:perHeight+'px'}">
          <li v-for="(list,index) in prestrain" @click="gocontent(index)">
            <p class="prestrains_div vux-1px-b" v-html="key(list.title)"></p>
          </li>
        </ul>
      </transition>
    </div>
  </transition>
</template>

<script>
  import loading from "@/components/warning/loading.vue"

  export default {
    name: 'search',
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
        HistoryText: "您还没有历史记录！",
        value: '',
        values: "",
        prestrain: [],
        placeholder: "搜索法规名称，多个关键字空格隔开",
        defaultResult: [],
        hotResult: [],
        top: 1,
        bottom: 15,
        num: '',
        Newarr: [],
        showLoading: false,
        isSearch: false,
        prestrains: false,
        closeInputVals: false,
        HistoryS: true,
        perHeight: ''
      }
    },
    components: {
      'xiaoan-loading': loading
    },
    created() {
      //
      this.hotResults();
      // 点击列表页的词块
      this.inputIss();
      //
      this.localStorageAll();
      //
      if (this.values.trim().length != 0) {
        this.closeInputVals = true;
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.perHeight = this.$refs.searchDom.clientHeight - this.$refs.groupDom.offsetTop;
      });
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs.ipvtextDom) {
            this.$refs.ipvtextDom.focus();
          }
          console.warn('聚焦成功！');
          document.getElementById('ipvtext').addEventListener('click', function (event) {
            (this || delegate.obj || event).focus();
            document.getElementById('ipvtext').click();
          }, false);
        })
      }, 1300)
    },
    destroyed() {
      //  document.onkeyup = this.keyUp();
    },
    methods: {
      //
      keyUp(e) {
        let currKey = 0;
        // const e = (e || event);
        currKey = e.keyCode || e.which || e.charCode;
        let keyName = String.fromCharCode(currKey);
        console.log("按键码: " + currKey + " 字符: " + keyName);
      },
      // 传值是否存在,是否有逗号
      inputIss() {
        console.log(this.$route.query.valuess);
        if (this.$route.query.valuess !== undefined) {
          if (this.$route.query.valuess.indexOf(",") !== -1) {
            var arr = this.$route.query.valuess.split(',');
            this.values = arr.join(" ");
          } else {
            this.values = this.$route.query.valuess;
          }
        }
      },
      // 判断有localStorage
      localStorageAll() {
        console.log(window.localStorage.getItem('HistorySearch'));
        if (window.localStorage.getItem('HistorySearch') === null) {
          //没有localStorage的情况
          this.HistoryS = true;
        } else {
          this.HistoryS = false;
          var read = window.JSON.parse(window.localStorage.getItem('HistorySearch'));//读取数组
          this.defaultResult = read;
          this.Newarr = read;
        }
      },
      //
      newBtnArr(str) {
        if (str.length >= 10) {
          return str = str.substring(0, 10) + '...';
        } else {
          return str
        }
      },
      // 获取热门推荐
      hotResults() {
        this.showLoading = true;
        this.$axios.law.getHotSearch().then(res => {
          if (res.data.returnCode == 1) {
            this.showLoading = false;
            this.hotResult = res.data.returnObject;
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      // localStorage方法
      localStorageSystem(storage) {
        console.log(storage)
        if (window.localStorage.getItem('HistorySearch') !== null) {
          let read = window.JSON.parse(window.localStorage.getItem('HistorySearch'));//读取数组
          read.unshift(storage);
          if (this.unique(read).length > 10) {
            let arr = this.unique(read).slice(0, 10);
            localStorage.setItem('HistorySearch', window.JSON.stringify(arr)); // 存入localStorage
          } else {
            localStorage.setItem('HistorySearch', window.JSON.stringify(this.unique(read)));//存入localStorage
          }
        } else {
          localStorage.setItem('HistorySearch', window.JSON.stringify([storage]));
        }
      },
      // *保存状态*/
      shous() {
        var titleI = [], contentI = [], key = "";
        if (window.localStorage.getItem("titleIME") == null) {
          console.log("titleIME");
        } else {
          titleI = window.localStorage.getItem("titleIME").split("$#");
        }
        /**/
        if (window.localStorage.getItem("contentIME") == null) {
          console.log("contentIME");
        } else {
          contentI = window.localStorage.getItem("contentIME").split("$#");
        }
        /**/
        if (window.localStorage.getItem("keyIME") == null) {
          console.log("keyIME");
        } else {
          key = window.localStorage.getItem("keyIME");
        }
        /**/
        if (window.localStorage.getItem("colorBtn") === null) {
          //首次进入
          console.log("123colorBtn", this.values);
          window.localStorage.setItem("colorBtn", "标题$#精确");
          window.localStorage.setItem("BtnMany", "标题$#精确");
          var newVal = this.values.trim().split(" ");
          this.ImpArr(newVal);
          newVal = this.unique(newVal);
          var news = newVal.join(",");
          var newtitleIME = news + "$#" + "$#";
          window.localStorage.setItem("titleIME", newtitleIME);
          console.log("newtitleIME", newtitleIME, newVal, this.values.trim().split(" "));
        } else {
          //再次进入
          var colorBt = window.localStorage.getItem("colorBtn");
          var scolorBtn = colorBt.split("$#");
          /**/
          if (scolorBtn[0] == "标题" && scolorBtn[1] == "精确") {
            var newVal = this.values.trim().split(" ");
            this.ImpArr(newVal);
            newVal = this.unique(newVal);
            var news = newVal.join(",");
            var newtitleIME = news + "$#" + titleI[1] + "$#" + titleI[2];
            window.localStorage.setItem("titleIME", newtitleIME);
            console.log("newtitleIME", newtitleIME, newVal, this.values.trim().split(" "));
            /**/
          } else if (scolorBtn[0] == "全文" && scolorBtn[1] == "精确") {
            var newVal = this.values.trim().split(" ");
            this.ImpArr(newVal);
            newVal = this.unique(newVal);
            var news = newVal.join(",");
            var newcontentIME = news + "$#" + contentI[1] + "$#" + contentI[2];
            window.localStorage.setItem("contentIME", newcontentIME);
            console.log("newcontentIME", newcontentIME, newVal, this.values);
          } else {
            var newVal = this.values.trim().split(" ");
            this.ImpArr(newVal);
            newVal = this.unique(newVal);
            var news = newVal.join(",");
            window.localStorage.setItem("keyIME", news);
            console.log("news", news, newVal, this.values.trim().split(" "));
          }
        }
      },
      // 数组去重
      unique(arr) {
        var result = [];
        var obj = {};
        for (let i = 0; i < arr.length; i++) {
          if (!obj.hasOwnProperty(arr[i])) {
            result.push(arr[i]);
            obj[arr[i]] = 0;
          }
        }
        return result
      },
      // 去除空数组
      ImpArr(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === "" || typeof(array[i]) === "undefined") {
            array.splice(i, 1);
            i = i - 1;
          }
        }
      },
      // 点击按钮搜索
      searchList() {
        this.isSearch = true;
        if (this.values.trim().length != 0) {
          var aa = this.values.trim();

          this.localStorageSystem(aa);
          this.shous();
          this.$router.push({path: '/rule/list', query: {inputVal: this.values}});
        } else {
        }
      },
      // 搜索.get("")
      searchInput() {
        if (this.values.trim().length === 0) {
          this.closeInputVals = false;
          this.prestrains = false;
          this.prestrain = [];
        } else {
          let value = "", valArr = [];
          this.closeInputVals = true;
          if (this.values.indexOf(" ") > -1) {
            valArr = this.values.split(" ");
            valArr = this.$array.ImpArr(valArr);
            value = valArr.join(",");
          } else {
            value = this.values;
          }
          console.log("==>", valArr, this.values.indexOf(" "));
          let params = {
              title: value,
            }
          this.$axios.law.autoComplete(params).then(res => {
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
            console.error(err);
          });
        }
      },
      // 高亮方法
      key(str) {
        var star = [];
        star = this.values.trim().split(" ");
        for (var i = 0; i < star.length; i++) {
          if (star[i] == "" || typeof(star[i]) == "undefined" || star[i] == 0 || star[i] == 1
            || star[i] == 2 || star[i] == 3 || star[i] == 4 || star[i] == 5 || star[i] == 6 || star[i] == 7 || star[i] == 8 || star[i] == 9) {
            star.splice(i, 1);
            i = i - 1;
          }
        }
        /*console.log("432453", star);*/
        for (var i = 0; i < star.length; i++) {
          var fen = str.split(star[i]);
          str = fen.join('<span style="color:#ffc051;">' + star[i] + '</span>');
        }
        return str;
      },
      // input失去焦点
      searchBlur() {
        if (this.values.length === 0) {
          this.values = "";
          $('.groupDsearch').show();
          this.prestrains = false;
        }
      },
      // 搜索的预提示
      gocontent(index) {
        var aa = this.values.trim();
        this.localStorageSystem(aa);
        $("#ipvtext").blur();
        setTimeout(() => {
          this.$nextTick(() => {
            this.$router.push({
              path: '/rule/details',
              query: {id: this.prestrain[index].id}
            });
          })
        }, 500)
      },
      // 清除按钮
      dseClear() {
        window.localStorage.removeItem("HistorySearch");
        this.Newarr = [];
        this.HistoryS = true;
      },
      // 点击换一换
      InABatchS() {
        this.hotResults();
      },
      // 最近搜索按钮
      dseResultOne(index) {
        this.values = this.defaultResult[index];
        this.searchInput();
        document.querySelector('#ipvtext').focus();
        //this.$router.push({path: '/ruleslist', query: {inputVal: this.defaultResult[index]}});
      },
      // 相关推荐按钮
      dseResultTwo(index) {
        this.values = this.hotResult[index];
        this.searchInput();
        document.querySelector('#ipvtext').focus();
        if (this.isSearch) {
          this.localStorageSystem(this.hotResult[index]);
        }
      },
      // input清除按钮
      closeInputVal() {
        this.values = '';
        this.closeInputVals = false;
        this.prestrains = false;
        document.querySelector('#ipvtext').focus();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .search {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
  }
  #search {
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
        width: 90%;
        height: 100%;
        position: relative;
        background: white;
        border-radius: 2px;
        overflow: hidden;
        form {
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
            padding: 7px 8px;
            outline: none;
          }
          input[type=search]::-webkit-search-cancel-button {
            -webkit-appearance: none; /*//此处就是去掉默认的小×*/
          }
          input::-webkit-input-placeholder {
            font-weight: lighter !important;
          }
          i {
            color: #c1c1c1;
          }
        }
      }
      div {
        .icon-tripsousuo {
          font-size: 26px;
          color: #8d8d8d;
        }
      }
    }
    .groupDsearch {
      padding-top: 10px;
      box-sizing: border-box;
      .dsearch {
        height: 45px;
        line-height: 45px;
        padding: 0 12px;
        box-sizing: border-box;
        background-color: white;
        z-index: 20;
        .icon-shanchu, .icon-huanyipi2 {
          font-size: 16px;
        }
        .dseText {
          font-size: 15px;
          color: #ffb148;
          display: inline-block;
          height: 45px;
        }
        .dseClear {
          display: inline-block;
          float: right;
          height: 45px;
          font-size: 15px;
          color: #ffb148;
          img {
            float: right;
            padding: 14.5px 0 0 3px;
            height: 15px;
            width: 15px;
            margin-top: 1px;
          }
          * {
            color: #ffb148;
          }
        }
        .dseClear:active {
          /*background-color: #f0f1f5;*/
          opacity: 0.4;
        }
        .dsearchbox {
          display: inline-block;
          height: 15px;
          width: 2px;
          background-color: #ffb148;
          float: left;
          margin: 15px 3px 16px 0;
        }

      }
      .dseOver {
        border-top: 1px solid #f0f1f5;
      }
      .HistoryS {
        padding: 10px 0 24px 0;
        text-align: center;
        font-size: 15px;
        color: #8d8d8d;
      }
      .dseResult {
        padding: 1px 12px 0 12px;
        box-sizing: border-box;
        position: relative;
        button {
          display: inline-block;
          height: 30px;
          text-align: center;
          padding: 0 10px;
          font-size: 13px;
          border: 0;
          background-color: white;
          border-radius: 2px;
          color: #8d8d8d;
          margin: 0 10px 9px 0;
          z-index: 100;
          -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        button:last-child {
          margin-right: 0 !important;
        }
        button:active {
          background-color: #f0f1f5;
          border-color: #f0f1f5;
          -webkit-transition: background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .desResBox {
          padding-right: 12px;
        }
      }
      .dseResultDsearch {
        height: 180px;
      }
      .dseMixHeight {
        font-weight: lighter !important;
        max-height: 116px !important;
        z-index: 10 !important;
        overflow: hidden !important;
      }
    }
    .prestrains {
      position: absolute;
      left: 0;
      width: 100%;
      top: 50px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: white;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      z-index: 1000;
      list-style-type: none;
      li {
        padding: 0 12px;
        list-style-type: none;
        width: 100%;
        height: 45px;
        line-height: 1;
        font-size: 15px;
        background-color: white;
        box-sizing: border-box;
        -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        .prestrains_div {
          float: left;
          height: 45px;
          line-height: 45px;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: justify;
        }
      }
      li:active {
        background-color: #f0f1f5;
        -webkit-transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
    .highlight {
      background: rgba(255, 255, 255, 0.4);
      color: #ffb148;
    }
  }
</style>
