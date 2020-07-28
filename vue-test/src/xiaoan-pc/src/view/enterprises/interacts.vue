<template>
  <div id="charge-activities" class="charge-activities">
    <div class="header vxa-image-bg-affiche">
      <div class="content">
        <!--<div class="title">{{eName}}</div>-->
        <v-headerTitle :title="eName"></v-headerTitle>
        <!--<div class="tabs">-->
          <!--<el-card class="box-card-header" shadow="never" body-style="padding:0">-->
            <!--<ul class="box-tabs">-->
              <!--<li v-for="(list , index) in bar" :class="{active: list.active}" @click="handleClick(index)">-->
                <!--<span class="text">{{list.name}}<span class="bar"></span></span>-->
              <!--</li>-->
            <!--</ul>-->
          <!--</el-card>-->
        <!--</div>-->
      </div>
    </div>
    <div class="content">
      <div class="box-card-content">
        <el-card class="box-card-item" v-for="(item,index) in interactList" :key="index" shadow="never" body-style="padding:10px 30px">
          <p class="p_title">{{item.userName}}：{{item.question}}</p>
          <p class="p_answer"><span>{{item.answer}}</span></p>
          <p class="about"><span>{{item.answerTime}}</span> | <span>{{item.companyName}}</span></p>
        </el-card>
      </div>
      <div class="foot-activities">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageTotal" :current-page="pageNum" @current-change="selectPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "activities",
    data() {
      return {
        eName: "e互动",
        interactList: [],
        valueJianguan: '',
        pageNum: 1,
        pageTotal: 10,
        company: {},
        userInfo: {}
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.getInteractList()
    },
    methods: {
      selectPage(index) {
        this.pageNum = index
        this.getInteractList()
      },
      // 获取互动e信息
      getInteractList() {
        let code = this.$route.query.code ? this.$route.query.code.substr(2) : this.userInfo.enterpriseCompanyCode
        this.eName = this.$config.eName(this.$route.query.code);
        this.$http({
          method: 'GET',
          url: this.$api.interact.listInteractByCompanyCode,
          params: {
            pageNo: this.pageNum,
            pageSize: 10,
            companyCode: code
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 200) {
            this.interactList = res.data.returnObject.interactList
            this.pageTotal = res.data.returnObject.totalCount
          }
        }).catch((err) => {
          this.interactList = []
        })
      },
      goUrl(url) {
        this.$common.openWindow(url)
      }
    }
  }
</script>

<style lang="scss">
  #charge-activities {
    min-height: 800px;
    .header {
      background-color: #f0f1f5;
      height: 60px;
      position: relative;
      background-size: cover;
      overflow: hidden;
      .title {
        text-align: center;
        color: #ffb148;
        padding: 18px 0;
        font-size: 17px;
      }
      .tabs {
        .box-card-header {
          border: 0;
          .box-tabs {
            display: flex;
            height: 45px;
            align-items: center;
            li {
              height: 100%;
              flex: 1;
              text-align: center;
              line-height: 45px;
              position: relative;
              &:last-child {
                flex: 0 0 16.5%;
                text-align: right;
                padding-right: 20px;
              }
              &:first-child {
                text-align: left;
                flex: 0 0 16.5%;
                padding-left: 20px;
              }
              &.active {
                color: #ffb148;
                .bar {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  height: 2px;
                  width: 30px;
                  background-color: #ffb148;
                  margin: 0 auto;
                }
              }
              .text {
                height: 100%;
                position: relative;
                display: inline-block;
              }
            }
          }
        }
      }
    }
    .box-card-content {
      padding-top: 30px;
      .box-card-item {
        margin-bottom: 15px;
        color: #323232;
        .about {
          padding-top: 3px;
          font-size: 13px;
          color: #8d8d8d;
        }
      }
    }
    .foot-activities {
      padding: 20px;
      text-align: center;
    }
    .p_title {
      cursor: auto;
      width: 100%;
      height: auto;
      /*max-height: 50px;*/
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      /*-webkit-line-clamp: 3;*/
      /*font-size: 14px;*/
      color: #323232;
      word-wrap: break-word;
      padding: 5px 0 5px 0;
      position: relative;
      &:hover {
        color: #ffb148;
      }
    }
    .p_answer {
      cursor: auto;
      width: 100%;
      height: auto;
      /*max-height: 50px;*/
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      /*-webkit-line-clamp: 3;*/
      font-size: 13px;
      color: #8d8d8d;
      word-wrap: break-word;
      padding: 5px 0 5px 0;
      position: relative;
    }
  }
</style>
