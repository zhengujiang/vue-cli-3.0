<template>
  <div id="electron-test">
    <e-head class="head-pos" :name="companyName" :index="swVal"></e-head>
    <swiper height="100%" :min-moving-distance="1000" :show-dots="false" v-model="swVal" @on-index-change="swChange">
      <swiper-item>
        <div class="test1">
          <label class="title">预估市值</label>
          <group class="select-group" :gutter="0">
            <popup-picker value-text-align="left" popup-title="请选择" :title="''" :data="list1" v-model="value1"
                          placeholder="请选择">
            </popup-picker>
          </group>
          <div class="bg text"><b>投资人的认可，是登陆科创板的一张船票</b></div>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="test1">
          <label class="title">最近一年营业收入</label>
          <group class="select-group" :gutter="0">
            <popup-picker value-text-align="left" popup-title="请选择" :title="''" :data="list2" v-model="value2"
                          placeholder="请选择">
            </popup-picker>
          </group>
          <div class="bg text"><b>营收多一点，科创板近一点</b></div>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="test1">
          <label class="title">最近两年累计净利润</label>
          <group class="select-group" :gutter="0">
            <popup-picker value-text-align="left" popup-title="请选择" :title="''" :data="list3" v-model="value3"
                          placeholder="请选择">
            </popup-picker>
          </group>
          <div class="bg text"><b>没有盈利？科创板也不一定在意</b></div>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="test1">
          <label class="title">最近三年研发投入占营业收入比例</label>
          <group class="select-group" :gutter="0">
            <popup-picker value-text-align="left" popup-title="请选择" :title="''" :data="list4" v-model="value4"
                          placeholder="请选择">
            </popup-picker>
          </group>
          <div class="bg text"><b>真正的科学技术引领科创板前行</b></div>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="test1">
          <label class="title">最近三年经营活动产生的现金流量净额</label>
          <group class="select-group" :gutter="0">
            <popup-picker value-text-align="left" popup-title="请选择" :title="''" :data="list5" v-model="value5"
                          placeholder="请选择">
            </popup-picker>
          </group>
          <!--<div class="bg text"><b>真正的科学技术引领科创板前行</b></div>-->
        </div>
      </swiper-item>
      <swiper-item>
        <div class="test1">
          <label class="title">选择公司所属行业</label>
          <group class="select-group" :gutter="0">
            <popup-picker :columns="2" value-text-align="left" popup-title="请选择" :title="''" :data="list6"
                          v-model="value6"
                          placeholder="请选择">
            </popup-picker>
          </group>
          <div class="bg text"><b>三百六十行，哪一行是科创板的最爱？</b></div>
        </div>
      </swiper-item>
    </swiper>
    <div class="btn flex-box">
      <button class="pev" :class="swVal == 0?'disabled':''" @click="pevChange">上一步</button>
      <button class="next" @click="nextChange">{{swVal == 5?'生成结果':'下一步'}}</button>
    </div>
    <!--<x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="show = true">iOS Gradients</x-button>-->
  </div>
</template>

<script>
  import EHead from './components/head'
  import {PopupPicker, Group, Swiper, SwiperItem, XDialog, XButton, TransferDomDirective as TransferDom} from 'vux'
  export default {
    name: "electron",
    directives: {
      TransferDom
    },
    components: {
      PopupPicker, Group, XDialog, XButton, Swiper, SwiperItem, EHead
    },
    data() {
      return {
        list1: [],
        value1: [],
        list2: [],
        value2: [],
        list3: [],
        value3: [],
        list4: [],
        value4: [],
        list5: [],
        value5: [],
        list6: [],
        value6: [],
        //
        swVal: 0,
        show: false,
        companyName: '信公小安'
      }
    },
    created() {
      this.getConditions();
      if (this.$route.query.name) {
        this.companyName = decodeURIComponent(this.$route.query.name);
      }
    },
    watch: {
      swVal: function (val) {

      }
    },
    mounted() {
      let shareTitle = "测一测，你能登陆科创板吗？";
      let shareDesc = "科创板原来离我这么近"; // 描述
      let shareLink = window.location.href; // 分享链接
      this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
    },
    methods: {
      getConditions() {
        this.$axios.cotrun.getConditions().then(res => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            console.log(res.data.returnObject);
            this.list1 = [data.marketValueList.map((e, i) => {
              return e.name
            })];
            this.list2 = [data.takingList.map((e, i) => {
              return e.name
            })]
            this.list3 = [data.profitList.map((e, i) => {
              return e.name
            })]
            this.list4 = [data.researchList.map((e, i) => {
              return e.name
            })]
            this.list5 = [data.cashTotalList.map((e, i) => {
              return e.name
            })]
            let temp = [];
            data.industryListInfo.forEach((e, i) => {
              temp.push({name: e.industryName, value: e.industryName, parent: 0});
              e.industryList.forEach((r, i2) => {
                temp.push({name: r, value: r, parent: e.industryName})
              })
            });
            console.log(temp)
            this.$nextTick(() => {
              this.list6 = temp;
            })
          }
        })
      },
      calcScore() {
        console.log(this.value1)
        console.log(this.value2)
        console.log(this.value3)
        console.log(this.value4)
        console.log(this.value5)
        console.log(this.value6)
        let params = {
          taking: this.value2.toString(),
          profit: this.value3.toString(),
          marketValue: this.value1.toString(),
          research: this.value4.toString(),
          cashTotal: this.value5.toString(),
          industry: this.value6.toString(),
          // userId: this.$cookie.get('userId'),
          // score: '',
          // createTime: new Date().getTime(),
          companyName: this.companyName
        };
        let formData = new FormData();
        for (let i in params) {
          formData.append(i, params[i]);
        }
        this.$axios.cotrun.calcScore(formData).then(res => {
          if (res.data.returnCode == 1) {
            this.$router.replace({path: '/electron'});
          }
        })
      },
      swChange(index) {
        console.log(index);
      },
      onChange(val) {
        console.log('val change', val);
      },
      onShow() {
        console.log('on show')
      },
      onHide(type) {
        console.log('on hide', type)
      },
      pevChange() {
        if (this.swVal == 0) {
          return
        }
        this.swVal = this.swVal - 1;
      },
      nextChange() {
        let tmp = false;
        switch (this.swVal) {
          case 0:
            if (this.value1.toString()) {
              tmp = true;
            } else {
              this.$vux.toast.show({text: '请选择预估市值', position: 'middle', type: 'text', width: 'auto', time: 1500});
            }
            break
          case 1:
            if (this.value2.toString()) {
              tmp = true;
            } else {
              this.$vux.toast.show({text: '请选择最近一年营业收入', position: 'middle', type: 'text', width: 'auto', time: 1500});
            }
            break
          case 2:
            if (this.value3.toString()) {
              tmp = true;
            } else {
              this.$vux.toast.show({text: '请选择最近两年累计净利润', position: 'middle', type: 'text', width: 'auto', time: 1500});
            }
            break
          case 3:
            if (this.value4.toString()) {
              tmp = true;
            } else {
              this.$vux.toast.show({
                text: '请选择最近三年研发投入占营业收入比例',
                position: 'middle',
                type: 'text',
                width: 'auto',
                time: 1500
              });
            }
            break
          case 4:
            if (this.value5.toString()) {
              tmp = true;
            } else {
              this.$vux.toast.show({
                text: '请选择最近三年经营活动产生的现金流量净额',
                position: 'middle',
                type: 'text',
                width: 'auto',
                time: 1500
              });
            }
            break
          case 5:
            if (this.value5.toString()) {
              tmp = false;
              this.calcScore();
            } else {
              this.$vux.toast.show({text: '选择公司所属行业', position: 'middle', type: 'text', width: 'auto', time: 1500});
            }
            break
        }
        console.log(this.swVal);
        if (tmp) {
          this.swVal = this.swVal + 1;
        }
      }
    }
  }
</script>

<style lang="scss">
  #electron-test {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/bg%402x.png?213213");
    background-repeat: no-repeat;
    background-size: cover;
    background-origin: padding-box;
    position: relative;
    .vux-slider {
      height: 80%;
    }
    .head-pos {
      width: 100%;
    }
    .btn {
      justify-content: center;
      position: absolute;
      bottom: 58px;
      left: 0;
      width: 100%;
      .pev, .next {
        width: 153px;
        height: 50px;
        background: rgba(146, 213, 255, 1);
        box-shadow: 0px 0px 12px 0px rgba(42, 148, 255, 0.15);
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
        border: 0;
      }
      .pev {
        margin-right: 10px;
        &.disabled {
          background: rgba(227, 227, 227, 1);
        }
      }
    }
    .bg {
      &.text {
        width: 327px;
        height: 42px;
        margin: 112px auto auto;
        background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/electron/bg_test_1.png?213213");
        background-repeat: no-repeat;
        background-size: cover;
        background-origin: padding-box;
        text-align: center;
        b {
          vertical-align: middle;
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 42px;
        }
        //  https://oss.in-hope.cn/xiaoan/h5_static/electron/bg_test_1.png
      }
    }
    .test1 {
      height: 100%;
      width: 100%;
      padding: 38px 0 0 0;
      .title {
        font-size: 17px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 24px;
        padding: 0 27px;
      }
      .select-group {
        padding: 0 27px;
        margin-top: 10px;
        .weui-cells {
          background-color: rgba(255, 255, 255, 0.7);
          &::before {
            height: 0;
          }
          &::after {
            height: 0;
          }
        }
      }
    }
  }
</style>
