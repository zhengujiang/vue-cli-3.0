<template>
  <div id="enterprises-admin">
    <div class="content">
      <el-row :gutter="12">
        <el-col :span="24">
          <el-card class="box-card" shadow="never" body-style="padding:0">
            <ul class="box-tabs">
              <li v-for="(list , index) in bar" :class="{active: list.active}" :key="index">
                <span class="text" @click="handleClick(index)">
                  {{list.name}}<span class="tab-bar"></span>
                </span>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userInfo: {},
        activeName: "members",
        bar: [{
          name: "用户管理",
          type: "members",
          active: true,
          link: "/admin/members"
        }, {
          name: "应用管理",
          type: "application",
          active: false,
          link: "/admin/application"
        }
          //, {
          //   name: "支付与发票",
          //   type: "finance",
          //   active: false,
          //   link: "/admin/finance"
          // }
        ]
      };
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      $route: function (to) {
        this.bar.forEach(item => {
          item.active = false;
          if (this.$route.meta.tabName.indexOf(item.type) > -1) {
            item.active = true;
          }
        });
      }
    },
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      if (!this.userInfo.root) {
        this.$router.replace({path: '/manage/changeCompany'});
      }
      this.bar.forEach(item => {
        item.active = false;
        // console.log('this.$route.meta.tabName', this.$route);
        if (this.$route.meta.tabName.indexOf(item.type) > -1) {
          item.active = true;
        }
      });
    },
    mounted() {
    },
    // 方法
    methods: {
      handleClick(index) {
        this.bar.forEach(item => {
          item.active = false;
        });
        this.bar[index].active = true;
        this.activeName = this.bar[index].type;
        this.$router.push({path: this.bar[index].link});
      }
    }
  };
</script>
<style lang="scss">
  #enterprises-admin {
    background-color: #f6f6f6;
    header {
      .card-title {
        padding: 0 0 0 8px;
        margin: 0;
        line-height: 1;
        border-left: solid 4px #ffb148;
        margin-bottom: 15px;
        font-weight: 600;
      }
    }
    .box-card {
      min-height: 30px;
      width: 100%;
      margin: 20px 0;
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
          &.is-active {
            color: #ffb148;
            background-color: #fff3e4;
          }
          * {
            cursor: pointer;
          }
          &:after {
            content: "";
            position: absolute;
            right: 0;
            height: 20px;
            width: 2px;
            background-color: #f0f1f5;
            top: 50%;
            transform: translateY(-50%);
          }
          &:last-child {
            &:after {
              width: 0;
            }
          }
          &.active {
            color: #ffb148;
            .tab-bar {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              width: 50px;
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
    .left .side-menu > li {
      font-weight: 500;
      &.is-active {
        color: #ffb148;
        background-color: #fff3e4;
      }
      cursor: pointer;
      width: 100%;
      height: 50px;
      border-bottom: solid 1px #e3e3e3;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #fff3e4;
        color: #ffb148;
      }
    }
    a .tab-head {
      padding-top: 15px;
      .el-tabs__header {
        background-color: white;
      }
    }
    .content {
      padding-bottom: 20px;
      .card-box {
        min-height: 700px;
        .right {
          padding: 20px;
        }
      }
    }
  }
</style>
