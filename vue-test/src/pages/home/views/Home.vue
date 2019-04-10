<template>
  <div class="home">
    <!-- <hello msg="Welcome to Your Vue.js App"/> -->
    <input type="text" v-model="message">
  </div>
</template>

<script>
// @ is an alias to /src
import { eventBus } from '../components/eventBus'

export default {
  name: 'home',
  data () {
    return {
      message: ''
    }
  },
  mounted () {
    let num = eventBus.$on('add')
    console.log(num)
  }
}
</script>
