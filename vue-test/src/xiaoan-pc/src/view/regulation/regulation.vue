<template>
  <div id="regulation">
    <div class="finance-title">
      <div class="content">
        <p>公司规章制度</p>
        <p>小安智能归集了上市公司合规治理的相关法规、规则，协助上市公司查询本公司已披露的公司规章制度，查漏补缺，提升公司治理水平。</p>
      </div>
    </div>
    <div class="content" style="margin-top: -42px">
      <el-row :gutter="12">
        <el-col :span="24">
          <el-card class="box-card box-col" shadow="never" body-style="padding:0">
            <ul class="box-tabs">
              <li v-if="userInfo.superviseUser" class="company-li"><v-regulatorCompany :placement="'bottom-start'"></v-regulatorCompany></li>
              <li v-for="(list , index) in bar" :class="{active: list.active}" :key="index" @click="handleClick(index)">
                <span class="text">
                  {{list.name}}<span class="bar"></span>
                </span>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
      <transition name="el-fade-in">
      <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      activeName: "library",
      bar: [
        {
          name: "公司治理制度清单",
          type: "library",
          active: false,
          link: "/regulation/library"
        },
        {
          name: "公司规章制度",
          type: "manage",
          active: true,
          link: "/regulation/manage"
        }
      ]
    };
  },
  // 使用其它组件
  components: {},
  computed: {},
  watch: {
    $route: function(to) {
      this.bar.forEach(item => {
        item.active = false;
        if (item.type == this.$route.meta.tabName) {
          item.active = true;
        }
      });
    }
  },
  // 生命周期函数
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"))
    this.bar.forEach(item => {
      item.active = false;
      if (item.type == this.$route.meta.tabName) {
        item.active = true;
      }
    });
  },
  mounted() {},
  // 方法
  methods: {
    handleClick(index) {
      this.bar.forEach(item => {
        item.active = false;
      });
      this.bar[index].active = true;
      this.activeName = this.bar[index].type;
      // this.$router.push({ path: this.bar[index].link });
      if (this.$route.query.companyCode) {
        this.$router.push({path: this.bar[index].link, query: {companyCode: this.$route.query.companyCode}});
      } else {
        this.$router.push({path: this.bar[index].link});
      }
    }
  }
};
</script>

<style lang="scss">
#regulation {
  background-color: #f6f6f6;
  .finance-title {
    width: 100%;
    height: 166px;
    background-image: url(https://oss.in-hope.cn/xiaoan/web_static/financeBack.jpg);
    background-size: 100% 100%;
    color: #FFFFFF;
    p:first-child {
      font-size:30px;
      font-weight:600;
      padding: 32px 0 4px 0;
    }
    p {
      font-size:12px;
      font-weight:400;
    }
  }
  .box-card {
    border: none;
    width: 100%;
    margin-bottom: 16px;
    border-radius: 0;
    &.box-col {
      background-color: transparent;
    }
    .box-tabs {
      height: 42px;
      align-items: center;
      li {
        background-color:rgba(255,255,255,0.08);
        color: #FFFFFF;
        width: 168px;
        margin-right: 1px;
        display: inline-block;
        height: 100%;
        text-align: center;
        line-height: 42px;
        position: relative;
        * {
          cursor: pointer;
        }
        &.active {
          color: #ffb148;
          .bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            width: 100%;
            background-color: #ffb148;
            margin: 0 auto;
          }
        }
        &:hover {
          background-color: #FFB148;
          color: #FFFFFF;
        }
        .text {
          height: 100%;
          position: relative;
          display: inline-block;
        }
      }
      .company-li {
        flex: 1;
        width: 340px;
        text-align: left;
        padding-left: 14px;
      }
    }
  }
  .tab-head {
    padding-top: 15px;
    .el-tabs__header {
      background-color: white;
    }
  }
}
</style>
