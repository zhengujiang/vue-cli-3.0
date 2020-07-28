<template>
  <div id="systemManage">
    <div class="content">
      系统管理页面
      <router-link to="/userManage">userManage</router-link><br/>
      <router-link to="/companyManage">companyManage</router-link><br/>
      <router-link to="/systemManage">{{name}}</router-link><br/>
    </div>
  </div>

</template>

<script>
    export default {
        name: "systemManage",
        data() {
          return {
            name: 'systemManage'
          }
        }
    }
</script>

<style lang="scss">
  #systemManage {
    min-height: 500px;
  }
</style>
