<template>
  <div class="calendar-modify-color" ref="docmentDom">
    <div class="back-item" :style="{height:tabHeight+'px'}">
      <div class="back-item-title">
        <span>设置</span>
      </div>
      <div class="back-item-box" v-show="isShare == 'true'|| isShare == true">
        <ul class="back-item-ul">
          <li class="title">日历名称</li>
          <li class="right-value">
            <div>{{this.calendarDetailsData.calendarName+'(来自'+calendarDetailsData.belongsUserName+'的分享)'}}</div>
          </li>
        </ul>
      </div>
      <div class="back-item-box">
        <ul class="back-item-ul">
          <li class="title" v-if="isShare == 'true' || isShare == true">别&ensp;&ensp;&ensp;&ensp;名</li>
          <li class="title" v-else>日历名称</li>
          <li class="right-value">
            <input v-model="calendarName" class="text" type="text" placeholder="输入日历别名"/>
          </li>
        </ul>
      </div>
      <div class="back-item-box">
        <ul class="back-item-ul">
          <li class="title textdub">备&ensp;&ensp;&ensp;&ensp;注</li>
          <li class="right-value">
            <textarea v-model="remark" class="textarea" placeholder="输入日历备注"></textarea>
          </li>
        </ul>
      </div>
      <div class="back-item-box box-color"  v-show="(isShare == 'false'|| isShare == false)">
        <div class="back-item-title">
          <span>设置颜色</span>
        </div>
        <ul class="back-item-ul">
          <li class="cell-box" v-for="(list, index) in colorData">
            <div class="cell-box-item" @click="toCheckbox(index)">
                <span class="li li-color">
                    <span class="list-color" :style="{backgroundColor:list.color}"></span>
                </span>
              <span class="li">
                  <span class="title">{{list.name}}</span>
                </span>
              <span class="li right">
                  <span class="checkbox" :class="{selected:list.isActive}"></span>
                </span>
            </div>
          </li>
        </ul>
        <div class="back-item-title">
          <span></span>
        </div>
      </div>
    </div>
    <div class="add-calendar-footer" ref="footDom">
      <!--<button @click="onShareFriend" v-if="isShare == false">分享</button>-->
      <button @click="onCut">取消</button>
      <button @click="onUpData">保存</button>
    </div>
    <transition name="bounce">
      <div class="share-shadow" v-show="onshare" @click="onshare=false">
        <div class="img-box">
          <img :src="onshareImg" alt="">
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {XSwitch} from 'vux'

  export default {
    name: "calendar-modify-color",
    components: {
      XSwitch
    },
    data() {
      return {
        onshare: false,
        onshareImg: this.$image.calendar.calendarshare,
        colorData: [
          {id: '0', name: '红', type: 'color', color: '#c73560', value: 'c73560', isActive: false},
          {id: '1', name: '橙', type: 'color', color: '#e25e23', value: 'e25e23', isActive: false},
          {id: '2', name: '黃', type: 'color', color: '#e6cb59', value: 'e6cb59', isActive: false},
          {id: '3', name: '绿', type: 'color', color: '#3d9752', value: '3d9752', isActive: false},
          {id: '4', name: '蓝', type: 'color', color: '#4a5cd5', value: '4a5cd5', isActive: false},
          {id: '5', name: '紫', type: 'color', color: '#822ea4', value: '822ea4', isActive: false},
          // {id: '6', name: '褐', type: 'color', color: '#a59b8f', value: 'a59b8f', isActive: false}
        ],
        tabHeight: 0,
        isShare: false,
        calendarId: 0,
        calendarColor: '',
        calendarName: '',
        editCalendarList: {},
        remark: '',
        toGet: 0,
        data: {
          defaultData: [],
          shareData: [],
          marketData: [],
          personalData: []
        },
        calendarDetailsData: {},

      }
    },
    watch: {
      toGet: function (val) {
        if (val >= 2) {
          this.$router.replace({path: '/calendar/calendarList'});
        }
      }
    },
    created() {
      this.calendarId = this.$route.query.id;
      //
      this.getUserCanlendarList();
      //

    },
    mounted() {
      this.$nextTick(() => {
        this.tabHeight = this.$refs.docmentDom.clientHeight - this.$refs.footDom.clientHeight;
      })
      this.$nextTick(() => {
        this.isShare = this.$route.query.isShare;
        console.log(' this.isShare', this.isShare);
        this.userHome = this.$cookie.getUserInfo()
        this.calendarId = this.$route.query.id;
        this.editCalendarList = window.JSON.parse(window.localStorage.getItem('editCalendarList'));
        console.log('11111111111111', this.userHome);
      });

      let doc = '';
      let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
      this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link, this.$api.share.defaultImg, true);
    },
    methods: {
      //
      onShareFriend() {
        this.onshare = true;
      },
      //
      onCut() {
        this.$router.go(-1);
      },
      onUpData() {
        if (this.$route.query.isShare) {
          // 是分享的编辑
          this.editCalendarInfo();
        } else {
          this.editCalendarColor();
          this.editCalendarInfo();
        }
      },
      // 分享
      getShareCalendarLink() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getShareCalendarLink,
          params: {
            calendarId: this.$route.query.id
          }
        })*/
        let params = {calendarId: this.$route.query.id}
        this.$axios.calendar.getShareCalendarLink(params).then((res) => {
          console.log('getShareCalendarLink', res);
          console.log('getShareCalendarLink', this.$api.CURRENTIP.IP);
          if (res.data.returnCode == 1) {
            // this.$nextTick(() => {
            //   this.userHome.userName = decodeURI(this.userHome.userName);
            //   let title = '点击订阅' + this.userHome.userName + '分享的日历';
            //   let doc = '';
            //   let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll?cid=' + res.data.returnObject;
            //   this.$weixin.wxshare(title, doc, link, this.$api.share.defaultImg, true);
            // });
          }
        }).catch(() => {

        });
      },
      // 个人获取
      getUserCanlendarList() {
        /*this.$http ({
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
            //
            if (res.data.returnObject.shareCalendar) {
              this.data.shareData = res.data.returnObject.shareCalendar;
            } else {
              this.data.shareData = [];
            }
            //
            if (res.data.returnObject.personalCalendar) {
              this.data.personalData = res.data.returnObject.personalCalendar;
            } else {
              this.data.personalData = [];
              // 如果没有日历 默认帮助他创建默认日历
              this.addCalendar();
            }
            // 获取的市场日历
            if (res.data.returnObject.marketCalendar) {
              let marketData = res.data.returnObject.marketCalendar;
              marketData.forEach((item, index) => {
                item.show = true;
              });
              this.data.marketData = marketData;
            }
            this.data.defaultData = this.data.shareData.concat(this.data.personalData);
            console.log('22222222222', this.data.defaultData);
            //
            this.data.defaultData.forEach((item) => {
              if (item.id == this.$route.query.id) {
                this.calendarDetailsData = item;
              }
            });
            //
            if (this.calendarDetailsData.calendarColor) {
              this.colorData.forEach((item) => {
                if (item.value == this.calendarDetailsData.calendarColor) {
                  item.isActive = true;
                }
              });
            }
            if (this.$route.query.isShare == true) {
              this.calendarName = this.calendarDetailsData.shareCalendarName;
            } else {
              this.calendarName = this.calendarDetailsData.calendarName;
            }
            this.remark = this.calendarDetailsData.calendarRemark;
            this.calendarColor = this.calendarDetailsData.calendarColor;
            console.log('this.calendarDetailsData', this.calendarName, this.calendarDetailsData);
          }
        }).catch((err) => {

        })
      },
      //
      toCheckbox(index) {
        this.colorData.forEach((item, index) => {
          // console.log(item, index);
          if (item.isActive == true) {
            item.isActive = false
          }
        });
        this.colorData[index].isActive = true;
        this.calendarColor = this.colorData[index].value;
        console.log(this.colorData[index]);
      },
      //
      editCalendarInfo() {
        let isShare = this.$route.query.isShare ? 1 : 0;
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.editCalendarInfo,
          params: {
            calendarId: this.calendarId,
            calendarName: this.calendarName,
            remark: this.remark,
            isShare: isShare
          }
        })*/
        let params = {
          calendarId: this.calendarId,
          calendarName: this.calendarName,
          remark: this.remark,
          isShare: isShare
        }
        this.$axios.calendar.editCalendarInfo(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1) {
            if(this.$route.query.isShare){
              this.toGet += 2;
            }else {
              this.toGet += 1;
            }
            // this.getCalendarByUserId();
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      // 修改日历颜色
      editCalendarColor() {
        let isShare = this.$route.query.isShare ? 1 : 0;
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.editCalendarColor,
          params: {
            calendarId: this.calendarId,
            calendarColor: this.calendarColor,
            isShare: isShare
          }
        })*/
        let params = {
          calendarId: this.calendarId,
          calendarColor: this.calendarColor,
          isShare: isShare
        }
        this.$axios.calendar.editCalendarColor(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1) {
            this.toGet += 1;
          }
        }).catch((err) => {
          console.log(err);
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .calendar-modify-color {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    * {
      box-sizing: border-box;
    }
    .share-shadow {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 2000;
      .img-box {
        width: 100%;
        margin: auto;
        text-align: center;
        padding-top: 30px;
        img {
          width: 300px;
          padding-left: 38px;
        }
      }
    }
    .back-item {
      height: 100%;
      width: 100%;
      color: #e3e3e3;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .back-item-title {
        background-color: #fff;
        height: 50px;
        width: 100%;
        display: table;
        padding: 0 12px;
        position: relative;
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
        span {
          display: table-cell;
          vertical-align: middle;
          font-size: 15px;
          font-family: PingFangSC-M, sans-serif, Microsoft Yahei, Helvetica;
          color: #545454;
        }
      }
      .back-item-box {
        /*margin-top: 20px;*/
        padding: 12px;
        width: 100%;
        background-color: #FFFFFF;
        .back-item-ul {
          display: table;
          width: 100%;
          /*padding-bottom: 12px;*/
          &:last-child {
            padding-bottom: 0;
          }
          li {
            display: table-cell;
            font-size: 15px;
            color: #545454;
            vertical-align: middle;
          }
          .title {
            width: 22%;
            text-align: left;
            span {
              color: #ffb148;
            }
          }
          .title.textdub {
            vertical-align: top;
          }
          .right-value {
            padding-left: 10px;
            text-align: justify;
            .text {
              height: 40px;
              color: #8d8d8d;
              width: 100%;
              font-size: 15px;
              border: 0.5px solid #e3e3e3;
              border-radius: 2px;
              padding: 0 10px;
            }
            .textarea {
              width: 100%;
              padding: 10px;
              border: 0.5px solid #e3e3e3;
              border-radius: 2px;
              resize: none;
              outline: none;
              min-height: 75px;
              font-size: 15px;
              color: #8d8d8d;
            }

          }
        }
      }
      .back-item-box.box-color {
        background-color: #f0f1f5;
        padding: 0 0;
        .back-item-ul {
          display: inherit;
          height: auto;
          background-color: #FFFFFF;
        }
        .back-item-title {
          background-color: #fff;
          height: 50px;
          width: 100%;
          display: table;
          padding: 0 12px;
          span {
            display: table-cell;
            vertical-align: middle;
            font-size: 15px;
            color: #545454;
          }
        }
        .cell-box {
          height: 40px;
          width: 100%;
          display: inherit;
          padding: 0 12px;
          background-color: #FFFFFF;
          position: relative;
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
          .cell-box-item {
            display: table;
            width: 100%;
            height: 100%;
            .li {
              height: 100%;
              display: table-cell;
              vertical-align: middle;
              line-height: 1;
              font-size: 0;
              .checkbox {
                font-size: 0;
                display: inline-block;
                height: 16px;
                width: 16px;
                background-color: #f0f1f5;
                border: 0.5px solid #e3e3e3;
                border-radius: 2px;
                text-align: right;
              }
              .selected {
                border: 0.5px solid #ffb148;
                background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/chengseduigou.png");
                background-size: contain;
                background-repeat: no-repeat;
              }
              .title {
                font-size: 15px;
                width: 100%;

              }
              .list-color {
                display: inline-block;
                height: 5px;
                width: 5px;
                border-radius: 50%;
                background-color: #666666;
              }
            }
            .li.li-color {
              width: 15px;
            }
            .li.left {
              width: 30px;
              /*text-align: right;*/
            }
            .li.right {
              text-align: right;
              text-align-last: right;
              width: 44px;
              .vux-x-switch.weui-cell.weui-cell_switch {
                padding-top: 0;
                padding-bottom: 0;
                .weui-switch:checked {
                  background-color: #ffb148;
                  border-color: #ffb148;
                }
              }
            }
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
  }
</style>
