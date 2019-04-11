<template>
  <div class="add-calendar">
    <div class="back-item">
      <div class="back-item-title">
        <span>设置</span>
      </div>
      <div class="back-item-box">
        <ul class="back-item-ul">
          <li class="title">日历名称</li>
          <li class="right-value">
            <input class="text" v-model="calendarName" @input="calendarNameInput" type="text" placeholder="输入日历名称"/>
          </li>
        </ul>
      </div>
      <div class="back-item-box">
        <ul class="back-item-ul">
          <li class="title textdub">备&ensp;&ensp;&ensp;&ensp;注</li>
          <li class="right-value">
            <textarea v-model="calendarRemark" class="textarea" placeholder="输入日历备注"></textarea>
          </li>
        </ul>
      </div>
    </div>
    <div class="add-calendar-footer" ref="footDom">
      <button @click="onCut">取消</button>
      <button @click="addCalendar">确定</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "add-calendar",
    data() {
      return {
        colorData: [
          {id: '0', name: '红', type: 'color', color: '#c73560', value: 'c73560', isActive: false},
          {id: '1', name: '橙', type: 'color', color: '#e25e23', value: 'e25e23', isActive: false},
          {id: '2', name: '黃', type: 'color', color: '#e6cb59', value: 'e6cb59', isActive: false},
          {id: '3', name: '绿', type: 'color', color: '#3d9752', value: '3d9752', isActive: false},
          {id: '4', name: '蓝', type: 'color', color: '#4a5cd5', value: '4a5cd5', isActive: false},
          {id: '5', name: '紫', type: 'color', color: '#822ea4', value: '822ea4', isActive: false},
        ],
        calendarName: '',
        calendarRemark: '',
        data: {
          defaultData: [],
          shareData: [],
          marketData: [],
          personalData: []
        },
        isSelectedColor: ''
      }
    },
    created() {
      this.getUserCanlendarList();
    },
    mounted() {
      this.$nextTick(() => {
        let doc = '';
        let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
        this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link, this.$api.share.defaultImg, true);
      })
    },
    methods: {
      calendarNameInput() {
        this.calendarName = this.$array.trim(this.calendarName);
      },
      // 返回上一级
      onCut() {
        this.$router.go(-1);
      },
      //
      toCheckbox(index) {
        this.colorData.forEach((item, index) => {
          console.log(item, index);
          if (item.isActive == true) {
            item.isActive = false
          }
        });
        this.colorData[index].isActive = true;
        console.log(this.colorData[index]);
      },
      // 个人获取 // 获取我的日历
      getUserCanlendarList() {
        let calendarIds = [];
        if (window.sessionStorage.getItem('calendarIds')) {
          calendarIds = window.sessionStorage.getItem('calendarIds').split(',');
        }
        console.log('56757576575757', calendarIds);
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getUserCanlendarList,
          params: {
            isPC: 0
          }
        })*/
        let params = {
          isPC: 0
        }
        this.$axios.calendar.getUserCanlendarList(params).then((res) => {
          console.log('edrwasrdfsafsadfdsfsfdsfs', res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.personalCalendar) {
              this.data.personalData = res.data.returnObject.personalCalendar;
              this.data.personalData.forEach((item) => {
                item.market = false;
              });
            } else {
              this.data.personalData = [];
              // 如果没有日历 默认帮助他创建默认日历
            }
            //
            this.data.defaultData = this.data.personalData;
            let color = '';
            let calendarLen = this.data.personalData.length;
            if (calendarLen <= 6) {
              color = this.colorData[calendarLen];
            } else if (calendarLen > 6 && calendarLen <= 12) {
              color = this.colorData[calendarLen - 6];
            } else if (calendarLen > 12) {
              color = this.colorData[calendarLen % 6];
            }
            this.isSelectedColor = color.value;
            console.log('234213413131313', color)
          }
        }).catch((err) => {

        })
      },
      // 添加日历
      addCalendar() {
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.addCalendar,
          params: {
            calendarName: this.calendarName,
            calendarRemark: this.calendarRemark,
            calendarColor: this.isSelectedColor
          }
        })*/
        let params = {
          calendarName: this.calendarName,
          calendarRemark: this.calendarRemark,
          calendarColor: this.isSelectedColor
        }
        this.$axios.calendar.addCalendar(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1) {
            this.$router.replace({path: '/calendar/calendarList'});
          } else if (res.data.returnCode == 2) {
            this.$toast({message: '日历名称不能重复', position: 'middle', duration: 1500});
          } else if (res.data.returnCode == -1) {
            this.$toast({message: '创建日历失败', position: 'middle', duration: 1500});
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  .add-calendar {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    * {
      box-sizing: border-box;
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
        span {
          display: table-cell;
          vertical-align: middle;
          font-size: 15px;
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
          color: #545454;
        }
        &:after {
          content: '';
          position: absolute;
          height: 1px;
          width: 100%;
          display: block;
          background-color: #e3e3e3;
          z-index: 15;
          -webkit-transform: scaleY(0.33);
          transform: scaleY(0.33)
        }
        &:after {
          left: 0;
          bottom: 0;
          -webkit-transform-origin: 50% 70%;
          transform-origin: 50% 70%
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
          padding-bottom: 12px;
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
              width: 100%;
              font-size: 15px;
              border: 0.5px solid #e3e3e3;
              border-radius: 2px;
              padding: 0 10px;
              color: #8d8d8d;
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
          background-color: #f0f1f5;
          height: 40px;
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
                border: 0.5px solid #666666;
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
              width: 40px;
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
