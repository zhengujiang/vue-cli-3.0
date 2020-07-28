<template>
  <el-row :gutter="20">
    <el-col :span="5">
      <el-card shadow="never" body-style="padding:0" class="card-box left">
        <div class="left">
          <ul class="side-menu">
            <li @click="changeActive(index)" :class="{'is-active':item.active}"
                v-for="(item, index) in bar" :key="index"><p>{{item.label}}</p>
            </li>
          </ul>
        </div>
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-card shadow="never" class="card-box right">
        <router-view></router-view>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "finance",
    data() {
      return {
        activeTab: 0,
        bar: [
          {label: '支付', active: true, link: '/admin/finance/pay', type: 'finance-pay'},
          {label: '发票', active: false, link: '/admin/finance/invoice', type: 'finance-invoice'}
        ]
      }
    },
    watch: {
      $route: function (route) {
        this.bar.forEach((item) => {
          item.active = false;
          if (this.$route.meta.tabName.indexOf(item.type) > -1) {
            item.active = true;
          }
        });
      }
    },
    created() {
      this.bar.forEach((item) => {
        item.active = false;
        if (this.$route.meta.tabName.indexOf(item.type) > -1) {
          item.active = true;
        }
      });
    },
    methods: {
      changeActive(index) {
        this.bar.forEach(item => {
          item.active = false;
        });
        this.$set(this.bar[index], 'active', true);
        this.$router.push({path: this.bar[index].link});
      }
    }
  }
</script>

<style lang="scss">

</style>
