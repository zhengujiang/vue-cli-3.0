<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    // window.onresize = this.debounce(this.resizeHand, 500)
    window.onresize = this.throttle(this.resizeHand, 500)
  },
  methods: {
    // 函数防抖
    debounce (method, time) {
      let timer = null
      return () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          method()
        }, time)
      }
    },
    resizeHand () {
      console.log(new Date())
    },
    // 函数节流
    throttle (method, time) {
      let start = ''
      let timer = null
      return function loop () {
        let end = new Date()
        if (!start) start = end
        if (end - start >= time) {
          method()
          start = end
        } else {
          clearTimeout(timer)
          timer = setTimeout(() => {
            loop()
          }, 50)
        }
      }
    }
  }
}
</script>
