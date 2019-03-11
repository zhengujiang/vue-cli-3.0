<template>
  <div class="home">
    <!-- <hello msg="Welcome to Your Vue.js App"/> -->
    <input type="text" v-model="message">
  </div>
</template>

<script>
// @ is an alias to /src
// import hello from '../components/hello.vue'

export default {
  name: 'home',
  // components: {
  //   hello
  // },
  data () {
    return {
      message: ''
    }
  }
}
</script>
