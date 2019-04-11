<template>
  <div id="comp-details">
    <group gutter="0">
      <cell-box align-items="center">
        <div class="col" style="flex: inherit;padding-right: 10px"><img :src="userInfo.weixinAvatar" alt=""></div>
        <div class="col user_title vxa-ellipsis" style="flex: 1;text-align: left">{{userInfo.userName}}</div>
        <div class="col right" @click="$router.push({path:'/competition/clause',query:{form: 'details'}})">查看活动条款<i
          class="icon iconfont icon-xiangyoujiantou"></i></div>
      </cell-box>
    </group>
    <div class="foo"></div>
    <group gutter="0">
      <cell-box v-for="(item, index) in dataList" :key="index" align-items="center">
        <div class="col" style="flex: 1">
          <p class="title">{{item.name}}</p>
          <p class="time">{{$const.format(item.sortTime)}}&ensp;{{$const.formatSecond(item.sortTime)}}</p>
        </div>
        <div class="col" style="flex: inherit;text-align: right">{{item.num}}</div>
      </cell-box>
    </group>
    <div style="height: 30px"></div>
  </div>
</template>

<script>
  import {Group, Cell, CellBox} from 'vux'
  export default {
    name: "details",
    components: {
      Group, Cell, CellBox
    },
    data() {
      return {
        detailObj: {
          answerScore: '答题',
          signScore: '签到',
          inviteScore: '邀请',
          inviteeScore: '接收邀请',
          secretary: '董秘打Call',
          userInfo: {}
        },
        dataList: []
      }
    },
    created() {
      this.userInfo = this.$cookie.getUserInfo();
      this.getIntegralDetails();
    },
    mounted(){
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    methods: {
      getIntegralDetails() {
        this.$axios.competition.getIntegralDetails().then(res => {
          if (res.data.returnCode == 200) {
            this.dataList = res.data.returnObject;
            this.dataList.forEach(e => {
              this.$set(e, 'name', this.detailObj[e.type]);
              //
              if (e.notice) {
                this.$set(e, 'name', e.notice);
              }
              if (e.type == 'signScore') {
                this.$set(e, 'num', '+1');
              }
              if (e.type == 'inviteScore') {
                this.$set(e, 'num', '+5');
              }
              if (e.type == 'inviteeScore') {
                this.$set(e, 'num', '+3');
              }
              if (e.type == 'secretary') {
                this.$set(e, 'num', '+30');
              }
              if (e.type == 'answerScore') {
                this.$set(e, 'num', `+${e.correctNum}`)
              }
            })
            console.log(this.dataList);
            // this.dataList = this.dataList.concat(this.dataList, this.dataList, this.dataList, this.dataList)
          }
        }).catch(err => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #comp-details {
    height: 100%;
    width: 100%;
    background-color: white;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .foo {
      height: 6px;
      background-color: #F6F6F6
    }
    .vux-cell-box {
      .time {
        color: #999999;
        font-size: 12px;
      }
      .col {
        &.user_title {
          font-weight: bold;
          color: #333333;
          font-size: 15px;
        }
        &.right {
          flex: inherit;
          text-align: right;
          color: #FFCE04;
          font-size: 15px;
          i {
            color: #FFCE04;
            font-weight: bold;
            font-size: 15px;
          }
        }
        img {
          height: 50px;
          width: 50px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
      .title {
        font-size: 14px;
        color: #1F1E22;
      }
    }
  }
</style>
