<template>
  <div class="calendar-work" ref="contDom">
    <div class="tab-container" :style="{height:tabHeight+'px'}">
      <div class="box-item">
        <div class="box-content">
          <div class="box-title">
            <div class="ul">
              <span class="li">工作日历</span>
            </div>
          </div>
          <ul class="infinite-ul">
            <li class="list-li" v-if="data.length == 0">
              <div class="bottom-origin">
                <mt-cell-swipe>
                  <div class="cell-box">
                      <span class="li">
                        <span class="title">暂无日历</span>
                      </span>
                  </div>
                </mt-cell-swipe>
              </div>
            </li>
            <li class="list-li" v-for="(list,index) in data" v-else>
              <div class="bottom-origin">
                <mt-cell-swipe :right="[
                    {content: '编辑',style: itStyle.editor,handler: () => onModify(index)},
                    {content: '删除',style: itStyle.del,handler: () => onDelete(index)}]">
                  <div class="cell-box">
                    <span class="li left"><span class="checkbox" :class="{selected:list}"></span></span>
                    <span class="li li-color">
                        <span class="list-color" :style="{backgroundColor: '#'+list.calendarColor}"></span>
                      </span>
                    <span class="li" @click="toLinkDetails(index)">
                        <span class="title">{{list.calendarName}}</span>
                      </span>
                    <span class="li right" @click="toLinkCut(index)"><i
                      class="icon iconfont icon-jibenxinxi"></i></span>
                  </div>
                </mt-cell-swipe>
              </div>
            </li>

          </ul>
        </div>
        <div class="box-content">
          <div class="box-title">
            <div class="ul">
              <span class="li">市场日历</span>
            </div>
          </div>
          <ul class="infinite-ul">
            <li class="list-li" v-for="(list,index) in data" v-if="list.isSystem">
              <div class="bottom-origin">
                <mt-cell-swipe :to="'/'" :right="[
                    {content: '编辑',style: itStyle.editor,handler: () => onModify(index)},
                    {content: '删除',style: itStyle.del,handler: () => onDelete(index)}]">
                  <div class="cell-box">
                      <span class="li left" @click="toCheckbox(index)">
                          <span class="checkbox" :class="{selected:list}"></span>
                      </span>
                    <span class="li li-color">
                          <span class="list-color"></span>
                      </span>
                    <span class="li" @click="toLinkDetails(index)">
                        <span class="title">日历名称</span>
                      </span>
                    <span class="li right" @click="toLinkCut(index)">
                        <i class="icon iconfont icon-jibenxinxi"></i>
                      </span>
                  </div>
                </mt-cell-swipe>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="add-calendar-footer" ref="footDom">
      <button @click="onCut">返回</button>
      <button @click="addCalendarClick">添加</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "calendar-work",
    data() {
      return {
        tabHeight: 0,
        detail: true,
        itStyle: {
          editor: {
            backgroundColor: '#ffb148',
            color: 'white',
            fontFamily: 'PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica'
          },
          del: {
            backgroundColor: '#ff7250',
            color: '#fff',
            fontFamily: 'PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica'
          },
        },
        data: [],
        navbar: [
          {name: '我的日历', data: 'my-calendar', id: 0, active: true},
          {name: '市场日历', data: 'market-calendar', id: 1, active: false},
          {name: '共享日历', data: 'sharing-calendar', id: 2, active: false}
        ],
        active: 'my-calendar'
      }
    },
    watch: {
      'active': function (val) {
        this.navbar.forEach((node) => {
          node.active = false;
          if (val == node.data) {
            node.active = true;
          }
        });
        console.log(val);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.tabHeight = this.$refs.contDom.clientHeight - this.$refs.footDom.clientHeight
      });
      this.$nextTick(() => {
        let doc = '';
        let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
        this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link,this.$api.share.defaultImg, true);
      })
    },
    created() {
      this.getCalendarByUserId();
    },
    methods: {
      onCut() {
        this.$router.go(-1);
      },
      //
      getCalendarByUserId() {
        /* this.$http ({
          method: 'GET',
          url: this.$api.calendar.getCalendarByUserId,
          params: {
            isPC: 0
          }
        }) */
        let params = {isPC: 0}
        this.$axios.calendar.getCalendarByUserId(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.length == 0) {
              // 暂无日历
              this.data = [];
            } else {
              // 有日历
              this.data = res.data.returnObject;
            }
          }
        }).catch((err) => {

        })
      },
      deleteCalendarInfo(index) {
        /* this.$http ({
          method: 'POST',
          url: this.$api.calendar.deleteCalendarInfo,
          params: {
            calendarId: this.data[index].id
          }
        }) */
        let params = {calendarId: this.data[index].id}
        this.$axios.calendar.deleteCalendarInfo(params).then((res) => {
          console.log('删除', res);
          if (res.data.returnCode == 1) {
            this.getCalendarByUserId();
          }
        }).catch((err) => {

        })
      },
      //
      addCalendarClick() {
        this.$router.push({path: '/calendar/addCalendar'});
      },
      // 编辑日历的属性
      toLinkCut(index) {
        console.log('123', index);
        this.$router.push({path: '/calendar/calendarModifyColor', query: {id: this.data[index].id}});
      },
      // 进入日历详情页
      toLinkDetails(index) {
        console.log('123', index);
        console.log(this.data[index]);
        this.$router.push({path: '/calendar/calendarDetails', query: {id: this.data[index].id}});
      },
      // 选择是否显示日历
      toCheckbox(index) {
        console.log('123', index);
      },
      //
      switchClick(index, $e) {
        this.active = this.navbar[index].data;
        // console.log(index, this.active);
      },
      onModify(index) {
        this.$router.push({path: '/calendar/calendarModifyColor', query: {id: this.data[index].id}});
      },
      onDelete(index) {
        this.deleteCalendarInfo(index);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .calendar-work {
    height: 100%;
    width: 100%;
    background-color: #f0f1f5;
    overflow: hidden;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
    .nav {
      height: 45px;
      width: 100%;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 1);
      white-space: nowrap;
      border-bottom: 0.5px solid #e3e3e3;
      padding: 0;
      .nav-scroll {
        width: 100%;
        display: flex;
        text-align: center;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        button {
          font-size: 15px;
          border: 0;
          text-align: center;
          background-color: rgba(255, 255, 255, 0);
          color: #8d8d8d;
        }
        button:last-child {
          margin-right: 0;
        }
        .linkScroll {
          flex: 1;
          position: relative;
          height: 45px;
          line-height: 45px;
          .nav-scroll::-webkit-scrollbar {
            display: none;
            opacity: 0;
          }
        }
        .linkScroll.active {
          color: #ffb148;
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          .nav-head-sin {
            position: absolute;
            bottom: 0;
            left: 50%;
            border-radius: 2px;
            border-bottom: 2px solid #ffb148;
            width: 30px;
            background-color: #ffb148;
            transform: translateX(-50%);
            z-index: 200;
          }
        }
      }
    }
    .add-calendar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      display: flex;
      z-index: 100;
      &:before {
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        display: block;
        background-color: #e3e3e3;
        z-index: 15;
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
        left: 0;
        top: 0;
        -webkit-transform-origin: 50% 20%;
        transform-origin: 50% 20%
      }
      button {
        flex: 1;
        font-size: 17px;
        background-color: #ffb148;
        color: #FFFFFF;
        border: 0;
        &:first-child {
          background-color: white;
          color: #ffb148;
        }
      }
    }
    .box-item {
      height: 100%;
      width: 100%;
      /*background-color: #FFFFFF;*/
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .box-content {
        .box-title {
          height: 44px;
          width: 100%;
          .ul {
            width: 100%;
            height: 100%;
            padding: 0 12px;
            display: table;
            position: relative;
            .li {
              display: table-cell;
              vertical-align: middle;
              text-align: left;
              font-size: 15px;
            }
            &:after {
              content: '';
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              display: block;
              border-bottom: 1px solid #e3e3e3;
              z-index: 30;
              -webkit-transform: scaleY(0.5);
              transform: scaleY(0.5);
              -webkit-transform-origin: 50% 50%;
              transform-origin: 50% 50%
            }
          }
        }
        .infinite-ul {
          .list-li {
            position: relative;
            height: 40px;
            .bottom-origin {
              position: absolute;
              top: 0;
              height: 39px;
              width: 100%;
              .mint-cell.mint-cell-swipe {
                min-height: auto;
                .mint-cell-wrapper {
                  .mint-cell-title {
                    flex: none !important;
                  }
                  .mint-cell-value {
                    .cell-box {
                      height: 100%;
                      width: 100%;
                      display: table;
                      .li {
                        display: table-cell;
                        vertical-align: middle;
                        line-height: 1;
                        font-size: 0;
                        .checkbox {
                          line-height: 1;
                          font-size: 0;
                          display: inline-block;
                          height: 16px;
                          width: 16px;
                          background-color: #f0f1f5;
                          border: 0.5px solid #666666;
                          border-radius: 2px;
                        }
                        .selected {
                          border: 0.5px solid #ffb148;
                          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/chengseduigou.png");
                          background-size: contain;
                          background-repeat: no-repeat;
                        }
                        .title {
                          font-size: 15px;

                        }
                        .list-color {
                          display: inline-block;
                          height: 5px;
                          width: 5px;
                          border-radius: 50%;
                          background-color: #c73560;
                        }
                      }
                      .li.li-color {
                        width: 15px;
                      }
                      .li.left {
                        width: 30px;
                      }
                      .li.right {
                        text-align: right;
                        width: 40px;
                        i {
                          font-size: 20px;
                        }
                      }
                    }
                  }
                }
                .mint-cell-right {
                  .mint-cell-swipe-buttongroup {
                    .mint-cell-swipe-button {
                      font-size: 15px;
                      padding: 0 20px;
                      line-height: 39px;
                    }
                  }
                }
              }
            }
            &:after {
              content: '';
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              display: block;
              border-bottom: 1px solid #e3e3e3;
              z-index: 30;
              -webkit-transform: scaleY(0.5);
              transform: scaleY(0.5);
              -webkit-transform-origin: 50% 50%;
              transform-origin: 50% 50%
            }

          }
        }
      }
    }
  }
</style>
