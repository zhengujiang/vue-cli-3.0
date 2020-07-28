<template>
  <div class="vxa-popup" :class="[`vux-popup-${position}`, show ? 'vux-popup-show' : '']">
    <slot name="aside-right"></slot>
    <transition :name="`vux-popup-animate-${position}`">
      <div class="vxa-popup-body" :class="show ? activeClass:''">
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
  import dom from '../../../libs/dom'
  export default {
    name: 'vxa-popup',
    data() {
      return {
        $overflowScrollingList: [],
        layout: '',
        initialShow: false,
        hasFirstShow: false,
        shouldRenderBody: true,
        show: this.value
      }
    },
    components: {},
    props: {
      value: Boolean,
      height: {
        type: String,
        default: 'auto'
      },
      activeClass: {
        type: String,
        default: 'animate-right-active'
      },
      width: {
        type: String,
        default: 'auto'
      },
      showMask: {
        type: Boolean,
        default: true
      },
      isTransparent: Boolean,
      hideOnBlur: {
        type: Boolean,
        default: true
      },
      position: {
        type: String,
        default: 'bottom'
      },
      maxHeight: String,
      popupStyle: Object,
      hideOnDeactivated: {
        type: Boolean,
        default: true
      },
      shouldRerenderOnShow: {
        type: Boolean,
        default: false
      },
      shouldScrollTopOnShow: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(val) {
        // console.log(val);

        if (val) {
          // document.body.classList.add('html-body-overflow');
        } else {
          // setTimeout(_ => {
          //    document.body.classList.remove('html-body-overflow');
          //  }, 200)
        }
        // this.$nextTick(_ => {
        //   console.log(document.body.classList);
        //   console.log('this.hasScrollbar()', this.hasScrollbar());
        // })
        this.show = val
      },
      show(val) {
        this.$emit('input', val);
        if (val) {
          // render body
          if (this.shouldRerenderOnShow) {
            this.shouldRenderBody = false
            this.$nextTick(() => {
              this.scrollTop()
              this.shouldRenderBody = true
              this.doShow()
            })
          } else {
            if (this.shouldScrollTopOnShow) {
              this.scrollTop()
            }
            this.doShow()
          }
        } else {
          this.$emit('on-hide')
          this.show = false
          // this.popup.hide(false)
          setTimeout(() => {
            if (!document.querySelector('.vux-popup-dialog.vux-popup-show')) {
              this.fixSafariOverflowScrolling('touch')
            }
            this.removeModalClassName()
          }, 200)
        }
      }
    },
    computed: {
      styles() {
        const styles = {};
        if (!this.position || this.position === 'bottom' || this.position === 'top') {
          styles.height = this.height
        } else {
          styles.width = this.width
        }
        if (this.maxHeight) {
          styles['max-height'] = this.maxHeight
        }
        this.isTransparent && (styles['background'] = 'transparent')
        if (this.popupStyle) {
          for (let i in this.popupStyle) {
            styles[i] = this.popupStyle[i]
          }
        }
        return styles
      }
    },
    created() {
    },
    mounted() {
      this.$overflowScrollingList = document.querySelectorAll('.vux-fix-safari-overflow-scrolling')
    },
    methods: {
      /**
       * https://github.com/airyland/vux/issues/311
       * https://benfrain.com/z-index-stacking-contexts-experimental-css-and-ios-safari/
       */
      fixSafariOverflowScrolling(type) {
        if (!this.$overflowScrollingList.length) return
        // if (!/iphone/i.test(navigator.userAgent)) return
        for (let i = 0; i < this.$overflowScrollingList.length; i++) {
          this.$overflowScrollingList[i].style.webkitOverflowScrolling = type
        }
      },
      removeModalClassName() {
        this.layout === 'VIEW_BOX' && dom.removeClass(document.body, 'vux-modal-open')
      },
      doShow() {
        // this.popup && this.popup.show()
        this.$emit('on-show')
        this.fixSafariOverflowScrolling('auto')
        this.layout === 'VIEW_BOX' && dom.addClass(document.body, 'vux-modal-open')
        if (!this.hasFirstShow) {
          this.$emit('on-first-show')
          this.hasFirstShow = true
        }
      },
      scrollTop() {
        this.$nextTick(() => {
          this.$el.scrollTop = 0
          const box = this.$el.querySelectorAll('.vux-scrollable')
          if (box.length) {
            for (let i = 0; i < box.length; i++) {
              box[i].scrollTop = 0
            }
          }
        })
      },
      // 判断页面是否有滚动条
      hasScrollbar() {
        return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
      }
    },
    beforeDestroy() {
      // this.popup && this.popup.destroy()
      this.fixSafariOverflowScrolling('touch')
      this.removeModalClassName()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/transition";
  .vxa-popup {
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    transition: all .3s;
    z-index: 1000;
    //z-index: 10007;
    &.vux-popup-show {
      z-index: 2600;
    }
    .vxa-popup-body {
      width: 0;
      height: 100%;
      background-color: #fff;
      transition: all .3s;
      &.animate-right-active {
        width: 460px;
        box-shadow: -5px 0px 15px rgba(0, 0, 0, 0.3);
        transition: all .3s;
      }
    }
  }
  .vux-popup-dialog {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 2005;
    transition-property: transform;
    transition-duration: 300ms;
    max-height: 100%;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    transition: all 300ms;
  }
  .vux-popup-dialog.vux-popup-left {
    width: auto;
    height: 100%;
    top: 0;
    right: auto;
    bottom: auto;
    left: 0;
  }
  .vux-popup-dialog.vux-popup-right {
    width: auto;
    height: 100%;
    top: 0;
    right: 0;
    bottom: auto;
    left: auto;
    transition: all 300ms;
  }
  .vux-popup-dialog.vux-popup-top {
    width: 100%;
    top: 0;
    right: auto;
    bottom: auto;
    left: 0;
  }
  .vux-popup-mask {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    tap-highlight-color: rgba(0, 0, 0, 0);
    z-index: -1;
    transition: all 300ms;
  }
  .vux-popup-mask.vux-popup-show {
    opacity: 1;
    z-index: 2003;
    -webkit-transition: all 300ms;
    transition: all 300ms;
  }
</style>
