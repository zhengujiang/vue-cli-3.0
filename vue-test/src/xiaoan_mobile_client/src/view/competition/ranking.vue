<template>
  <div id="comp-ranking">
    <div class="one"></div>
    <swiper height="488px" dots-position="center" dots-class="custom">
      <swiper-item>
        <div class="inner">
          <div class="cell">积分总榜</div>
          <x-table class="vxa-table vux-1px" :cell-bordered="false" style="background-color:transparent">
            <tbody>
            <tr v-for="(item, index) in totalScoreRank" :key="index" :class="{'setColor': index == 0}">
              <td width="40px">
                <div class="cell justify">{{item.index}}</div>
              </td>
              <td width="34px">
                <div class="cell">
                  <img class="user_head" :src="item.weixinAvatar"/>
                </div>
              </td>
              <td width="200px">
                <div class="cell"><span style="text-align:left;display: inline-block;max-width: 200px"
                                        class="vxa-ellipsis">{{item.userName}}</span>
                </div>
              </td>
              <td width="40px" style="min-width: 40px">
                <div class="cell justify" style="justify-content: flex-end">{{item.totalScore}}</div>
              </td>
            </tr>
            </tbody>
          </x-table>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="inner">
          <div class="cell">答题得分榜</div>
          <x-table class="vxa-table vux-1px" :cell-bordered="false" style="background-color:transparent">
            <tbody>
            <tr v-for="(item, index) in answerScoreRank" :key="index" :class="{'setColor': index == 0}">
              <td width="40px">
                <div class="cell justify">{{item.index}}</div>
              </td>
              <td width="34px">
                <div class="cell">
                  <img class="user_head" :src="item.weixinAvatar"/>
                </div>
              </td>
              <td width="200px">
                <div class="cell"><span style="text-align:left;display: inline-block;max-width: 200px"
                                        class="vxa-ellipsis">{{item.userName}}</span>
                </div>
              </td>
              <td width="40px" style="min-width: 40px">
                <div class="cell justify" style="justify-content: flex-end">{{item.answerScore}}</div>
              </td>
            </tr>
            </tbody>
          </x-table>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="inner">
          <div class="cell">邀请好友积分榜</div>
          <x-table class="vxa-table vux-1px" :cell-bordered="false" style="background-color:transparent">
            <tbody>
            <tr v-for="(item, index) in inviteScoreRank" :key="index" :class="{'setColor': index == 0}">
              <td width="40px">
                <div class="cell justify">{{item.index}}</div>
              </td>
              <td width="34px">
                <div class="cell">
                  <img class="user_head" :src="item.weixinAvatar"/>
                </div>
              </td>
              <td width="200px">
                <div class="cell"><span style="text-align:left;display: inline-block;max-width: 200px"
                                        class="vxa-ellipsis">{{item.userName}}</span>
                </div>
              </td>
              <td width="40px" style="min-width: 40px">
                <div class="cell" style="justify-content: flex-end">{{item.friend}}</div>
              </td>
            </tr>
            </tbody>
          </x-table>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import {XTable, Swiper, SwiperItem} from 'vux'
  export default {
    name: "comp-ranking",
    components: {
      Swiper, SwiperItem, XTable
    },
    data() {
      return {
        answerScoreRank: [],
        inviteScoreRank: [],
        totalScoreRank: [],
        userInfo: {}
      }
    },
    created() {
      this.userInfo = this.$cookie.getUserInfo()
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
      this.getRankingList();
    },
    computed: {},
    methods: {
      getRankingList() {
        this.$axios.competition.getRankingList().then(res => {
          if (res.data.returnCode == 200) {
            // console.log(res.data);
            let data = res.data.returnObject;
            //
            this.answerScoreRank = data.answerScoreRank;
            this.answerScoreRank.forEach((e, i) => {
              this.$set(e, 'index', i + 1);
            });
            this.answerScoreRank.unshift({
              weixinAvatar: this.userInfo.weixinAvatar,
              userName: this.userInfo.userName,
              answerScore: res.data.returnObject.answerScore,
              index: res.data.returnObject.answerScoreIndexNo
            });
            //
            this.inviteScoreRank = data.inviteScoreRank;
            this.inviteScoreRank.forEach((e, i) => {
              this.$set(e, 'index', i + 1);
              this.$set(e, 'friend', e.inviteScore)
            });
            this.inviteScoreRank.unshift({
              weixinAvatar: this.userInfo.weixinAvatar,
              userName: this.userInfo.userName,
              friend: res.data.returnObject.inviteScore,
              index: res.data.returnObject.inviteScoreIndexNo
            });
            //
            this.totalScoreRank = data.totalScoreRank;
            this.totalScoreRank.forEach((e, i) => {
              this.$set(e, 'index', i + 1);
            });
            this.totalScoreRank.unshift({
              weixinAvatar: this.userInfo.weixinAvatar,
              userName: this.userInfo.userName,
              totalScore: res.data.returnObject.totalScore,
              index: res.data.returnObject.totalScoreIndexNo
            });
          }
        }).catch(err => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #comp-ranking {

    .vux-slider {
      padding-top: 36px;
      .vux-swiper-item {
        width: 375px;
        .inner {
          border-radius: 2px;
          width: 333px;
          margin: 0 auto;
          .cell {
            background-color: transparent;
            color: #fff;
            font-weight: bold;
            font-size: 0.4rem;
            padding: 0 0.133333rem;
            height: 35px;
            line-height: 35px;
            text-align: center;
          }
        }
      }
      .custom {
        top: 5px;
        height: 2px;
        i {
          width: 50px;
          height: 2px;
        }
      }
    }
  }
</style>
