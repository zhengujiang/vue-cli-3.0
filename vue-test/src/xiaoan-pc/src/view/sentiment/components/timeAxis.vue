<template>
  <div id="timeAxis">
    <el-dialog id="timeAxis-dialog" :visible.sync="dialogVisibleii.dataType" width="400px" :before-close="handleClose">
      <div slot="title" class="title timeAxisBox">传播路径</div>
      <div class="timeAxisBox">
        <ul class="timeList">
          <div v-for="list in dialogVisibleii.dataInfo">
            <h3 class="label">{{list.date}}</h3>
            <div v-for="title in list.dataList">
              <li>
                <span>{{title.time}}</span>
                <p><span>{{title.media}}</span></p>
              </li>
            </div>
          </div>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "timeAxis",
    components: {},
    data() {
      return {
        dialogVisible: true
      }
    },
    props: {
      dialogVisibleii: {
        "dataInfo": [],
        "dataType": ''
      }
    },
    methods: {
      handleClose() {
        this.dialogVisibleii.dataType = false;
      }
    }
  }
</script>

<style lang="scss">
  #timeAxis-dialog .el-dialog {
    margin: 0 !important;
    position: absolute;
    right: 0;
    /*height: calc(100% - 60px);*/
    height: 100%;
    .el-dialog__header {
      text-align: center;
      background-color: #FFF7EC;
      padding: 10px 20px;
      font-weight: 800;
      position: fixed;
      top: 0;
      width: 400px;
      .el-dialog__headerbtn {
        top: 10px;
      }
    }
    .el-dialog__body {
      overflow: hidden;
      margin-top: 42px;
      padding: 30px 0;
      background-color: #fff;
    }
  }
  .timeList {
    width: 400px;
    overflow: hidden;
    float: right;
    /*background: url('../../../assets/image/sentiment/timeline.svg') 117px 0 repeat-y;*/
    background: url('../../../assets/image/sentiment/timeline.png') 117px 0 no-repeat;
    margin: 0;
    cursor: default;
    .label {
      cursor: default;
      margin: 0 0 10px 109px;
      font-size: 18px;
      color: #FFB148;
      padding-left: 25px;
      background: url('../../../assets/image/sentiment/point-highlight.svg') 3px 12px no-repeat;
      height: 38px;
      line-height: 36px;
    }
    p {
      margin: 0;
      padding: 0;
    }
    li {
      list-style: none;
      cursor: default;
      background: url('../../../assets/image/sentiment/point-gray.svg') 112px 15px no-repeat;
      span {
        width: 100px;
        text-align: right;
        display: block;
        float: left;
        margin-top: 10px;
      }
      p {
        max-width: 240px;
        margin-left: 24px;
        display: inline-block;
        line-height: 30px;
        span {
          width: auto;
          text-align: left;
          padding: 6px 10px;
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
</style>
<style>
  #timeAxis #timeAxis-dialog {
    z-index: 20000 !important;
    top: 0 !important;
  }
</style>
