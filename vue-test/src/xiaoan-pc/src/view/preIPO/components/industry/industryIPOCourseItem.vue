<template>
  <el-card shadow="never" class="box-card" body-style="padding:0 16px" id="industryIPOCourse">
    <div class="head-flex vux-1px-b">
      <div class="row title">同行业IPO进程</div>
    </div>
    <el-collapse v-model="activeName" @change="handleChange" accordion>
      <el-collapse-item :name="'text'+index" v-for="(item,index) in industryData" :key="index">
        <template slot="title">
          <div class="header-title">{{item.companyName}}</div>
          <i class="header-arrow el-icon-arrow-right"></i>
        </template>
        <!---->
        <div class="course-list vux-1px-tb">
          <div class="list-box" v-for="(itemTwo) in item.children">
            <div class="title">
              <span class="row middle">{{typeCourse[itemTwo.type].name}}</span>
            </div>
            <div class="content-desc">
              <ul class="desc-box">
                <li class="" v-for="(list) in itemTwo.children">
                  <div class="time">{{$common.transTime(list.releaseDate)[1]}}
                    <button class="status" v-if="list.approveType" :class="approveType(list.approveType).class">
                      {{approveType(list.approveType).name}}
                    </button>
                  </div>
                  <div class="text">
                    <router-link class="link hiddenLine2" :to="'/ipo/details?id='+ list.id" target="_blank">
                      {{list.title}}
                    </router-link>
                  </div>
                </li>
              </ul>
            </div>
            <div class="title bottom">
              <span class="row middle"></span>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
  export default {
    name: "company-IPO-course-item",
    components: {},
    data() {
      return {
        activeName: '',
        typeCourse: [
          {name: '', type: ''},
          {name: '预披露', type: ''},
          {name: '预披露更新', type: ''},
          {name: '反馈意见', type: ''},
          {name: '发审会', type: ''},
          {name: '核发', type: ''}
        ]
      }
    },
    props: {
      activeNames: {
        type: String,
        default: ''
      },
      industryData: Array
    },
    watch: {
      activeNames: function (val) {
        this.activeName = val
      },
      industryData: function (val) {
        console.log(this.industryData);
      }
    },
    created() {
      console.log(this.industryData);
    },
    mounted() {
    },
    methods: {
      approveType(type) {
        if (type.indexOf('获通过') > -1 || type == '通过') {
          return {name: '通过', class: 'accept'}
        } else if (type.indexOf('未通过') > -1) {
          return {name: '未通过', class: 'no-accept'}
        } else if (type.indexOf('暂缓') > -1) {
          return {name: '暂缓表决', class: 'defer'}
        } else {
          return {name: '取消审核', class: 'close'}
        }
      },
      handleChange(val) {
        console.log(val);
        this.$emit('change', val)
      }
    }
  }
</script>
<style lang="scss">
  #industryIPOCourse {
    .el-collapse {
      border: 0;
      .el-collapse-item__header {
        padding: 10px 0;
        line-height: 16px;
        height: auto;
        display: flex;
        align-items: center;
        width: 100%;
        .el-collapse-item__arrow {
          float: right;
          display: none;
        }
        .header-title {
          flex: 1;
        }
        .header-arrow {
          flex: inherit;
          transition: transform .3s, -webkit-transform .3s;
          transform: rotate(0deg);
        }
        &.is-active {
          i {
            color: #ffb148;
            transition: transform .3s, -webkit-transform .3s;
            transform: rotate(90deg);
          }
          .header-title {
            color: #ffb148;
          }
        }
      }
      .el-collapse-item__wrap {
        border-bottom: 0;
        .el-collapse-item__content {
          padding-bottom: 0;
        }
      }
    }

  }
</style>
<style lang="scss" scoped>
  #industryIPOCourse {
    .header-title {
      font-size: 14px;
      color: #323232;
      text-align: justify;
      text-justify: inherit;
      padding-right: 8px;
    }
    .head-flex {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .row {
        flex: 1;
        &.title {
          font-size: 14px;
          color: #323232;
          font-weight: bold;
          text-align: justify;
          text-justify: inherit;
        }
        &.r-pagination {
          flex: inherit;
          text-align: right;
          &.text {
            font-size: 12px;
            color: #8d8d8d;
            cursor: pointer;
            i {
              font-size: 12px;
            }
          }
        }
      }
    }
    .course-list {
      min-height: 200px;
      width: 100%;
      padding: 15px 0;
      .list-box {
        &:last-child {
          .title.bottom {
            display: block;
          }
        }
        .title {
          line-height: 1;
          .row {
            line-height: 1;
            font-size: 14px;
            color: rgba(50, 50, 50, 1);
            position: relative;
            padding-left: 18px;
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              transform-origin: 100% 100%;
              height: 8px;
              width: 8px;
              display: inline-block;
              line-height: 1;
              border-radius: 50%;
              background-color: #ffb148;
            }
          }
        }
        .title.bottom {
          display: none;
        }
      }
      .content-desc {
        padding: 8px 0 8px 17px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 3px;
          height: 100%;
          width: 2px;
          background-color: rgba(227, 227, 227, 1);
        }
        .desc-box {
          li {
            .time {
              font-size: 12px;
              color: rgba(174, 174, 174, 1);
              padding: 3px 0;
              cursor: text;
              line-height: 1;
              .status {
                border-radius: 2px;
                height: 21px;
                line-height: 1;
                display: inline-flex;
                align-items: center;
                font-size: 13px;
                background-color: #ffb148;
                color: white;
                padding: 0 6px;
                border: 0;
                transform: scale3d(0.66, 0.66, 0.66);
                cursor: default;
                &.accept {
                  background: #ffb148;
                }
                &.no-accept {
                  background: #29DA89;
                }
                &.defer {
                  background: #B45E0B;
                }
                &.close {
                  background: #FB4319;
                }
              }
            }
            .text {
              padding: 4px 11px 4px 3px;
              background: rgba(248, 248, 248, 1);
              border-radius: 2px;
              line-height: 16px;
              .link {
                max-height: 32px;
                line-height: 16px;
                font-size: 12px;
                color: rgba(84, 84, 84, 1);
                text-align: justify;
                &:hover {
                  color: #FFB148;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
