<template>
  <div id="hello">
    {{msg}}
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  props: ['msg']
}
</script>
