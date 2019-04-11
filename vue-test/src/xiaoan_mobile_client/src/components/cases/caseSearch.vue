<template>
  <div id="caseSearch">
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
      <div class="" @click="searchList()"><i class="icon iconfont icon-tripsousuo"></i></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'caseSearch',
    data() {
      return {
        SIMvalues: '',
        placeholder: ''
      }
    },
    methods: {
      // input聚焦
      searchFocus() {
        $(".codeTip").hide();
      },
      // input失去焦点
      searchBlur() {
        if (this.values.length === 0) {
          this.values = "";
          document.querySelector('.groupDsearch').style.display = 'block';
          document.querySelector('.prestrain').style.display = 'none';
        }
      },
      // input清除按钮
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
      },
      // 证券代码联想获取
      searchInput1() {
        function removeAllSpace(str) {
          return str.replace(/\s+/g, "");
        }

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
      }
    }
  }
</script>
<style lang="scss">
  #caseSearch {
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
      .seabox {
        width: 91%;
        height: 100%;
        position: relative;
        background: #f0f1f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        input {
          width: 100%;
          height: 100%;
          background: #fff;
          color: #8d8d8d;
          display: inline-block;
          -webkit-appearance: none;
          border-radius: 2px;
          border: 0;
          font-size: 15px;
          padding: 8px;
          outline: none;
          font-weight: lighter !important;
          box-sizing: border-box;
        }
        @media screen and (max-width: 360px) {
          .search {
            .seabox {
              input {
                width: 100%;
                height: 100%;
                background: #fff;
                color: #8d8d8d;
                display: inline-block;
                -webkit-appearance: none;
                border-radius: 2px;
                border: 0;
                font-size: 15px;
                padding: 6px;
                outline: none;
                font-weight: lighter !important;
                box-sizing: border-box;
              }
            }
          }
        }
        .simpleBox {
          width: 35%;
          border-radius: 2px;
        }
        .ipvtextbox {
          width: 62%;
          background: white;
          border-radius: 2px;
          input {
            width: 90%;
          }
        }
      }
    }
  }

</style>
