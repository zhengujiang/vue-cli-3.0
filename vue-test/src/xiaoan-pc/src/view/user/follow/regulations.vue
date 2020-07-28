<template>
  <div id="follow-questions">
    <header>
      <h4 class="card-title">关注法规汇编</h4>
    </header>
    <ul class="regulation-list" v-if="regulationList.length>0">
      <li v-for="(item, index) in regulationList" :key="index" @click="goDetail(item.id)">
        <el-row>
          <el-col :span="21"><p class="title" v-line-clamp:25="1">{{item.title}}</p></el-col>
          <el-col :span="3">
            <div class="cancelSubscribe" @click.stop="cancelSubscribe(item,index)">
              <i class="iconfont web-icon_quxiaodingyue-"></i>
              取消关注
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
    <v-noInfo v-else></v-noInfo>
    <!--<el-pagination @current-change="currentChange" :current-page="page.index" :page-size="page.size"
                   layout="prev, pager, next" :total="page.total" background style="text-align: center">
    </el-pagination>-->
  </div>
</template>
<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    components: {
      ElCol,
      ElRow},
    name: "follow-questions",

    data() {
      return {
        page: {
          index: 1,
          size: 5,
          total: 0
        },
        regulationList: []
      };
    },
    created() {
      this.getSubscribeList();
      // this.getRegulationList();
    },
    methods: {
      // 获取订阅列表
      getSubscribeList () {
        this.$http({
          method: 'GET',
          url: this.$api.user.getRecommend,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            // this.page.total = Number(res.data.returnObject.totalSize) * this.page.size;
            this.regulationList = res.data.returnObject;
          } else {
            this.regulationList = []
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      getRegulationList() {
        this.$http({
          method: "GET",
          url: this.$api.user.getRecommendCollect,
          params: {
            userId: this.$cookie.get("userId"),
            rows: this.page.index,
            size: this.page.size
          }
        })
          .then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.page.total = Number(res.data.returnObject.totalSize) * this.page.size;
              this.regulationList = res.data.returnObject.favoriteList;
            }
          })
          .catch(err => {
          });
      },
      currentChange(val) {
        this.page.index = val;
        this.getRegulationList();
      },
      goDetail(id) {
        // this.$common.openWindow('subscribeList/subscribeContent?id=' + id + '&shareKey=');
        this.$common.openWindow('/subscribeList/subscribeContent?id=' + id);
      },
      // 取消订阅收藏夹
      cancelSubscribe (item, index) {
        this.$confirm('确定要取消关注 ' + item.title + ' 吗?', '提示', {
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
            this.getSubscribeList()
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
        }).catch(() => {})
      }
    }
  };
</script>
<style lang="scss">
  #follow-questions {
    .regulation-list li {
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
        color: #545454;
        text-align: justify;
      }
      .info {
        padding-top: 6px;
        border-top: solid 1px #e3e3e3;
        font-size: 12px;
        color: #aeaeae;
      }
      .cancelSubscribe {
        color: #ffb148;
        font-size: 13px;
        text-align: right;
      }
    }
  }
</style>
