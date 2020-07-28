<template>
  <div id="admin-application">
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
  </div>
</template>

<script>
  export default {
    name: "admin-application",
    data() {
      return {
        activeTab: 0,
        bar: [
          {label: '可比公司设置', active: true, link: '/admin/application/compare', type: 'application-compare'},
          {label: '团队收藏设置', active: false, link: '/admin/application/collect', type: 'application-collect'}
          // {label: '舆情监控设置', active: false, link: '/admin/application/supervise', type: 'application-supervise'}
        ],
        inviteForm: {
          users: [{
            phone: '',
            email: ''
          }]
        },
        userInfo: {},
        userList: []
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
  #admin-application {
  }
</style>
