<template>
  <div id="inputS">
    <div class="searchs" v-if="iType == 'search'">
      <div class="seabox">
        <form action="" onsubmit=" return false;">
          <input ref="ipvtextDom" autofocus="autofocus" id="ipvtext" type="search" class="text"
                 :placeholder="placeholder"
                 @blur="searchBlur" v-model="value" @input="searchInput" @keyup.13="searchList"/>
          <!--<i class="icon iconfont closeInputVals icon-X" @click="closeInputVal"
             v-show="closeInputVals"></i>-->
        </form>
      </div>
      <div class="" @click="searchList"><i class="icon iconfont icon-tripsousuo"></i></div>
    </div>

    <div class="searchs router" v-if="iType == 'router'">
      <div class="seabox" @click="link">
        <form action="" onsubmit=" return false;">
          <input ref="ipvtextDom" autofocus="autofocus" type="search" class="text"
                 :placeholder="text"/>
        </form>
      </div>
      <div class="" @click="searchList"><i class="icon iconfont icon-tripsousuo"></i></div>
      <p class="question" @click="ask">
        <i class="icon iconfont icon-bianji"></i>
        <span>提问</span>
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'inputS',
    data () {
      return {
        value: '',
        placeholder: '搜索关键词，全文精确搜索',
        closeInputVals: true
      }
    },
    props: {
      iType: {
        type: String,
        default: 'search'
      },
      text: {
        type: String,
        default: '搜索关键词，全文精确搜索'
      }
    },
    methods: {
      ask () {
        this.$emit('ask')
      },
      link () {
        this.$emit('link')
      },
      searchBlur () {

      },
      searchInput () {

      },
      searchList () {

      },
      closeInputVal () {

      }
    }
  }
</script>
<style lang="scss">
  #inputS {
    .searchs {
      width: 100%;
      height: 56px;
      background: #f0f1f5;
      padding: 10.5px 12px;
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
        box-sizing: border-box;
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
          font-size: 24px;
          color: #8d8d8d;
        }
      }
    }
    .router {
      position: relative;
      .seabox {
        position: static;width: 83%;
        form {
          input {
            width: 100%;
            padding: 7px 8px 7px 32px;
          }
        }
      }
      div {
        position: absolute;
        left: 20px;
        top: 18px;
        .icon-tripsousuo {
          font-size: 18px;
          color: #8d8d8d;
        }
      }
      .question {
        color:#ffb148;font-size: 15px;
        i{
          font-size: 18px;color:#ffb148;
        }
      }
    }
  }
</style>
