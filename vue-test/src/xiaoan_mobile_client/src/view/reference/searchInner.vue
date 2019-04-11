<template>
  <div id="searchInner">
    <div class="powerHeader">
      <form action="" onsubmit=" return false">
        <label for="powerInput"></label>
        <input type="text" id="powerInput" class="backImg" placeholder="搜索股票代码/简称/拼音缩写"
               @input="checkIsAttend" v-model="inputVal" @focus="powerInputFocus($event)"
               @blur="powerInputBlur($event)"
               @keyup.13="checkIsAttend"/>
        <b class="closeIcon" v-show="closeImg" @click="closeIconImg()"></b>
      </form>
    </div>
    <div v-show="displayShow">
      <ul class="powerSearch">
        <li v-for="(list,index) in unitCode">
          <span class="powerSearchName">{{list.name}}</span>&ensp;<span
          class="powerSearchCode">{{list.code}}</span>
          <span class="Addglfoc addfoc" :key="index">
                         <img :src="list.status == -1 ?closefoc : foc" @click="addInsideCompany(index)">
                    </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'searchInner',
    data() {
      return {
        inputVal: "",
        displayShow: true,
        closeImg: false,
        unitCode: [],
        closefoc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAABFCAYAAAC7fF+XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFDREM5MDMzODY1QzExRTdBMzA2RkIzMjlGMEEwQjU0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFDREM5MDM0ODY1QzExRTdBMzA2RkIzMjlGMEEwQjU0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUNEQzkwMzE4NjVDMTFFN0EzMDZGQjMyOUYwQTBCNTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUNEQzkwMzI4NjVDMTFFN0EzMDZGQjMyOUYwQTBCNTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7FmJHTAAAQ7klEQVR42uyd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',
        foc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAABFCAYAAAC7fF+XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNBMkEyOTZGODY1QjExRTc4MjI2RTc3NzhDNkYwRjNGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNBMkEyOTcwODY1QjExRTc4MjI2RTc3NzhDNkYwRjNGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0EyQTI5NkQ4NjVCMTFFNzgyMjZFNzc3OEM2RjBGM0YiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0EyQTI5NkU4NjVCMTFFNzgyMjZFNzc3OEM2RjBGM0YiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz77RhHlAAALKklEQVR42uyd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',

      }
    },
    watch: {
      '$route'(to, from) {
        window.location.reload();
      }
    },
    updated() {
    },
    created() {
    },
    mounted() {
      $("#powerInput").focus();
    },
    methods: {
      closeIconImg() {
        this.inputVal = "";
        this.unitCode = [];
        this.closeImg = false;
        $("input").focus();
      },
      powerInputFocus(ele) {
        var elt = ele.currentTarget;
        $(elt).removeClass("backImg");
        $(elt).css({"padding-left": "10px"});
        this.powerShow = false
        //console.log("4534435", elt, $(elt));
        this.displayShow = true;
        if (this.inputVal.trim().length == 0) {
          this.unitCode = [];
        } else {

        }
      },
      powerInputBlur(ele) {
        var elt = ele.currentTarget;
        $(elt).addClass("backImg");
        $(elt).css({"padding-left": "8%"});
        if (this.inputVal.trim().length == 0) {
          this.powerShow = true
          this.displayShow = false;
        } else {
          this.powerShow = false;
          this.displayShow = true;
        }

      },
      /*收索股票*/
      checkIsAttend() {
        if (this.inputVal.trim().length == 0) {
          this.unitCode = [];
          this.closeImg = false;
        } else {
          this.closeImg = true;
          let params = {
              key: this.inputVal,
            }
          this.$axios.permission.checkIsAttend(params).then(res => {
            //console.log("getPermissionInsideList==>", res);
            if (res.data.returnCode == 1) {
              console.log("", res);
              this.unitCode = res.data.returnObject;
            } else if (res.data.returnCode == -1) {
            } else {
            }
          }).catch((err) => {
            this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
          })
        }

      },
      /*获取90*/
      addInsideCompany(index) {
        if (this.unitCode[index].status == 1) {
          let params = {
              code: this.unitCode[index].code
            }
          this.$axios.permission.addInsideCompany(params).then(res => {
            console.log("getPermissionInsideList==>", res);
            if (res.data.returnCode == 1) {
              this.checkIsAttend();
            } else if (res.data.returnCode == -1) {
              this.checkIsAttend();
            } else {
              this.checkIsAttend();
            }
          }).catch((err) => {
            this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
          })
        } else if (this.unitCode[index].status == -1) {
          let params = {
              code: this.unitCode[index].code
            }
         this.$axios.permission.deleteInsideCompany(params).then(res => {
            console.log("getPermissionInsideList==>", res);
            if (res.data.returnCode == 1) {
              this.checkIsAttend();
            } else if (res.data.returnCode == -1) {

            } else {

            }
          }).catch((err) => {
            this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
          })
        }
      },
    },
  }
</script>

<style>

</style>

<style scoped>
  #searchInner .powerHeader {
    /*height: 45px;*/
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8.5px 12px;
    background-color: #f0f1f5;
    position: relative;
  }
  #searchInner .powerHeader form {
    width: 100%;
    height: 100%;
    position: relative;
  }
  #searchInner .powerHeader input {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 2px;
    box-sizing: border-box;
    font-size: 15px;
    padding: 5.5px 8%;
    color: #323232;
  }
  #searchInner .powerHeader input::-webkit-input-placeholder {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
  }
  .Addglfoc {
    float: right;
    vertical-align: middle;
    box-sizing: border-box;
    height: 45px;
    padding: 10px 0;
    line-height: 0;
  }
  .addfoc img {
    width: auto;
    height: 24px;
  }
  #searchInner .backImg {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRGQUUxMjREMTZBMDExRTc5MDRDRUUwMTg2NkE5NDYxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRGQUUxMjRFMTZBMDExRTc5MDRDRUUwMTg2NkE5NDYxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEZBRTEyNEIxNkEwMTFFNzkwNENFRTAxODY2QTk0NjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEZBRTEyNEMxNkEwMTFFNzkwNENFRTAxODY2QTk0NjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6G1w55AAAFXklEQVR42tyaC4hUVRjHz262rr0ke2BkSiqlKVmGLmb2WCsTbapNwyIiKHLRiJoK7UVGyZqyC9FGuhak1Ga2iMamYdmkEVbQ2sMeRpahaWXG9rANa3f7f9z/Yb+GubNzz70zc2c/+DHnPubxn/Od757zfaesvr7ehLBycAG4FEwEZ4EhYJC65w+wF3wBdoAU+BB0mggsmUz2ek8/x88eA24DN4LBvdx7PDiHzOK5X8Ba8ByF59XKA95/PngN7AT3ZBD4F9gFPgHb+bovQ6+dDOaBNrAFTM6nyFx7UnpjKZgLytT5w6AVbAIfgK9BV4b3V9CVp4ArwHRQyWvV5FVwJ/i5GD1ZBT4GtUrgV+B2cAqYA1bxXJfPZxxh7z8LasBpFLRb3TMbfA5mFlqkjLttYDiPD4E7OCafBx2O39sOngGj6La/KjeW4fBgoUQuZGCo4LG45dlgZZYeC2r/snflT3uD58RbFoMl+RZ5L6hTxw+DBHsyH/YjmAGeVOcWRNWjmUReC5ax3c2xuJjtfFoXvecBdU6+96aoRQ4FL6gAI1+4whTWxE0fV8dNYGSUImUMDmS7Oc19CmmPgnVsHwtWpz26nEXW8Bkmth/MN8Wzbkb2H3g8KYzblqtX3Wt3McwX09o5q7JW5zoNtSITyu/fV65SbGsBn7J9Brg+jMhadW5RASJpELddqo7nu4o8EUzlsSyJ3jTxslfAQbYv4pQwsMjLla83RzibicpkVrRGzYZmuIicqI5TJp7WqtqTXUSOUzOO92IqcrvysAkuIoeqZ+OfMRUpKZQ9bI9wETmM7X0m3raXr7LYPimoSLtC/ynmItvTMhV5y/GUpJUzNSHWP+a/9TjVPhxU5PdsD4+5yCFqFnQoqEgbtc6Msfv25+8z/L1dQUW2sX208fKqcTR5lttc006XMfmuOp4WU5H6d21zFWmDz6yYirxBtTe7iPzdeLlOQ3edFDOBF4KxbO9S68vAz8lV6tx9MRO5QLWbwiyaN4Iv2a5JW5kU0y5m1kLsN+Ml2pxFSkjWidxG417Wi8ok2j+tjp/g0HIWKbZeZQVkOfNIkUVK/vVcNRYbw0zrtM1Vyy0pDVxXJIFS4bIlZKlt3gr+jkrkd8arWtlrLxmvVF5IS/B7rd1vvAyiiUqk2Mump9gzgEEpUSCB8ge3cDzaYPNiFKuQTPYQWK6ErufAPypP4o4xXglvhRIoJiWLrWpyHqlImenPozCxMgqXXEtVxAKr+YCv9bk+GrwTRmi2VUc3I+xsFbonUOha45BQSrPLwFvG2xjRW95mBIUOi1qkNRkjsj1lg+pVES57cT4yXk1xfA7P1X6cZEjFSjZQvG16ktqGc2jZE5TKIlSyiYHLeLk+8KW6JMVZqXotMz1pzPGkjiFetrR8a7wdHJ0cw6dyLTiO4zvddtNj1tB7ZGNEK3s63U5nj0rE/yZqkdZksnAeuMR4dYmZ6odXcrzmMmY76apNDGp6ESx7ga6iB13tI1R6/UrwWT5EWttKKvmvTuFKYSzHTXoUbqeL7uB6UP6sg1k+/wiXfX5CB9Pdq3MRWhZyb53fnHMQe7iDQct1K0wFg9w1Ptdl+9q0ZDLZFjbwBLV/jJfD3cPXjhCfJT0qNclmn+uy7yfV0NBQVWiRUZuM31uyCD1BsgXZhJZKctkKXZ1F6BYIrS5lkXo1stznuuwSac0ktNTKBHa66Sd0AIVOL2WRWuhTWYRugNBEKYu0Qu82/pup5DHWYoWWelVrYS9C10Ho1JIv3WEiIEIX+VyWmVdjn6hPQuhj5v+7K7WN6jNFWAhd4iM01acqzRQqe+MPcOn3Orj5PwEGAA3iJ0fVKhsZAAAAAElFTkSuQmCC");
    background-repeat: no-repeat;
    background-color: white;
    background-position: 8px 6px;
    background-size: 17px;
  }
  #searchPower label {
  }
  #searchInner .powerSearch {
    list-style-type: none;
  }
  #searchInner .powerSearch li {
    list-style-type: none;
    height: 45px;
    line-height: 45px;
    padding: 0 12px;
    box-sizing: border-box;
    border-bottom: 0.5px solid #e3e3e3;
  }
  #searchInner .powerSearchName {
    font-size: 15px;
    color: #323232;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  #searchInner .powerSearchCode {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #8d8d8d;
  }
  #searchInner .closeIcon {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQxRUIwQkE2MjY0MzExRTdBMzk4Qjg0NjM3NzA4NjQzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQxRUIwQkE3MjY0MzExRTdBMzk4Qjg0NjM3NzA4NjQzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDFFQjBCQTQyNjQzMTFFN0EzOThCODQ2Mzc3MDg2NDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDFFQjBCQTUyNjQzMTFFN0EzOThCODQ2Mzc3MDg2NDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6rK+XfAAADoElEQVR42tSZW0gUURjHdzcrKs3dokisJ6PIKCjLCmp9KNIeBCG6PhRUEBFrQg9RmBkmFEkvShdBBINwDcoggqgE96XLukVEYRfJCrIiCoTtYtL2/+wbOI1nds5cdtcO/Pl0Zs6cH/855zvfzHoTiYTnf2hZTjpHIpFpCGugImg55IfyoWzoJzQAfYKeQzGoG3oj3iMYDKYOFIBlCLuhUignyaWzOJYKx7qgdqgVGlYd02vl0QOQBjwGrXLhaZKzDXC0yTVQAAYQ6IbbUzD9HkF7ARx1BApImoNhKC/F6yWUzF2fCeRGCmmApNaI8U5ZdhSdKhCuZiATnYGzB5VAAVmMcD+DafMwYE8mBQXkJIQP0NQM5/gSwEaSzdHwGICkdg2mZUlBcaIEoVzhJi+gtw4gehSuoV3utJGjzQo3oC1xEbQE+m4Dcidvtx0K11bBvLx/QHFgLcI8k45PoDmYO0PQF/y9DIpbgKyE2vjvLZSSFPoc0jtapdBpHDRRKCieIaxQdDYkAfut0G8PTBzvYzepsNig0KkQ6sf1BcKxp/wo4yZONkkW7QGFMadAZZqj69ktlUalXQywc3WwRs5WSpwkyM0Wpky5Brra4oLIhR5InNXPWTcgqa3UQBfaWL0BLoZFZ7U5+xGqlUB22ICkNl9LqDNs5sMRZ3mO9gnOUvYYlDi5yeY4EzRH8x0k7wAn8ELh2KCuQgvbdHJUmZfrcLvzs5MBybk2p5Ai6A8X9uZag1V/yY37a6ADDu9Dq/u4AdANfkuNuwH62SGkfnWf1b0AWtnBkoL2uQhJKWgfdBOyuoMZtXca6D07kNjrG5OkoBzOBrId7JvFsWIa6C0XIGXJ3M951qmzd3xcBb3iG5g1Ku12mThplGcLdHOWttvHiqBXxDLvgkKHfkC22tgWydmoDrYX6lRxE2O+F0FboF8mnZaiEOkUim0r26Lm7Gz+fz9/HjJrJ0a9hWLgIwj1Cp2b+WtdyMYiJCcvQ0cVro3CzWKj12WqfGZ6xkZbANBeo9flijECWadBSkFx8i5CTYYhu8FRY/qRDBfVIVzMEORLaJ3RFiqD3eH5+2U4nW2kJsDYw8qgDLsNoSFNkLepysKYX2UnVb84b0U470KBbdTqAVitUj15TJxt5/egFpcBu/hRV5td6LX6OxPcXcyJnlzOtglIxfQ56Lrqzzdeuz+IAXg6fcHgFVrE+/hkyaVD/AbxkPZthnwtPC2l8f4IMAD2mx/miUeRKAAAAABJRU5ErkJggg==");
    background-repeat: no-repeat;
    background-size: 15px;
    height: 15px;
    width: 15px;
    position: absolute;
    right: 2.5%;
    top: 50%;
    margin-top: -7.5px;
    box-sizing: border-box;
    padding: 10px;
  }
</style>
