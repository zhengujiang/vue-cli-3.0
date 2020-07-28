<template>
  <div class="vxa-progress-box" :style="{width: width}">
    <label ref="progressLog" class="vxa-progress_log" :style="{left:progressValue+'%'}" v-if="inside">{{progressValue}}%</label>
    <div class="vxa-progress" :style="{height:height+'px'}">
      <div ref="progressBar" class="progress-bar is-radius" :class="{'animation':animation}"
           :style="{'width':progressValue+'%'}"><span
        class="sr-only" v-if="!inside">{{progressValue}}%</span>
      </div>
    </div>
    <div class="vxa-progress_present"><span>0%</span><span>100%</span></div>
  </div>
</template>

<script>
  export default {
    name: "progress",
    components: {},
    data() {
      return {
        leftVal: 0,
        progressValue: 0
      }
    },
    props: {
      inside: {
        type: Boolean,
        default: true
      },
      animation: {
        type: Boolean,
        default: true
      },
      value: {
        type: [String, Number],
        default: 1
      },
      height: {
        type: [String, Number],
        default: 20
      },
      width: {
        type: [String, Number],
        default: '410px'
      }
    },
    watch: {
      value: function (val) {
        this.progressValue = val;
        if (val >= 100) {
          this.progressValue = 100;
        }
      }
    },
    created() {
      this.progressValue = this.value
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .vxa-progress-box {
    position: relative;
    width: 410px;
    display: inline-block;
    .vxa-progress {
      overflow: hidden;
      width: auto;
      height: 20px;
      border: 1px solid #e3e3e3;
      background-color: #f8f8f8;
      border-radius: 15px;
      position: relative;
      .progress-bar {
        float: left;
        height: 100%;
        font-size: 12px;
        line-height: 20px;
        color: #fff;
        max-width: 100%;
        min-width: 1%;
        text-align: center;
        background-color: #ffb148;
        border-radius: 15px 0 0 15px;
        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
        transition: all .3s;
        &.is-active {
        }
        &.animation {
          background-image: linear-gradient(45deg, rgba(255, 255, 255, .25) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
          -webkit-background-size: 20px 20px;
          background-size: 20px 20px;
          transition: width .6s ease;
          animation: progress-bar-stripes .5s linear infinite;
        }
        &.is-radius {
          border-radius: 15px;
        }
      }
      // WebKit
      @-webkit-keyframes progress-bar-stripes {
        from { background-position: 20px 0; }
        to { background-position: 0 0; }
      }
      @keyframes progress-bar-stripes {
        from { background-position: 20px 0; }
        to { background-position: 0 0; }
      }
    }
    .vxa-progress_log {
      display: inline-flex;
      align-items: center;
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      justify-content: center;
      color: #8d8d8d;
      font-size: 12px;
      position: relative;
      top: 0;
      left: 0;
      margin-bottom: 8px;
      width: 35px;
      height: 24px;
      transition: left .6s;
      transform: translateX(-50%);
      &::after {
        content: " ";
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        border-width: 6px;
        bottom: -5px;
        border-top-color: #fff;
        border-bottom-width: 0;
      }
    }
    .vxa-progress_present {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      color: #8d8d8d;
      font-size: 12px;
      width: 100%;
    }
  }
</style>
