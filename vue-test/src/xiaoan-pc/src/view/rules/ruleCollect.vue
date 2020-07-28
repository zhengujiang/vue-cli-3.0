<template>
  <div id="ruleCollect">
    <div class="header vxa-image-bg-affiche">
      <div class="content">
        <v-headerTitle :title="'法规汇编'"></v-headerTitle>
      </div>
    </div>
    <div class="content contentBox">
      <ul class="ruleCollect-list">
        <li v-for="(item, index) in regulationList" :key="index" @click="goDetail(item)">
          <!--<p class="title" v-line-clamp:25="1">
            {{item.title}}
          </p>-->
          <el-row class="title">
            <el-col :span="22">
              <p v-line-clamp:25="1">{{item.title}}</p>
            </el-col>
            <el-col :span="2">
              <div class="attentBtn" v-if="!item.isCollect" @click.stop="subscribe(item,index)">
                <img :src="$image.xinhu.add"> 关注
              </div>
              <div class="attentYetBtn" v-else @click.stop="cancelSubscribe(item,index)">已关注
              </div>
            </el-col>
          </el-row>
          <p class="desc" v-line-clamp:20="2">{{item.descrip}}</p>
          <div class="info">
            <span>{{item.dispatchUnit}} | </span>
            <span>{{item.market}} | </span>
            <span>{{$common.transTime(item.releaseTime)[1]}}</span>
          </div>
        </li>
      </ul>
      <!---->
      <div class="vxa-flax-box align foot-pagination">
        <div class="col">
          <el-pagination @current-change="currentChange" :current-page="page.index" :page-size="page.size"
                         layout="prev, pager, next" :total="page.total" class="vxa-footer-page-pagination">
          </el-pagination>
        </div>
        <div class="col button-group t-right">
          <el-radio-group class="vxa-footer-page-radio" size="mini" v-model="page.size"
                          @change="handlePageChange">
            <el-radio-button :label="30">30条</el-radio-button>
            <el-radio-button :label="50">50条</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        page: {
          index: 1,
          size: 30,
          total: 0
        },
        pageSize: '30',
        regulationList: []
      };
    },
    created() {
      this.getRegulationList();
    },
    methods: {
      handlePageChange(index) {
        console.log(index);
        this.getRegulationList();
      },
      //
      getRegulationList() {
        this.$http({
          method: "GET",
          // url: this.$api.user.getRecommendCollect,
          url: this.$api.user.getRecommendCollectFavoriteAll,
          params: {
            userId: this.$cookie.get("userId"),
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        })
          .then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.page.total = res.data.returnObject.totalSize
              this.regulationList = res.data.returnObject.favoriteList;
            }
          })
          .catch(err => {
          });
      },
      currentChange(val) {
        this.page.index = val;
        this.$array.scrollToTop()
        this.getRegulationList();
      },
      goDetail(item) {
        // this.$common.openWindow('subscribeList/subscribeContent?id=' + id + '&shareKey=');
        if (item.isCollect == 1) {
          this.$common.openWindow('/ruleCollectInfo?id=' + item.id);
        } else {
          this.$common.openWindow('/ruleCollectInfo?id=' + item.id + '&sort=1');
        }

      },
      // 订阅推荐收藏夹
      subscribe(item, index) {
        this.$http({
          method: 'GET',
          url: this.$api.user.subscribeRecommend,
          params: {
            recommendId: item.id,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '关注成功'})
          }
          this.getRegulationList()
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 取消订阅收藏夹
      cancelSubscribe(item, index) {
        this.$confirm('确定要取消关注吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'GET',
            url: this.$api.user.cancelRecommend,
            params: {
              userId: this.$cookie.get('userId'),
              recommendId: item.id
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '取消关注成功'})
            }
            this.getRegulationList()
          }).catch((err) => {
            console.log(err)
            this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
          })
          /* if (sort == 'recommend') {

          } else {
            this.$http({
              method: 'GET',
              url: this.$api.user.cancelSubscribe,
              params: {
                userId: this.$cookie.get('userId'),
                id: listId
              }
            }).then((res) => {
              console.log('取消订阅', res)
              if (res.data.returnCode == 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '取消订阅成功'})
              }
              this.getMySubscribe()
            }).catch((err) => {
              console.log(err)
              this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
            })
          } */
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="scss">
  #ruleCollect {
    .header {
      background-color: #f0f1f5;
      height: 60px;
      position: relative;
      background-size: cover;
      overflow: hidden;
    }
    .contentBox {
      padding-bottom: 20px;
    }
    .ruleCollect-list li {
      padding: 10px 20px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      margin: 10px 0px;
      .title {
        height: 32px;
        width: 100%;
        line-height: 32px;
        padding-bottom: 32px;
        font-size: 16px;
        /*border-bottom: 1px solid #e3e3e3;*/
      }
      .desc {
        width: 100%;
        max-height: 40px;
        line-height: 20px;
        font-size: 13px;
        word-break: break-all;
        margin: 6px 0px;
        color: #545454
      }
      .info {
        padding-top: 6px;
        border-top: solid 1px #e3e3e3;
        font-size: 12px;
        color: #aeaeae;
      }
    }
    .attentBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffb148;
      border: 1px solid #ffb148;
      border-radius: 5px;
      width: 70px;
      height: 28px;
      font-size: 14px;
      cursor: pointer;
      float: right;
      img {
        margin-right: 5px;
      }
    }
    .attentYetBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f0f1f5;
      color: #8d8d8d;
      border-radius: 5px;
      width: 70px;
      height: 30px;
      font-size: 14px;
      font-weight: 300;
      cursor: pointer;
      float: right;
    }
    .foot-pagination {
      padding: 20px 0;
    }
  }
</style>
