<template>
  <div class="calendar-list xiaoan-popup popup-calendar">
    <div class="calendar-work" ref="contDom">
      <div class="tab-container" :style="{height:tabHeight+'px'}">
        <div class="box-item">
          <div class="box-content">
            <div class="box-title">
              <div class="ul">
                <span class="li">我的日历</span>
              </div>
            </div>
            <ul class="infinite-ul">
              <li class="list-li">
                <swipeout>
                  <swipeout-item v-for="(list, index) in data.personalData" :key="list.id" transition-mode="reveal"
                                 v-if="list.calendarName == '我的日历'">
                    <div :slot="'right-menu'">
                      <swipeout-button @click.native="toLinkDetails(0, index)" :background-color="'#ffd091'">分享
                      </swipeout-button>
                      <swipeout-button @click.native="toLinkCut(0, index)" background-color="#ffb148">编辑
                      </swipeout-button>
                    </div>
                    <div class="cell-box" :slot="'content'" @click="getToShow(0, index)">
                      <span class="li left">
                        <span class="checkbox"
                              :style="{borderColor: list.show?'#'+list.calendarColor:'#e3e3e3'}">
                          <i class="icon iconfont icon-checkbox"
                             :style="{color: '#'+list.calendarColor}" v-show="list.isCheck"></i>
                        </span>
                      </span>
                      <span class="li li-color" v-if="false">
                        <span class="list-color" :style="{backgroundColor: '#'+list.calendarColor}"></span>
                      </span>
                      <span class="li text">
                        <span class="title">{{list.calendarName}}</span>
                      </span>
                    </div>
                  </swipeout-item>
                  <swipeout-item v-for="(list, index) in data.personalData" :key="list.id" transition-mode="reveal"
                                 v-if="list.calendarName != '我的日历'">
                    <div :slot="'right-menu'">
                      <swipeout-button @click.native="toLinkDetails(0, index)" :background-color="'#ffd091'">分享
                      </swipeout-button>
                      <swipeout-button @click.native="toLinkCut(0, index)" background-color="#ffb148">编辑
                      </swipeout-button>
                      <swipeout-button @click.native="onDelete(0,index)" type="warn">删除</swipeout-button>
                    </div>
                    <div class="cell-box" :slot="'content'" @click="getToShow(0, index)">
                      <span class="li left">
                        <span class="checkbox" :style="{borderColor: list.show?'#'+list.calendarColor:'#e3e3e3'}">
                          <i class="icon iconfont icon-checkbox" :style="{color: '#'+list.calendarColor}"
                             v-if="list.isCheck"></i>
                        </span>
                      </span>
                      <span class="li li-color" v-if="false">
                        <span class="list-color" :style="{backgroundColor: '#'+list.calendarColor}"></span>
                      </span>
                      <span class="li text">
                        <span class="title">{{list.calendarName}}</span>
                      </span>
                      <span v-show="false" class="li right" @click="toLinkCut(0,index)">
                        <i class="icon iconfont icon-jibenxinxi"></i>
                      </span>
                    </div>
                  </swipeout-item>
                  <swipeout-item v-for="(list, index) in data.shareData" :key="list.id" transition-mode="reveal">
                    <div :slot="'right-menu'">
                      <swipeout-button @click.native="toLinkCut(1, index)" background-color="#ffb148">编辑
                      </swipeout-button>
                      <swipeout-button @click.native="onDelete(1,index)" type="warn">删除</swipeout-button>
                    </div>
                    <div class="cell-box" :slot="'content'" @click="getToShow(1,index)">
                      <span class="li left">
                        <span class="checkbox"
                              :style="{borderColor: list.show?'#'+list.calendarColor:'#e3e3e3'}">
                          <i class="icon iconfont icon-checkbox" :style="{color: '#'+ list.calendarColor}"
                             v-show="list.isCheck"></i>
                        </span>
                      </span>
                      <span class="li li-color" v-if="false">
                        <span class="list-color" :style="{backgroundColor: '#'+list.calendarColor}"></span>
                      </span>
                      <span class="li text">
                        <span class="title" v-if="list.shareCalendarName">{{list.shareCalendarName}}</span>
                        <span class="title" v-else>{{list.calendarName}}</span>
                      </span>
                    </div>
                  </swipeout-item>
                </swipeout>
              </li>
            </ul>
          </div>
          <div class="box-content">
            <div class="box-title">
              <div class="ul">
                <span class="li">市场日历</span>
              </div>
              <ul class="infinite-ul">
                <li class="list-li">
                  <swipeout>
                    <swipeout-item v-for="(list, index) in data.marketData" :key="index" transition-mode="follow">
                      <div class="cell-box" :slot="'content'" @click="getToShow(2,index)">
                        <span class="li left">
                          <span class="checkbox"
                                :style="{borderColor: list.show?'#'+list.calendarColor:'#e3e3e3'}">
                            <i class="icon iconfont icon-checkbox" :style="{color: '#'+list.calendarColor}"
                               v-show="list.isCheck"></i>
                          </span>
                        </span>
                        <span class="li li-color" v-if="false">
                          <span class="list-color" :style="{backgroundColor: '#'+list.calendarColor}"></span>
                        </span>
                        <span class="li text">
                          <span class="title">{{list.calendarName}}</span>
                        </span>
                      </div>
                    </swipeout-item>
                  </swipeout>
                </li>
              </ul>
            </div>
          </div>
          <div class="box-content">
            <div class="box-title">
              <div class="ul foo">
                <span class="li"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="add-calendar-footer" ref="footDom">
        <button @click="addCalendarClick">添加</button>
        <button @click="onCut">查看事件</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {Swipeout, SwipeoutButton, SwipeoutItem} from 'vux'

  export default {
    name: "calendar-list",
    data() {
      return {
        data: {
          defaultData: [],
          shareData: [],
          marketData: [],
          personalData: []
        },
        tabHeight: '',
        calendar: {
          calendarIds: 0,
        }
      }
    },
    components: {
      Swipeout, SwipeoutItem, SwipeoutButton
    },
    created() {
      this.getUserCanlendarList();
    },
    mounted() {
      this.$nextTick(() => {
        this.tabHeight = this.$refs.contDom.clientHeight - this.$refs.footDom.clientHeight
      })
    },
    methods: {
      updateCalendarCheckedStatus(id, check, share, isSystem) {
        /*this.$http({
          method: 'POST',
          url: this.$api.calendar.updateCalendarCheckedStatus,
          params: {
            calendarId: id,
            isChecked: check,
            isShare: share,
            isSystem: isSystem,
            isTeam: 0
          }
        })*/
        let params = {
          calendarId: id,
          isChecked: check,
          isShare: share,
          isSystem: isSystem,
          isTeam: 0
        }
        this.$axios.calendar.updateCalendarCheckedStatus(params).then((res) => {
          if (res.data.returnCode == 1) {
            this.getUserCanlendarList();
          } else {
            this.$vux.toast.show({text: '修改失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      },
      //
      addCalendar() {
        /*this.$http({
          method: 'POST',
          url: this.$api.calendar.addCalendar,
          params: {
            calendarName: '我的日历',
            calendarRemark: '创建我的日历'
          }
        })*/
        let params = {
          calendarName: '我的日历',
          calendarRemark: '创建我的日历'
        }
        this.$axios.calendar.addCalendar(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1) {
            this.getUserCanlendarList();
          } else if (res.data.returnCode == -1) {
            // this.$toast({message: '创建日历失败', position: 'middle', duration: 1500});
          }
        }).catch((err) => {

        })
      },
      // 个人获取 // 获取我的日历
      getUserCanlendarList() {
        let calendarIds = [];
        if (window.sessionStorage.getItem('calendarIds')) {
          calendarIds = window.sessionStorage.getItem('calendarIds').split(',');
        }
        console.log('56757576575757', calendarIds);
        /*this.$http({
          method: 'GET',
          url: this.$api.calendar.getUserCanlendarList,
          params: {
            isPC: 0
          }
        })*/
        let params = {isPC: 0}
        this.$axios.calendar.getUserCanlendarList(params).then((res) => {
          console.log('edrwasrdfsafsadfdsfsfdsfs', res);
          if (res.data.returnCode == 1) {
            // debugger
            if (res.data.returnObject.shareCalendar) {
              this.data.shareData = res.data.returnObject.shareCalendar;
              this.data.shareData.forEach((item, index) => {
                item.market = false;
              });
            } else {
              this.data.shareData = [];
            }
            //
            let myCalendar = {};
            if (res.data.returnObject.personalCalendar) {
              this.data.personalData = res.data.returnObject.personalCalendar;
              this.data.personalData.forEach((item) => {
                item.market = false;
                // if (item.calendarName == '我的日历') {
                //   myCalendar = item;
                // }
              });
              // 增加兼容 如果是我的日历没有颜色的话默认附加颜色
              // if (myCalendar.calendarColor == null || myCalendar.calendarColor == '') {
              //   this.editCalendarColor(myCalendar);
              // }
            } else {
              this.data.personalData = [];
              // 如果没有日历 默认帮助他创建默认日历
              this.addCalendar();
            }
            //
            // 获取的市场日历
            if (res.data.returnObject.marketCalendar) {
              this.data.marketData = res.data.returnObject.marketCalendar;
              this.data.marketData.forEach((item) => {
                item.market = true;
              });
            }
            //
            let data = [];
            this.data.defaultData = data.concat(this.data.marketData, this.data.shareData, this.data.personalData);
            let newData = [];
            this.data.defaultData.forEach((item) => {
              if (item.isCheck == true) {
                newData.push(item.id);
              }
            });
            this.calendar.calendarIds = newData.join(",");
            console.log('4323452354235345', this.calendar.calendarIds);
          }
        }).catch((err) => {
          this.$vux.toast.show({text: err, position: 'middle', type: 'text', width: 'auto', time: 3500});
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 3500});
          this.$vux.toast.show({text: '获取日历数据失败', position: 'middle', type: 'text', width: 'auto', time: 3500});
        })
      },
      // 修改日历颜色
      editCalendarColor(data) {
        /*this.$http({
          method: 'POST',
          url: this.$api.calendar.editCalendarColor,
          params: {
            calendarId: data.id,
            calendarColor: data.calendarColor,
            isShare: data.isShare
          }
        })*/
        let params = {
          calendarId: data.id,
          calendarColor: data.calendarColor,
          isShare: data.isShare
        }
        this.$axios.calendar.editCalendarColor(params).then((res) => {
          if (res.data.returnCode == 1) {
            console.log('修改成功');
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      // 添加日历
      addCalendarClick() {
        this.$router.push({path: '/calendar/addCalendar'});
      },
      //
      onCut() {
        this.$router.replace('/calendar/calendarAll');
      },
      //
      getToShow(or, index) {
        let id = '';
        let check = '';
        let share = '';
        let isSystem = '';
        let data = {};
        switch (or) {
          case 0:
            data = this.data.personalData[index];
            break;
          case 1:
            data = this.data.shareData[index];
            break;
          case 2:
            data = this.data.marketData[index];
            break
        }
        id = data.id;
        //
        if (data.isCheck) {
          check = 0;
        } else {
          check = 1;
        }
        //
        if (data.isShare) {
          share = 1;
        } else {
          share = 0;
        }
        if (data.isSystem) {
          isSystem = 1;
        } else {
          isSystem = 0;
        }
        this.updateCalendarCheckedStatus(id, check, share, isSystem);
        console.log(id, check, share, isSystem);
      },
      // 进入日历详情页
      toLinkDetails(or, index) {
        switch (or) {
          case 0:
            console.log(this.data[index]);
            this.$router.push({
              path: '/calendar/calendarDetails',
              query: {id: this.data.personalData[index].id, isShare: this.data.personalData[index].isShare}
            });
            break;
          case 1:
            console.log(this.data[index]);
            this.$router.push({
              path: '/calendar/calendarDetails',
              query: {id: this.data.shareData[index].id, isShare: this.data.shareData[index].isShare}
            });
            break;
        }
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'jf3pxaaw4sk6q43b': 'true'})
      },
      // 删除日历按钮
      onDelete(or, index) {
        let calendarName = '';
        switch (or) {
          case 0:
            calendarName = this.data.personalData[index].calendarName;
            break;
          case 1:
            calendarName = this.data.shareData[index].calendarName;
            break;
        }
        const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
        this.$vux.confirm.show({
          title: '',
          content: '确定要移除“' + calendarName + '”吗？您将无法再查看此日历和其中的活动。',
          // 组件除show外的属性
          onCancel() {
          },
          onConfirm() {
            _this.deleteCalendarInfo(or, index);
          }
        })
      },
      // 删除个人工作日历
      deleteCalendarInfo(or, index) {
        console.log('123', this.data.personalData, index, this.data.personalData[index]);
        let calendarId = '';
        switch (or) {
          case 0:
            calendarId = this.data.personalData[index].id;
            break;
          case 1:
            calendarId = this.data.shareData[index].id;
            break;
        }
        /*this.$http({
          method: 'POST',
          url: this.$api.calendar.deleteCalendarInfo,
          params: {
            calendarId: calendarId,
            isShare: or
          }
        })*/
        let params = {
          calendarId: calendarId,
          isShare: or
        }
        this.$axios.calendar.deleteCalendarInfo(params).then((res) => {
          console.log('删除', res);
          if (res.data.returnCode == 1) {
            this.getUserCanlendarList();
          } else {
            this.$vux.toast.show({
              text: '删除日历失败，建议您刷新页面重试',
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 1500
            });
          }
        }).catch((err) => {

        })
      },
      // 编辑日历的属性
      toLinkCut(or, index) {
        console.log('123', index);
        switch (or) {
          case 0:
            this.$router.push({
              path: '/calendar/calendarModifyColor',
              query: {id: this.data.personalData[index].id, isShare: this.data.personalData[index].isShare}
            });
            break;
          case 1:
            window.localStorage.setItem('editCalendarList', window.JSON.stringify(this.data.shareData[index]));
            this.$router.push({
              path: '/calendar/calendarModifyColor',
              query: {id: this.data.shareData[index].id, isShare: this.data.shareData[index].isShare}
            });
            break;
        }
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'y78vfmp2rvn5grqg': 'true'})
      },
    }
  }
</script>

<style lang="scss">
  /**/
  .calendar-list.xiaoan-popup.popup-calendar {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    .calendar-work {
      height: 100%;
      width: 100%;
      background-color: #fff;
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
      .tab-container {
        background-color: #FFFFFF;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        .box-item {
          .box-content {
            .box-title {
              height: auto;
              width: 100%;
              .ul.foo {
                height: 50px;
                &:after {
                  border-bottom: 0px solid #e3e3e3;
                }
              }
              .ul {
                width: 100%;
                padding: 16px 12px;
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
                  transform-origin: 50% 50%;
                }
              }
            }
            .infinite-ul {
              .list-li {
                position: relative;
                height: auto;
                .cell-box {
                  height: 100%;
                  width: 100%;
                  display: table;
                  padding: 0 12px;
                  position: relative;
                  /*&:active {*/
                  /*background-color: #f0f1f5;*/
                  /*}*/
                  .li {
                    display: table-cell;
                    vertical-align: middle;
                    line-height: 1;
                    font-size: 0;
                    padding: 15px 0;
                    .checkbox {
                      line-height: 1;
                      font-size: 0;
                      display: inline-block;
                      height: 17px;
                      width: 17px;
                      background-color: #f0f1f5;
                      /*border: 0.5px solid #e3e3e3;*/
                      border-radius: 2px;
                      .icon-checkbox {
                        color: rgb(199, 53, 96);
                        font-size: 17px;
                      }
                    }
                    .checkbox.borderColor {
                      //  border-color: ;
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
                    padding-right: 0;
                    padding-left: 0;
                    width: 5%;
                  }
                  .li.left {
                    width: 10%;
                  }
                  .li.text {
                    width: 78%;
                  }
                  .li.right {
                    text-align: right;
                    width: 12%;
                    display: table-cell;
                    i {
                      display: inline-block;
                      font-size: 20px;
                      text-align: right;
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
      }

    }
  }
</style>
