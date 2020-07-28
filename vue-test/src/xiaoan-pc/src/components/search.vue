<template>
  <div class="searchArea" v-if="sort == 'rule'">
    <input type="text" v-model="inputTexts" :placeholder="placeholder[1]" @keyup.13="goSearch">
    <span class="searchButton" @click="goSearch">{{ searchValue[0] }}</span>
  </div>
  <div class="searchArea affiche" v-else-if="sort == 'cases' || sort == 'affiche' || sort == 'report'">
    <el-popover
      ref="popoverauto"
      placement="bottom"
      width="205"
      trigger="click"
      popper-class="ele-popover"
      v-on:click="selectCode">
      <ul class="popul">
        <li v-if="index<5" v-for="(list,index) in gridData" :key="index" @click="selectCode(index)">
          <span v-html="$common.highlight(inputCodes,list.code)"></span>
          <span>{{ list.name }}</span>
        </li>
      </ul>
    </el-popover>
    <input type="text" v-popover:popoverauto @focus="loadCode" @input="loadCode"
           class="afficheInputCode"
           v-model="inputCodes" @change="setValue"
           :placeholder="placeholder[2]" @keyup.13="goSearch">
    <input type="text" v-model="inputTexts" class="afficheInputText"
           :placeholder="placeholder[0]"
           @keyup.13="goSearch" v-if="sort == 'cases'">
    <input type="text" v-model="inputTexts" :placeholder="placeholder[3]" @keyup.13="goSearch"
           v-else-if="sort == 'affiche'"
           class="afficheInputText">
    <input type="text" v-model="inputTexts" placeholder="请输入研报关键词" @keyup.13="goSearch"
           class="afficheInputText inputReport" v-else-if="sort == 'report'">

    <!--<div v-else-if="sort == 'report'" class="reportInput">-->
      <!--<input type="text" v-model="inputName" placeholder="作者" @keyup.13="goSearch"-->
             <!--class="afficheInputText inputName">-->
      <!--<input type="text" v-model="inputTexts" placeholder="请输入研报关键词" @keyup.13="goSearch"-->
             <!--class="afficheInputText inputReport">-->
    <!--</div>-->
    <span class="searchButton" @click="goSearch">{{ searchValue[0] }}</span>
  </div>
</template>
<script>
  export default {
    name: 'searchArea',
    data () {
      return {
        placeholder: ['请输入感兴趣的案例名称，如：违规减持', '请输入法规关键词，多关键词用空格隔开，如：股东 减持', '证券代码/简称', '请输入公告名称，多关键词用空格隔开', '请输入研报名称，多关键词用空格隔开'],
        searchValue: ['搜 索'],
        inputTexts: '',
        inputCodes: '',
        gridData: []
      }
    },
    props: {
      sort: {
        type: String,
        default: 'rule'
      },
      inputVal: {
        type: String,
        default: ''
      },
      searchCode: {
        type: String,
        default: ''
      }
    },
    watch: {
      inputVal () {
        this.inputTexts = this.inputVal
      },
      searchCode () {
        this.inputCodes = this.searchCode
      }
    },
    methods: {
      // selectText
      selectCode (e) {
        this.inputCodes = this.gridData[e].code
        this.setStore(this.inputCodes)
      },
      // inputFocus
      inputFocus () {
        this.autoComplete()
      },
      // autocomplete
      loadCode () {
        this.inputCodes = this.inputCodes ? this.inputCodes : ''
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: this.inputCodes
          }
        }).then((res) => {
          console.log('loadCode', res)
          if (res.data.returnCode == 1) {
            this.gridData = res.data.returnObject
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            type: 'success',
            duration: 3000,
            message: err.message
          })
        })
      },
      setStore (code) {
        this.$store.commit('INPUTCODE', code)
      },
      setValue () {
        this.setStore(this.inputCodes)
      },
      goSearch () {
        // console.log(this.inputTexts, this.sort)
        if (this.inputTexts.length === 1) {
          this.$message({
            showClose: true,
            type: 'warning',
            duration: 3000,
            message: '关键词至少填写两个字！'
          })
          return false
        } else {
          this.$emit('searchM', this.inputTexts, this.sort, this.inputCodes)
        }
      }
    }
  }
</script>
<style lang="scss">
  .ele-popover {
    padding: 12px 0;
    .popul {
      max-height: 210px;
      padding: 0 0 !important;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      li {
        padding: 10px 12px;
        box-sizing: border-box;
        border-radius: 0;
        // margin: 0 0 10px 0;
        // font-size: 20px;
      }
      li:hover {
        background: rgba(240, 241, 245, .6);
        /*span {*/
          /*color: white !important;*/
        /*}*/
      }
      li:last-child {
        margin: 0 0 0 0;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .searchArea {
    width: 100%;
    height: 45px;
    border-radius: 4px;
    overflow: hidden;
    /* .searchButton{
      &:active{
        background: #fff;
      }
    } */
    input {
      display: inline-block;
      width: 85%;
      height: inherit;
      border: 0;
      -webkit-appearance: none;
      font-size: 18px;
      padding-left: 15px;
      box-sizing: border-box;
      font-weight: normal !important;
      background: rgba(255,255,255,.8);
      caret-color:#ffb148;
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #8d8d8d;
      font-weight: 300 !important;
    }
    input:-moz-placeholder, textarea:-moz-placeholder {
      color: #8d8d8d;
      font-weight: 300 !important;
    }
    input::-moz-placeholder, textarea::-moz-placeholder {
      color: #8d8d8d;
      font-weight: 300 !important;
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #8d8d8d;
      font-weight: 300 !important;
    }
    .searchButton {
      width: 15%;
      height: 100%;
      float: right;
      line-height: 45px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      font-weight: normal !important;
      cursor: pointer;
      background: #ffb147;
      background: -webkit-linear-gradient(left, #ffb147, #e89423); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #ffb147, #e89423); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #ffb147, #e89423); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #ffb147, #e89423); /* 标准的语法 */
    }
  }
  .affiche {
    input {
      border-radius: 4px;
      float: left;
    }
    input:first-child, .afficheInputCode {
      width: 24% ;
      margin-right: 1%;
    }
    /* input:nth-child(2) {
      width: 60% !important;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    } */
    .afficheInputText {
      width: 60% !important;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .searchButton {
      float: right !important;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  .reportInput{
    height: 100%; width: 64%; float: left;
    .inputName {
      width: 29%!important;border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .inputReport {
      width: 69.5%!important;margin-left: 0.5%;
    }
  }
</style>
