<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="add">增加</button>
    <button @click="reduce">减少</button>
  </div>
</template>

<script>
import config from '../../../components/config.js'
import { eventBus } from '../components/eventBus.js'
export default {
  data () {
    return {
      timer: null,
      num: 1
    }
  },
  mixins: [config],
  mounted () {
    console.log(eventBus)
    console.log(this)
    // window.onresize = this.debounce(this.resizeHand, 500)
    window.onresize = this.throttle(this.resizeHand, 1000)
  },
  methods: {
    resizeHand () {
      console.log(new Date())
    },
    add () {
      this.num++
      eventBus.$emit('add', { num: this.num })
    },
    reduce () {
      this.num--
      console.log(this.num)
      eventBus.$emit('reduce', { num: this.num })
    }
  }
}
</script>
