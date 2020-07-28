<template>
  <div id="account">
    <v-personedit :stype="'edit'"></v-personedit>
  </div>
</template>

<script>
  import personedit from '@/components/personEdit'
    export default {
    data() {
      return {
      }
    },
    components: {
      'v-personedit': personedit
    }
  }
</script>
<style lang="scss">

</style>
