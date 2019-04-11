<template>
  <transition name="bounce">
    <div id="testPlate" class="testPlate">
      <div class="testingEnd-content-middle-item">
        <span class="testingEnd-content-middle1"><div></div></span>
        <span class="testingEnd-content-middle-text">请选择考场</span>
        <span class="testingEnd-content-middle2"><div></div></span>
      </div>
      <div class="testPlate-cont">
        <div class="testPlate-content" v-for="(list,index) in marketItem" @click="checkedImg(index)">
          <div class="testPlate-cont-icon checked1" :class="{iconImg:list.isSelected}">
            <div style="display: none">{{list.id}}</div>
          </div>
          <div class="testPlate-text">{{list.name}}</div>
          <div class="testPlate-cont-iconImg1"></div>
        </div>
      </div>
      <!--按钮答题-->
      <div class="testPlate-start" @click="startQa()">
        <button class="leftIcon">开始答题</button>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'testPlate',
    data() {
      return {
        Sco: '',
        user_id: '',
        marketItem: [
          {id: 1, name: "沪市主板", isSelected: false},
          {id: 2, name: "深市主板", isSelected: false},
          {id: 3, name: "深市中小板", isSelected: false},
          {id: 4, name: "深市创业板", isSelected: false},
        ],
        isSelected: Object,
      };
    },
    created() {

    },
    mounted() {
      /*************************************/
      document.body.addEventListener('touchstart', function () {
      });
      var userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      console.log(this.user_id);
      window.sessionStorage.removeItem("closeState");
      /**&********************************/
    },
    methods: {
      checkedImg(index) {
        for (let i in this.marketItem) {
          this.marketItem[i].isSelected = false;
        }
        this.marketItem[index].isSelected = true;

        this.isSelected = this.marketItem[index];
        console.log(this.isSelected);
      },
      startQa() {
        console.log(this.isSelected.id);
        if (this.isSelected.id == undefined) {
          this.$vux.toast.show({text: '请选择板块类别继续答题', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.$router.replace({path: "/testingList", query: {market: this.isSelected.id}});
          this.$MTAmethod.mtaShare('dongminenglicep-2', {teststartnow: true})
        }
      }
    }
  }
</script>

<style scoped>
  #testPlate {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-size: 100% 100%;
  }
  #testPlate .testPlate-cont {
    padding-top: 15.55%;
  }
  /************************/
  #testPlate .testPlate-content {
    margin-left: 25%;
    margin-bottom: 40px;
  }
  #testPlate .testPlate-cont-icon {
    width: 20px;
    height: 20px;
    background-color: rgba(240, 207, 141, 0.5);
    border-radius: 50%;
    display: inline-block;
    margin-right: 20px;
  }
  #testPlate .iconImg {
    height: 20px;
    width: 20px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA+CAYAAAB3NHh5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZFNDQ3MTVENEI1QjExRTdBNzg0QkVBQ0VCQUExNEZCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZFNDQ3MTVFNEI1QjExRTdBNzg0QkVBQ0VCQUExNEZCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkU0NDcxNUI0QjVCMTFFN0E3ODRCRUFDRUJBQTE0RkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkU0NDcxNUM0QjVCMTFFN0E3ODRCRUFDRUJBQTE0RkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6LbgAQAAAH+klEQVR42uSb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");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  #testPlate .testPlate-text {
    display: inline-block;
    font-size: 19px;
    color: white;
    position: relative;
    top: -3px;
    letter-spacing: 8px;
  }
  /**/
  /*推荐阅读*/
  #testPlate .testingEnd-content-middle-item {
    text-align: center;
    color: #f0cf8d;
    padding: 10% 0 0 0;
  }
  #testPlate .testingEnd-content-middle-text {
    padding: 0 12px;
    font-size: 23px;
  }
  #testPlate .testingEnd-content-middle1, #testPlate .testingEnd-content-middle2 {
    width: 60px;
    height: 1px;
    display: inline-block;
    border-bottom: 0.5px solid #f0cf8d;
    position: relative;
    top: -6px;
  }
  #testPlate .testingEnd-content-middle1 div {
    height: 3px;
    width: 3px;
    background-color: #f0cf8d;
    position: absolute;
    border-radius: 50%;
    right: 0;
    top: 0;
  }
  #testPlate .testingEnd-content-middle2 div {
    height: 3px;
    width: 3px;
    background-color: #f0cf8d;
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
  }
  /**/
  #testPlate .testPlate-start {
    text-align: center;
    position: absolute;
    bottom: 67.5px;
    left: 50%;
    margin-left: -97.5px;
  }
  #testPlate .leftIcon {
    width: 195px;
    height: 40px;
    border: none;
    background-color: #f0cf8d;
    color: white;
    font-size: 19px;
    text-align: center;
    line-height: 40px;
    padding: 0;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    border-radius: 30px;
    outline: none;
  }
  #testing .leftIcon:active {
    background-color: #e4c077;
  }
</style>
