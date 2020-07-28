<template>
  <div id="follow-topics">
    <header>
      <h4 class="card-title">关注话题</h4>
    </header>
    <el-row :gutter="20" style="min-height: 400px">
      <el-col :span="24">
        <template v-if="topicList.length > 0">
          <el-card shadow="never" class="box-card" v-for="(topic,index) in topicList" :key="index">
            <div class="card-container" @click="goDetail(topic.concernedId)">
              <div class="left">
                <img :src="topic.concernedHeadUrl">
              </div>
              <div class="right">
                <h4>{{topic.concernedName}}</h4>
                <p class="desc">{{topic.concernedTitle}}</p>
                <p class="note">{{topic.attentionCount}}个关注 | {{topic.questionCount}}个问题 |
                  {{$common.transTime(topic.createDate)[1]}}</p>
              </div>
            </div>
          </el-card>
        </template>
        <v-noInfo v-else></v-noInfo>
      </el-col>
    </el-row>
    <el-pagination v-if="page.total > page.size" @current-change="currentChange" :current-page="page.index"
                   :page-size="page.size" layout="prev, pager, next" :total="page.total" background
                   style="text-align: center"></el-pagination>
  </div>
</template>
<script>
  export default {
    name: 'follow-topics',
    data() {
      return {
        page: {
          index: 1,
          size: 5,
          total: 0
        },
        topicList: []
      }
    },
    created() {
      this.getAttentionTopic();
    },
    methods: {
      getAttentionTopic() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.getAttentionTopic,
          params: {
            userId: this.$cookie.get("userId"),
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page.total = res.data.total;
            this.topicList = res.data.returnObject;
          } else {
            this.topicList = [];
          }
        }).catch(err => {
          this.topicList = [];
        });
      },
      currentChange(val) {
        this.page.index = val;
        this.getAttentionTopic();
      },
      goDetail(concernedId) {
        this.$router.push({path: '/xhTopic', query: {topicId: concernedId}});
      }
    }
  }
</script>
<style lang="scss">
  #follow-topics {
    .box-card {
      padding: 0;
      margin-bottom: 10px;
      &:hover {
        cursor: pointer;
        background-color: #f9f9f9;
      }
    }
    .card-container {
      display: flex;
      align-items: center;
      .left {
        width: 60px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .right {
        flex: 1;
        padding-left: 20px;
        h4 {
          line-height: 1;
          margin: 0;
          font-weight: 600;
        }
        p {
          font-size: 14px;
          margin-top: 6px;
          &.desc {
            line-height: 20px;
            max-height: 40px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          &.note {
            font-size: 12px;
            color: #8d8d8d;
          }
        }
      }
    }
  }
</style>
