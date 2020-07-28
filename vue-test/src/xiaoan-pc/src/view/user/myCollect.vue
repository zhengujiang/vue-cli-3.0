<template>
  <div id="collects-all-box">
    <v-nav :navIndex="column">
      <template slot="slotMain">
        <!---->
        <div class="left">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item name="my">
              <div class="item-title" slot="title">个人收藏</div>
              <div class="item-content">
                <div class="item" :class="{act:(isActive==='addCollect' && !tabId)}" @click="linkTo('addCollect')">
                <span class="itemImg">
                  <img v-if="isActive==='addCollect' && !tabId" :src="$image.user.iaddact">
                  <img :src="$image.user.iadd" v-else>
                </span>
                  <span class="itemText">新建收藏夹</span>
                </div>
                <div class="item" :class="{act:tabId == list.id}" :title="list.title"
                     @click="linkTo('collectDetails',list.id)"
                     v-for="(list,index) in collectList" :key="list.id">
                <span class="itemImg">
                  <img v-if="tabId == list.id" :src="$image.user.icollectact">
                  <img :src="$image.user.icollect" v-else>
                </span>
                  <span class="itemText">{{ list.title }}</span>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="team" v-if="userInfo.enterpriseUser">
              <div class="item-title" slot="title">团队收藏</div>
              <div class="item-content">
                <div class="item" :class="{act:tabId == list.id}" :title="list.title"
                     @click="linkTo('collectDetails',list.id,'team')"
                     v-for="(list,index) in teamCollectList" :key="list.id">
                <span class="itemImg">
                  <img v-if="tabId == list.id" :src="$image.user.icollectact">
                  <img :src="$image.user.icollect" v-else>
                </span>
                  <span class="itemText">{{ list.title }}</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!---->
        <div class="right">
          <router-view></router-view>
        </div>
      </template>
    </v-nav>
  </div>
</template>

<script>
  import nav from './nav.vue'

  export default {
    data() {
      return {
        activeName: [],
        column: "2",
        isActive: 'add',
        tabId: '',
        userInfo: {},
        collectList: [],
        teamCollectList: []
      }
    },
    // 使用其它组件
    components: {
      'v-nav': nav
    },
    watch: {
      '$route'(to, from) {
        this.setTab()
      }
    },
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.setTab()
      this.getMyDefaultCollect();
      this.getTeamDefault();
    },
    mounted() {
    },
    methods: {
      // 获取我的收藏
      getMyDefaultCollect() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getDefaultContent,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            var content = res.data.returnObject
            var defaultArr = {
              id: content.id,
              title: content.favouriteName
            }
            this.collectList.push(defaultArr)
            this.getMyCollect();
          }
        }).catch((err) => {

        })
      },
      //
      getMyCollect() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getMyCollect,
          params: {
            userId: this.$cookie.get('userId'),
            pageSize: 100,
            pageIndex: 1
          }
        }).then((res) => {
          console.log('我的收藏', res)
          if (res.data.returnCode == 1 && res.data.returnObject) {
            var list = res.data.returnObject.list;
            let data = list.map(e => {
              return {id: e.id, title: e.favouriteName}
            });
            this.collectList = this.collectList.concat(data);
            setTimeout(() => {
              if (this.$route.query.id) {
                this.collectList.forEach((item) => {
                  if (item.id == this.$route.query.id) {
                    this.activeName.push('my');
                  }
                })
              }
            }, 500)
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 团队收藏 默认
      getTeamDefault() {
        this.$http({
          method: 'GET',
          url: this.$api.teamFavourite.getTeamDefault,
          params: {
            companyId: this.userInfo.companyId
          }
        }).then((res) => {
          console.log('我的收藏====>', res)
          if (res.data.returnCode == 1 && res.data.returnObject) {
            var content = res.data.returnObject
            var defaultArr = {
              id: content.id,
              title: content.favouriteName
            }
            this.teamCollectList.push(defaultArr);
            this.getTeamFavourite();
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // this.$api.teamFavourite.getFavourite
      getTeamFavourite() {
        this.$http({
          method: 'GET',
          url: this.$api.teamFavourite.getFavourite,
          params: {
            companyId: this.userInfo.companyId,
            pageSize: 100,
            pageIndex: 1
          }
        }).then((res) => {
          console.log('我的收藏---->', res)
          if (res.data.returnCode == 1 && res.data.returnObject) {
            var list = res.data.returnObject.list;
            let data = list.map(e => {
              return {id: e.id, title: e.favouriteName}
            });
            this.teamCollectList = this.teamCollectList.concat(data);
            setTimeout(() => {
              if (this.$route.query.id) {
                this.teamCollectList.forEach((item) => {
                  if (item.id == this.$route.query.id) {
                    this.activeName.push('team');
                  }
                })
              }
            }, 500)
            console.log('this.teamCollectList', this.teamCollectList);
          } else if (res.data.returnCode == -1) {
            setTimeout(() => {
              if (this.$route.query.id) {
                this.teamCollectList.forEach((item) => {
                  if (item.id == this.$route.query.id) {
                    this.activeName.push('team');
                  }
                })
              }
            }, 500)
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      //
      linkTo(url, index, type) {
        console.log('index', index)
        if (index) {
          if (type == 'team') {
            this.$router.push({path: '/collect/' + url, query: {id: index, type: 'team'}})
          } else {
            this.$router.push({path: '/collect/' + url, query: {id: index}})
          }
          // this.$router.push('/collect/' + url + '?id=' + index)
          console.log('collect', index)
        } else {
          if (this.collectList.length >= 10) {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '最多创建十个收藏夹！'})
          } else {
            this.$router.push('/collect/' + url)
          }
        }
      },
      //
      setTab() {
        console.log('this.$route', this.$route);
        this.isActive = this.$route.meta.tabName
        this.tabId = this.$route.query.id;
        if (this.$route.query.id) {
          //
        } else {
          this.activeName = ['my'];
        }
      }
    }
  }
</script>

<style lang="scss">
  #collects-all-box {
    #contentBox {
      height: auto !important;
      min-height: 800px;
      .mainbox {
        height: auto !important;
        min-height: 720px;
      }
    }
    .left {
      height: auto !important;
      min-height: 655px !important;
      position: relative;
      z-index: 300;
      border: solid 1px #e3e3e3;
      .el-collapse {
        border-top: 0;
        .el-collapse-item__content {
          padding: 0 0;
        }
        .el-collapse-item__header {
          border-bottom: 1px solid #e3e3e3;
        }
        .el-collapse-item__header.is-active {
          color: #ffb148;
        }
      }
      .item-title {
        padding: 0 10px;
        font-size: 16px;
        font-weight: normal;
        color: #323232;
      }
      .item-content {
        .item {
          height: 40px;
          display: flex;
          padding: 0 1em 0 2em;
          align-items: center;
          cursor: pointer;
          &.act {
            background-color: rgba(255, 177, 72, 0.1);
            color: #ffb148;
          }
          > span {
            flex: 1;
            font-size: 15px;
          }
          .itemImg {
            flex: inherit;
            line-height: 1;
            img {
              height: 17px;
              vertical-align: middle;
            }
          }
          .itemText {
            line-height: 1.3;
            padding-left: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
    .right {
      position: relative;
      height: auto !important;
      min-height: 720px;
      border: 1px solid #e3e3e3;
      background-color: #fff;
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
