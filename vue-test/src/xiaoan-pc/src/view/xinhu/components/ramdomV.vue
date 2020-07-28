<template>
  <el-card id="ramdomv" class="box-card" shadow="never">
    <div slot="header" class="header">
      <div>
        <img class="titleImg" :src="$image.xinhu.v">
        <span class="fleft">大V推荐</span>
      </div>
      <div @click="getAttentionRandomV" class="pointer">
        <span class="fright">换一批</span>
        <img :src="$image.xinhu.refresh">
      </div>
    </div>
    <div class="listBox" v-for="(item,index) in data">
      <div class="item">
        <div class="headerImg" v-if="item.weixinAvatar">
          <img class="headerImg" :src="item.weixinAvatar" @click="link(item.id)">
        </div>
        <div class="headerImg" v-else>
          <img class="headerImg" :src="$image.xinhu.headerImg" @click="link(item.id)">
        </div>
        <div class="info" @click="link(item.id)">
          <div class="name">{{item.userName}}</div>
          <div class="intro">{{item.synopsis}}</div>
        </div>
        <div class="attentBtn" v-if="!item.attentioned" @click="addAttention(item,index)">
          <img :src="$image.xinhu.add"> 关注
        </div>
        <div class="attentYetBtn" v-else @click="unfollow(item,index)">已关注
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        data: []
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getAttentionRandomV()

    },
    mounted() {
      // this.unfollow()
    },
    // 方法
    methods: {
      link(id) {
        this.$router.push({path: '/xhMy', query: {selectUserId: id}});
      },
      getAttentionRandomV() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.getAttentionRandomV,
          params: {
            vNumber: 5,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            data.forEach((key1, i1) => {
              if (key1.synopsis == null || key1.synopsis == '') {
                key1.synopsis = '乎主很神秘'
              }
            })
            this.data = data
          }
        })
      },
      unfollow(item, index) {
        this.$confirm('确定要取消关注吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$api.xinhu.unFollow,
            method: 'DELETE',
            params: {
              userId: this.userId,
              concernedId: item.id,
              attentionType: 2
            }
          }).then((res) => {
            if (res.data.returnCode == 200) {
              this.data[index].attentioned = false
              // this.data = Object.assign({}, this.data)
            }
          })
        }).catch(() => {
        })
      },
      addAttention(item, index) {
        this.$http({
          url: this.$api.xinhu.addAttention,
          method: 'POST',
          params: {
            attentionType: 'ATTENTION_PEOPLE',
            concernedId: item.id,
            concernedTitle: item.userName,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.data[index].attentioned = true
            // this.data = Object.assign({}, this.data)
            console.log(this.data)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #ramdomv {
    width: 100%;
    min-height: 300px !important;
    padding: 0 12px 12px 12px;
    margin-bottom: 20px;
    .pointer {
      cursor: pointer;
    }
    .el-card__header {
      padding: 0;
    }
    .el-card__body {
      padding: 0;
      padding-top: 12px;
    }
    .header {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .titleImg {
        width: 23px;
      }
      div {
        display: flex;
        align-items: center;
      }
      .fleft {
        display: inline-block;
        margin-left: 5px;
      }
      .fright {
        display: inline-block;
        margin-right: 5px;
        font-size: 14px;
        color: #8d8d8d;
      }
    }
    .listBox {
      margin-bottom: 10px;
      .item {
        display: flex;
        align-items: center;
        height: 50px;
        .info {
          cursor: pointer;
          padding-left: 6px;
          width: 138px;
          .name {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #323232;
            font-size: 14px;
          }
          .intro {
            padding-top: 5px;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #aeaeae;
            font-size: 12px;
          }
        }
        .headerImg {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
        }
        .attent {
          width: 71px;
          height: 30px;
        }
        .attentBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffb148;
          border: 1px solid #ffb148;
          border-radius: 5px;
          width: 70px;
          height: 30px;
          font-size: 14px;
          cursor: pointer;
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
        }
      }
    }
  }
</style>
