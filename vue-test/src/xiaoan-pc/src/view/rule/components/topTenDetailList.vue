<template>
  <ul class="list">
    <li v-for="(item, index) of listData" :key="index" class="vux-1px-b hover">
      <div class="title-default">
        <p class="row title">
          <router-link class="a-link" :class="{fontWeight: item.show}" :to="`/ruleDetail?id=${item.id}`" target="_blank"
                       v-html="item.title"></router-link>
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
            <router-link class="a-link desc-link hiddenLine2" :to="`/ruleDetail?id=${item.id}`" target="_blank"
                         v-html="item.describe"></router-link>
          </div>
          <div class="about">
            <div class="row left">
              <span class="form" v-if="item.issued">{{item.issued}}</span>
              <span v-if="item.date"><i v-if="item.issued && item.date">|</i>&ensp;{{item.date}}</span>
            </div>
            <!-- <div class="row left">
              <span class="form" v-if="item.date">{{item.date}}</span>
              <span v-for="(li, index) in item.plate" :key="index">
                <i v-if="li.treeNodeValue == '沪市主板'">|&ensp;沪主板</i>
                <i v-if="li.treeNodeValue == '沪市主板' && item.plate.length !== 1" class="xiegang">/</i>
                <i v-if="li.treeNodeValue == '深市主板'">|&ensp;深主板</i>
                <i v-if="li.treeNodeValue == '深市主板' && item.plate.length !== 1" class="xiegang">/</i>
                <i v-if="li.treeNodeValue == '深市中小板'">|&ensp;中小板</i>
                <i v-if="li.treeNodeValue == '深市中小板' && item.plate.length !== 1" class="xiegang">/</i>
                <i v-if="li.treeNodeValue == '深市创业板'">|&ensp;创业板</i>
                <i v-if="li.treeNodeValue == '深市创业板' && item.plate.length !== 1" class="xiegang">/</i>
                <i v-if="li.treeNodeValue == '新三板'">|&ensp;新三板</i>
                <i v-if="li.treeNodeValue == '新三板' && item.plate.length !== 1" class="xiegang">/</i>
              </span>
            </div> -->
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
      console.log(this.data)
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
            // this.$set(this.listData[index], 'show', true)
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
    min-height: 615px;
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
          max-height: 31px;
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
            font-size: 14px;
            color: rgba(50, 50, 50, 1);
            i {
              margin-right: 3px;
              vertical-align: middle;
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
          font-size: 12px;
          color: rgba(141, 141, 141, 1);
          line-height: 16px;
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
