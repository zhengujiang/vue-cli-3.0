<template>
  <div id="publishSearch">
    <div class="searchs">
      <div class="seabox">
        <input ref="ipvtextDom" autofocus="autofocus" id="ipvtext" type="search" class="text"
               :placeholder="placeholder"
               @blur="searchBlur()" @focus="handleinput()" v-model="values" @input="searchInput()"
               @keyup.13="searchList()"/>
        <i class="icon iconfont closeInputVals icon-X" @click="closeInputVal()"
           v-show="closeInputVals"></i>
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
        <button type="button" v-for="(list,index) in Newarr" @click="dseResultOne(index)">
          {{newBtnArr(list)}}
        </button>
        <div class="desResBox"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "publishSearch",
    data() {
      return {
        values: "",
        placeholder: "搜索关键词,多个关键词空格隔开",
        closeInputVals: "",
        dsearch: "最近搜索",
        HistoryText: "您还没有历史记录！",
        cleartext: '清除',
        Newarr: [],
        HistoryS: true,
        perHeight: "",
        defaultResult: []
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.localStorageAll()
      if (this.$route.query.inputVal) {
        this.values = this.$route.query.inputVal
      }
    },
    mounted() {

    },
    // 方法
    methods: {
      closeInputVal() {
        this.values = ""
        this.closeInputVals = false
      },
      handleinput() {
        // console.log("222")
      },
      searchBlur() {
        // console.log("3333")
      },
      searchInput() {
        // console.log(this.values)
        if (this.values.trim() == "" || this.values == null) {
          this.closeInputVals = false
        } else {
          this.closeInputVals = true
        }
      },
      searchList() {
        if (!this.$array.trim(this.values)) {
          this.$vux.toast.show({text: '请输入搜索关键词', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return false
        }
        if (this.$array.trim(this.values).length < 2) {
          this.$vux.toast.show({text: '搜索内容大于二个字符', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return false
        }

        this.localStorageSystem(this.values)
        this.$router.push({path: '/ipo/list', query: {inputVal: this.values}})
      },
      dseResultOne(index) {
        this.values = this.defaultResult[index];
        this.searchInput();
        document.querySelector('#ipvtext').focus();
      },
      // 清除按钮
      dseClear() {
        window.localStorage.removeItem("ipoHistorySearch");
        this.Newarr = [];
        this.HistoryS = true;
      },
      // 判断有localStorage
      localStorageAll() {
        console.log("222", window.localStorage.getItem('ipoHistorySearch'));
        if (window.localStorage.getItem('ipoHistorySearch') === null) {
          //没有localStorage的情况
          this.HistoryS = true;
        } else {
          this.HistoryS = false;
          var read = window.JSON.parse(window.localStorage.getItem('ipoHistorySearch')); //读取数组
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
      // localStorage方法
      localStorageSystem(storage) {
        if (window.localStorage.getItem('ipoHistorySearch') !== null) {
          let read = window.JSON.parse(window.localStorage.getItem('ipoHistorySearch'));//读取数组
          read.unshift(storage);
          if (this.unique(read).length > 10) {
            let arr = this.unique(read).slice(0, 10);
            localStorage.setItem('ipoHistorySearch', window.JSON.stringify(arr)); // 存入localStorage
          } else {
            localStorage.setItem('ipoHistorySearch', window.JSON.stringify(this.unique(read)));//存入localStorage
          }
        } else {
          localStorage.setItem('ipoHistorySearch', window.JSON.stringify([storage]));
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
          if (array[i] == "" || typeof(array[i]) == "undefined") {
            array.splice(i, 1);
            i = i - 1;
          }
        }
        console.log("type", array)
        return array
      },

    }
  }
</script>

<style lang="scss">
  #publishSearch {
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
        .icon-shanchu {
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
          border: 1px solid #e3e3e3;
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
      .dseMixHeight {
        font-weight: lighter !important;
        max-height: 116px !important;
        z-index: 10 !important;
        overflow: hidden !important;
      }
    }
  }
</style>
