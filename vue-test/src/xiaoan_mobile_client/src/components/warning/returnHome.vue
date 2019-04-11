<template>
  <!--回到主页-->
  <div class="goHome" @click="goLaw(routeUrl)"
       :style="{color:textColor,backgroundColor:bgColor,bottom:bottom,width:width,height:height,position:position,zIndex:zIndex}"
       :routeUrl="routeUrl">
    <div class="ans-homeIcon"></div>
    <div class="ans-homeText" :style="{fontSize: textSize}">{{ text }}</div>
  </div>
</template>
<script>
  export default {
    name: "returnHome",
    data() {
      return {
        text: "主页",
        message: 'rule',
      }
    },
    props: {
      routeUrl: {
        type: String,
        required: false,
        default: 'law'
      },
      textColor: {
        type: String,
        required: false,
        default: "#fff",
      },
      bgColor: {
        type: String,
        required: false,
        default: "rgba(255, 177, 72, 0.65)", /*rgba(0,0,0,.44)*/
      },
      position: {
        type: String,
        default: "absolute"
      },
      bottom: "", width: "", height: "", zIndex: "", textSize: ''
    },
    methods: {
      goLaw(path) {
        //this.$emit('event'); $emit 将事件发射出去  子组件dom中@event=“gohome” gohome为methods里面的方法名
        this.$router.push({path: "/" + path});
      },
    }
  }
</script>
<style scoped>
  .goHome {
    height: 45px;
    width: 45px;
    border: 0;
    box-sizing: border-box;
    display: inline-block;
    background-color: rgba(255, 177, 72, 0.5);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    position: absolute;
    bottom: 12%;
    right: 5%;
    color: white;
    font-size: 12px;
    padding: 8px 0 0 0;
    text-align: center;
    line-height: 14px;
    z-index: 1101;
  }
  .ans-homeIcon {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA7CAYAAAAtpUeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVGRjIwM0ZCNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVGRjIwM0ZDNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUZGMjAzRjk2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUZGMjAzRkE2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qSSpMAAADTUlEQVR42uyaWWgTQRjHN6GtWsWzFvVBgg/BIhEaES+kD634ICLWE1ErYh88gihIRRAUqQf0QRGlHlQEDxAULbaIiD6IQsUWRERUCipWpVC1BVvRNut/cBaWsDOzNXvMJPPBD5LM7uw3PzLH7mzENE0j5BgJLoO19PstUAu+hZVQJGQpU8B9kMj4/T1YCt6GkVQ0RCFJ8MJBCIkYaAcL8knKEtAGSjnHjAFPwLJ8kLKedpkCN90b3AVbclnKbnCdUTYEBhlll0BdYFmSgTYgjprs6AdlYCb4yTnuZBC5BiWkidPQzyBhO3YW+Mg5/obqUgpBK6eBHaDU4bwJoI1z3mMwTkUpk2mjWdFCpbHOj4JmzvmdIKaSlATtFqy4OIy6Gjn19ICkClIW04GTFfX/UedhTn2/QZXMUqpNfqSyqHuHoO4NMkrZLkh6nQfXWC24xl6ZpBziJDoAKj2UXwF6OddrkEEKbyDsyliDeEWczj6suBaWFDJl3uEk1g5KfJzyyTrlKef6j0BxkFImgeechFoFaxAvuc3J4w2YFoSUuGAZ3hTg/ZTFOU4+X+itg29S5oE+TgLHQxBicURww1nhh5TlgulwT4hCLFKCHNd4KWWrj4syr6nNNlc3FzlgiiMmkZSpLvI9xqtD9OTtNKh3+VRelnCTy366rTLsx5E3wS4jd2MzeOD0rNhJynjwDFQbuR+VoAOU8KRY+y1zGZVcAS8VbPxrcJVRlqBtjjtJSdLCGYyTD4JNoEhBKaPBRrCPUT6dtn2h/Wn+IjDEGa3rbKNzt0P5fIlmn3KH/H6AIlq+UzAzVVn/lLOcQZcYPmEzPqjgP4XsKY2ln8+AFfQ3p2iM2hqbGQN0ILL3RVPhQTVt+9xMu8p3h+NGWFLI1PvHVvAOzAEPc3jmITNsOXiV8XvKmqPvgTKwEvSDCxmScjU+gNlgG+1eLWSmsi9cOkGDkX9ButV5Wd5PkTa0FC1FS9FStBQtRUvRUrQULUVL0VK0FC1Fh5aipWgp0khJS9SmtCxSuiSS8snIciumwKNEToFuUBiyELJRNzHbSrySskqBoSLiZ/cpVnDsHOXnmPIL9CkohWzw9folhYzsNeCrQkJ6jH+vkLh+MeCvAAMAf1XzDjMmclkAAAAASUVORK5CYII=");
    background-repeat: no-repeat;
    background-size: contain;
    height: 19px;
    width: 19px;
    margin: -3px auto 1px;
  }
  .ans-homeText {
    line-height: 1;
  }
</style>
