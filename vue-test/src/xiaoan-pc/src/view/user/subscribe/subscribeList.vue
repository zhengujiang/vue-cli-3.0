<template>
  <div id="subscribeList">
    <v-nav :navIndex="1">
      <template slot="slotMain">
        <div class="left">
          <div class="item" :class="{act:tabId == list.id || tabId == list.favouriteId}" :title="list.title"
               @click="linkTo(list.id, list.favouriteId, index)"
               v-for="(list, index) in recommendList" :key="list.id">
            <div class="circle"></div>
            <li v-if="list.title">{{ list.title }}</li>
            <li v-else>{{ list.favourite.favouriteName }}</li>
          </div>
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
      </template>
    </v-nav>
  </div>
</template>

<script>
  import nav from '../nav.vue'

  export default {
    data () {
      return {
        tabId: '',
        tabSort: '',
        recommendList: []
      }
    },
    // 使用其它组件
    components: {
      'v-nav': nav
    },
    watch: {
      '$route': function (val) {
        this.tabId = val.query.id
        console.log('tabId = ', this.tabId)
      }
    },
    methods: {
      // 订阅别人的收藏夹
      getRecommendOthers () {
        this.$http({
          url: this.$api.user.getMySubscribe,
          method: 'GET',
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log('订阅others', res)
          if (res.data.returnCode == 1) {
            var obj = res.data.returnObject
            if (this.recommendList.length !== 0) {
              for (var i = 0; i < obj.length; i++) {
                this.recommendList.push(obj[i])
              }
            } else {
              this.recommendList = res.data.returnObject
            }
            console.log('recommendList', this.recommendList)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 已订阅学习资料
      getRecommend () {
        if (this.tabSort) {
          this.$http({
            method: 'GET',
            url: this.$api.user.getRecommendCollect,
            params: {
              userId: this.$cookie.get('userId'),
              rows: this.tabSort
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              var obj = res.data.returnObject.favoriteList
              if (this.recommendList.length !== 0) {
                for (var i = 0; i < obj.length; i++) {
                  this.recommendList.push(obj[i])
                }
              } else {
                this.recommendList = res.data.returnObject.favoriteList
              }
              // this.recommendList = res.data.returnObject.favoriteList
            } else {
              this.$message({showClose: true, type: 'warning', duration: 3000, message: res.data.returnMsg})
            }
          }).catch((err) => {
            this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
          })
        } else {
          this.$http({
            method: 'GET',
            url: this.$api.user.getRecommend,
            params: {
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              // this.recommendList = res.data.returnObject
              var obj = res.data.returnObject
              if (this.recommendList.length !== 0) {
                for (var i = 0; i < obj.length; i++) {
                  this.recommendList.push(obj[i])
                }
              } else {
                this.recommendList = res.data.returnObject
              }
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
            }
          })
        }
      },
      linkTo (id, fid, index) {
        // console.log('key', key)
//        if (this.recommendList[key].favourite) {
//          console.log('key', this.recommendList[key].favourite.shareKey)
//        }
        console.log('fId', fid)
        if (this.tabSort) {
          this.$router.push({path: '/subscribeList/subscribeContent', query: {id: id, sort: this.tabSort}})
        } else {
          if (fid) {
            this.$router.push({path: '/subscribeList/subscribeContent', query: {id: fid, shareKey: this.recommendList[index].favourite.shareKey}})
          } else {
            this.$router.push({path: '/subscribeList/subscribeContent', query: {id: id}})
          }
        }
        // console.log('tabId', this.tabId, id)
      }
    },
    // 生命周期函数
    created () {
      this.tabId = this.$route.query.id
      this.tabSort = this.$route.query.sort
      this.getRecommend()
    },
    mounted () {
      console.log('tabSort  == ', this.tabSort)
      this.getRecommendOthers() // 20180105 1800
    }
  }
</script>

<style lang="scss">
  #subscribeList {
    .left {
      // min-height: 720px;
      // height: 100% !important;
      .item {
        padding-right: 10px;
        padding-left: 10px !important;
        height: auto !important;
        line-height: 1;
        position: relative;
        .circle {
          width: 5px;
          position: absolute;
          top:18px;
          left: inherit;
          height: 5px;
          background: #8d8d8d;
          border-radius: 50%;
        }
        span {
          width: 85%;
          height: 100%;
          text-overflow: ellipsis;
          float: right;
          overflow: hidden;
          white-space: nowrap;
        }
        li {
          padding: 10px 10px 5px 15px;
          // list-style: disc;
          line-height: 20px;
        }
      }
      .act {
        .circle {
          background: #ffb148;
        }
      }
    }
    .right {
      width: 940px !important;
      height: auto !important;
      // min-height: 720px;
      // border-left: 20px solid #f6f6f6;
      .space {
        padding-right: 10px;
      }
      .el-select {
        width: 100%;
      }
      .el-form-item__label {
        position: relative;
        padding-right: 15px;
      }
      .el-form-item.is-required .el-form-item__label:before {
        margin-left: 4px;
        position: absolute;
        top: 3px;
        right: 3px;
      }

      .line {
        text-align: center;
        color: rgba(255, 255, 255, 0)
      }
      .subBtn {
        width: 240px;
        height: 40px;
      }
    }
  }
</style>
