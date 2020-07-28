<template>
  <div id="members">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card shadow="never" body-style="padding:0" class="card-box left">
          <div class="left">
            <ul class="side-menu">
              <li @click="changeActive(index)" :class="{'is-active':item.active}" v-for="(item, index) in navList"
                  :key="index">
                <p>{{item.label}}</p>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card shadow="never" class="card-box">
          <router-view></router-view>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: "members",
    data() {
      return {
        navList: [{
          label: "成员管理",
          name: 'members-manage',
          active: true,
          link: "/admin/members/manage"
        },
          {
            label: "添加成员",
            name: 'members-invite',
            active: false,
            link: "/admin/members/invite"
          }
        ],
        inviteForm: {
          users: [{
            phone: '',
            email: ''
          }]
        },
        userInfo: {},
        userList: []
      };
    },
    watch: {
      $route(to) {
        this.navList.forEach(item => {
          item.active = false;
          if (this.$route.meta.tabName == item.name) {
            item.active = true;
          }
        });
      }
    },
    created() {
      this.navList.forEach(item => {
        item.active = false;
        if (this.$route.meta.tabName == item.name) {
          item.active = true;
        }
      });
    },
    methods: {
      changeActive(index) {
        this.navList.forEach(item => {
          item.active = false;
        });
        this.navList[index].active = true;
        this.activeName = this.navList[index].type;
        this.$router.push({path: this.navList[index].link});
      }
    }
  };
</script>
<style lang="scss">
  #members {

  }
</style>
