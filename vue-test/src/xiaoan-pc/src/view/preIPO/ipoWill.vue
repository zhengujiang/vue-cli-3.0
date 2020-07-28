<template>
  <!--再审ipo-->
  <div id="ipo-will">
    <div class="box-header">
      <div class="content">
        <div class="list">
          <div class="row text">
            <div class="font-size-16 name"><span>IPO上会公司统计</span></div>
          </div>
          <div class="row btns">
            <el-button class="radio-btn" type="primary" :plain="$route.meta.check == 'list'"
                       @click="checkChange(true)">总览
            </el-button>
            <el-button class="radio-btn" type="primary" :plain="$route.meta.check == 'overview'"
                       @click="checkChange(false)">列表
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="ipo-retrial-content" :class="{'is-background': $route.meta.check == 'overview'}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ipo-will",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    methods: {
      checkChange(val) {
        console.log(this.$route, val);
        let link = ''
        if (val) {
          // true
          link = '/ipo/will/overview'
        } else {
          // false list
          link = '/ipo/will/list'
        }
        if (this.$route.query.active) {
          this.$router.replace({path: link, query: {active: this.$route.query.active}});
        } else {
          this.$router.replace({path: link});
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  #ipo-will {
    background-color: #fff;
    @import "../../../static/css/animate";
    .box-header {
      width: 100%;
      height: 100px;
      background: #fff;
      -moz-box-shadow: 0px 10px 20px #f6f6f6;
      -webkit-box-shadow: 0px 10px 20px #f6f6f6;
      box-shadow: 0px 10px 20px #f6f6f6;
      position: relative;
      overflow: hidden;
      .list {
        display: flex;
        height: 100px;
        align-items: center;
        .row {
          flex: 1;
          &.img {
            flex: inherit;
            .code {
              display: inline-block;
              height: 48px;
              width: 48px;
              border-radius: 50%;
              line-height: 48px;
              text-align: center;
              font-size: 12px;
              color: #FFFFFF;
            }
          }
          &.text {
            padding-right: 10px;
            .name {
              font-size: 20px;
              color: #323232;
              display: flex;
              align-items: center;
              font-weight: 500;
              .select-item {
                margin-left: 30px;
                width: 75px;
                &.number {
                  width: 85px;
                }
                &.numberPev {
                  width: 100px;
                }
              }
            }
          }
          &.btns {
            text-align: right;
            .radio-btn {
              padding: 0;
              height: 30px;
              width: 60px;
              text-align: center;
              border-radius: 2px;
            }
          }
        }
      }
    }
    .ipo-retrial-content {
      min-height: 800px;
      background-color: #fff;
      transition: all .3s;
      &.is-background {
        background-color: #f6f6f6;
        transition: all .3s;
      }
    }
  }

</style>
