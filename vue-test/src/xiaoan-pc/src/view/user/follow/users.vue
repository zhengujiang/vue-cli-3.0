<template>
  <div id="follow-users">
    <header>
      <h4 class="card-title">关注用户</h4>
    </header>
    <el-row :gutter="20" style="min-height: 500px" v-if="userList.length >0">
      <el-col :span="8" v-for="(user,index) in userList" :key="index" class="item">
        <el-card shadow="never" class="box-card">
          <div class="card-container" @click="goDetail(user.concernedId)">
            <div class="left">
              <img :src="user.concernedHeadUrl">
            </div>
            <div class="right">
              <div class="name">{{user.concernedName}}</div>
              <p>{{user.attentionCount}}个关注</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <v-noInfo v-else></v-noInfo>
  </div>
</template>
<script>
export default {
  name: 'follow-users',
  data() {
    return {
      userId: '',
      userList: []
    }
  },
  created() {
    this.userId = this.$cookie.get("userId");
    this.getAttentionUsers()
  },
  methods: {
    getAttentionUsers() {
      this.$http({
        method: "GET",
        url: this.$api.xinhu.searchAttentionUser,
        params: {
          selectType: 0,
          userId: this.userId,
          pageNum: 1,
          pageSize: 1000
        }
      }).then(res => {
        if (res.data.returnCode == 1 || res.data.returnCode == 200) {
          this.userList = res.data.returnObject;
        }
      }).catch(err => {
        this.userList = [];
      });
    },
    goDetail(selectUserId) {
      this.$router.push({ path: '/xhMy', query: { selectUserId } });
    }
  }
}
</script>
<style lang="scss">
#follow-users {
  .box-card {
    padding: 0;
    margin-bottom: 20px;
    &:hover {
      cursor: pointer;
      background-color: #f9f9f9;
    }
  }
  .item {
    height: 70px;
    margin-bottom: 10px;
  }
  .el-card__body {
    padding: 10px;
  }
  .card-container {
    display: flex;
    align-items: center;
    .left {
      width: 50px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .right {
      flex: 1;
      padding-left: 15px;
      .name {
        color: #323232;
        line-height: 1;
        margin: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 200px;
      }
      p {
        color: #aeaeae;
        font-size: 12px;
        margin-top: 6px;
      }
    }
  }
}
</style>
