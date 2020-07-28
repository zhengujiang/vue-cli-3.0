<template>
  <ul class="list">
    <li v-for="(item, index) of listData" :key="index" class="vux-1px-b hover">
      <div class="title-default">
        <p class="row title" :class="{'flex1': item.show}">
          <!-- <el-tooltip placement="right-start" :visible-arrow='false' :hide-after='10000'>
            <div slot="content">多行信息<br/>第二行信息</div>
            <span class="level">B</span>
          </el-tooltip> -->
          <span class="level" :class="`level${item.nowLevel}`">
            <i v-if="item.nowLevel">{{item.nowLevel}}</i>
            <i v-else class="iconfont web-icon_tianchong_tixing-" style="color:#AEAEAE"></i>
            <span class="box" v-if="item.nowLevel">
              <p class="top">信披评级</p>
              <p class="item" v-for="(value, index) in item.threeYearLevel" :key="index">{{value.key}}: {{value.value}}</p>
            </span>
            <span class="box boxnull" v-else>
              <p class="itemnull">该上市公司</p>
              <p class="itemnull">尚无信披评级</p>
            </span>
          </span>
          
          <router-link class="a-link" :class="{fontWeight: item.show}" :to="`/affiche/details?id=${item.id}`"
                       target="_blank">
                      <span v-html="item.title"></span>
                       <!-- {{item.title}} -->
          </router-link>
        </p>
        <div class="row right" v-if="!item.show">
          <span class="time">{{item.date}}&ensp;|&ensp;</span>
          <span class="set">
            <span @click="handleChange(index, 0)">单条</span>&ensp;|&ensp;<span @click="handleChange(index, 1)">全部</span>
          </span>
          <span class="set-break">
            <span>显示摘要</span>
          </span>
        </div>
      </div>
      <el-collapse-transition>
        <div class="desc-all" v-if="item.show">
          <div class="desc" v-if="item.describe">
            <router-link class="a-link desc-link hiddenLine4" :to="`/affiche/details?id=${item.id}`" target="_blank"
                         v-html="item.describe"></router-link>
          </div>
          <div class="about">
            <div class="row left">
              <span class="form" v-if="item.date">{{item.date}}</span>
              <i v-html="$array.setMarket(item.plate)"></i>
            </div>
            <div class="row right">
            <span class="set">
              <span @click="handleChange(index, 0)">单条</span>&ensp;|&ensp;<span
              @click="handleChange(index, 1)">全部</span>
            </span>
              <button class="set-break" type="button">隐藏摘要</button>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "list",
    components: {},
    data() {
      return {
        listData: []
      }
    },
    props: ['data'],
    watch: {
      data: function (val) {
        this.listData = val;
        this.listData[0].show = true;
      }
    },
    created() {
      console.log(this.data);
      this.listData = this.data;
      if (this.listData[0]) this.listData[0].show = true;
    },
    methods: {
      //
      handleChange(index, type) {
        console.log(index, type)
        switch (type) {
          case 0:
            // 单条
            this.listData[index].show = !this.listData[index].show;
            break;
          case 1:
            // 全部
            if (this.listData[index].show) {
              this.listData.forEach((item) => {
                item.show = false;
              })
            } else {
              this.listData.forEach((item) => {
                item.show = true;
              })
            }
            break;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .list {
    .title {
      position: relative;
      padding-left: 30px;
      .level {
        display: inline-block;
        width: 22px;
        height: 22px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -11px;
        font-weight: 600;
        cursor: pointer;
        .box {
          display: none;
        }
        &:hover {
          .box {
            display: inline-block;
            position: absolute;
            width: 64px;
            left: 25px;
            top: 15px;
            border-radius: 4px;
            font-size: 12px;
            color: #FFFFFF;
            z-index: 10;
            font-weight: 400;
            .top {
              height: 28px;
              line-height: 28px;
              border-radius:3px 3px 0px 0px;
              background: rgba(0, 0, 0, 0.9);
              // opacity: 0.4;
            }
            .item {
              padding: 2px 0;
              // opacity: 0.7;
              background: rgba(0, 0, 0, 0.7);
              &:last-child {
                border-radius:0px 0px 3px 3px;
                padding-bottom: 4px;
              }
            }
            .itemnull {
              background: rgba(0, 0, 0, 0.9);
            }
          }
          .boxnull {
            width: 90px;
            padding: 5px;
            border-radius: 3px;
            background: rgba(0, 0, 0, 0.9);
          }
        }
      }
      .levelA {
        border-radius: 50%;
        background: #FFB148;
        color: #FFFFFF;
      }
      .levelB {
        color: #323232;
      }
      .levelC {
        color: #FFA691;
      }
      .levelD {
        color: #FB4319;
      }
    }
    li {
      &.hover {
        transition: all .3s;
        &:hover {
          transition: all .3s;
          background-color: #f8f8f8;
        }
      }
      .a-link {
        color: inherit;
        font-weight: normal;
        transition: .3s all;
        &.fontWeight {
          transition: .3s all;
          font-weight: bold;
        }
        &.desc-link {
          display: inherit;
          overflow: hidden;
          max-height: 6em;
        }
        &:hover {
          color: #FFB148;
          transition: .3s all;
        }
      }
      &:hover {
        // color: #ffb148;
      }
      padding: 10px 0;
      .title-default {
        width: 100%;
        align-items: center;
        display: flex;
        .row {
          flex: 1;
          &.title {
            flex: 0 0 80%;
            font-size: 16px;
            color: rgba(50, 50, 50, 1);
            &.flex1 {
              flex: 1;
            }
          }
          &.right {
            text-align: right;
            font-size: 12px;
            color: rgba(174, 174, 174, 1);
            transition: all .3s;
            .set-break {
            }
            .set {
              display: none;
            }
            &:hover {
              .set-break {
                display: none;
              }
              .set {
                display: inline-block;
                span:hover {
                  color: #ffb148;
                }
              }
            }
          }
        }
      }
      .desc-all {
        transition: all .3s;
        .desc {
          padding-top: 4px;
          font-size: 14px;
          color: rgba(141, 141, 141, 1);
          line-height: 1.5;
          /*text-align: justify;*/
        }
        .about {
          padding-top: 7px;
          font-size: 12px;
          font-weight: normal;
          color: rgba(174, 174, 174, 1);
          line-height: 16px;
          display: flex;
          .row {
            flex: 1;
            &.left {
              flex: 0 0 90%;
              transition: all .3s;
              span {
                line-height: 1;
              }
            }
            &.right {
              text-align: right;
              transition: all .3s;
              button {
                border: 0;
                padding: 0;
                background-color: inherit !important;
              }
              .set-break {
              }
              .set {
                display: none;
              }
              &:hover {
                .set-break {
                  display: none;
                }
                .set {
                  display: inline-block;
                  span:hover {
                    color: #ffb148;
                  }
                }
              }
            }
          }
        }
      }
    }
    
  }
</style>
