<template>
  <ul class="list">
    <li v-for="(item, index) of listData" class="vux-1px-b hover">
      <div class="title-default">
        <p class="row title" :class="{flex1: item.show}">
          <router-link class="a-link" :class="{fontWeight: item.show}" :to="item.link" target="_blank"
                       v-html="item.title"></router-link>
        </p>
        <div class="row right" v-if="!item.show">
          <span class="time">{{$common.transTime(item.releaseDate)[1]}}&ensp;|&ensp;</span>
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
          <div class="desc" v-if="item.desc">
            <router-link class="a-link desc-link hiddenLine4" :to="item.link" target="_blank"
                         v-html="item.desc"></router-link>
          </div>
          <div class="about">
            <div class="row left">
              <span class="form" v-if="item.industryLevelOne">{{item.industryLevelOne}}</span>
              <span class="allow" v-if="item.fileType"><i v-if="item.industryLevelOne">|</i>&ensp;{{item.fileType}}</span>
              <span class="time"><i v-if="item.fileType">|</i>&ensp;{{$common.transTime(item.releaseDate)[1]}}</span>
            </div>
            <div class="row right">
            <span class="set">
              <span @click="handleChange(index, 0)">单条</span>&ensp;|&ensp;<span
              @click="handleChange(index, 1)">全部</span>
            </span>
              <button class="set-break" type="button" @click="">隐藏摘要</button>
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
    props: {
      data: {
        type: Array,
        require: false,
        default: []
      }
    },
    watch: {
      data: function (val) {
        this.listData = val;
        if (this.listData[0]) this.listData[0].show = true;
      }
    },
    created() {
      this.listData = this.data;
      if (this.listData[0]) {
        this.listData[0].show = true;
      }
      
    },
    methods: {
      //
      handleChange(index, type) {
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
