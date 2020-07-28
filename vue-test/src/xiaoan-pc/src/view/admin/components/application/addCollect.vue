<template>
  <div id="application-add-collect">
    <el-form :model="formData" :rules="rules" ref="formData" class="ruleForm" label-width="100px">
      <el-form-item label="收藏夹名称" prop="favouriteName">
        <el-input class="txtName" v-model="formData.favouriteName" placeholder="请输入收藏夹名称" spellcheck="false"></el-input>
      </el-form-item>
      <el-form-item label="适用范围">
        <el-checkbox-group v-model="formData.type">
          <el-checkbox label="沪市主板" name="type"></el-checkbox>
          <el-checkbox label="深市主板" name="type"></el-checkbox>
          <el-checkbox label="深市中小板" name="type"></el-checkbox>
          <el-checkbox label="深市创业板" name="type"></el-checkbox>
          <el-checkbox label="新三板" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="收藏简介">
        <el-input type="textarea" v-model="formData.introduction" placeholder="请输入收藏简介"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subBtn" type="primary" @click="submitForm('formData')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      var checkTrim = (rule, value, callback) => {
        let errMsg = '收藏夹名称不能为空'
        if (/^\s*$/.test(value)) {
          return callback(new Error(errMsg));
        } else {
          callback()
        }
      }
      return {
        formData: {
          favouriteName: '',
          type: [],
          introduction: ''
        },
        rules: {
          favouriteName: [
            {validator: checkTrim, trigger: 'blur'},
            {required: true, message: '请输入收藏夹名称', trigger: 'blur'}
          ]
        },
        userInfo: {},
        oldFavouriteName: ''
      }
    },
    // 使用其它组件
    components: {},
    // 方法
    computed: {},
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      if (this.$route.query.id) {
        this.getFavouritebyid(this.$route.query.id);
      }
    },
    mounted() {
    },
    watch: {
      '$route'(to, from) {
        if (!this.$route.query.id) {
          this.formData.favouriteName = ''
          this.formData.type = []
          this.formData.introduction = ''
        }
      }
    },
    methods: {
      // 获取我的收藏夹信息
      getFavouritebyid(id) {
        this.$http({
          methods: 'GET',
          url: this.$api.teamFavourite.getTeamFavouriteInfoById,
          params: {
            favouriteId: id
          }
        }).then((res) => {
          if (res.data.returnCode === 1) {
            let data = res.data.returnObject
            this.formData.favouriteName = data.favouriteName
            this.oldFavouriteName = data.favouriteName
            document.title = '编辑收藏夹-' + data.favouriteName
            if (data.limitation) {
              this.formData.type = data.limitation.split(',')
            }
            this.formData.introduction = data.introduction
          }
        })
      },
      //
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.$route.query.id) {
              this.updateCollect(this.$route.query.id)
            } else {
              this.addCollect()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      //
      addCollect() {
        let userId = this.$cookie.get('userId')
        this.$http({
          method: "POST",
          url: this.$api.teamFavourite.addTeamFavourite,
          params: {
            userId: userId,
            companyId: this.userInfo.companyId,
            favouriteName: this.formData.favouriteName,
            limitation: this.formData.type.toString(),
            introduction: this.formData.introduction,
            isDefault: 0
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '创建收藏夹成功！'})
            this.$router.push('/admin/application/collect')
          } else if (res.data.returnCode == 3) {
            this.$message({showClose: true, type: 'error', duration: 3000, message: '收藏夹不能相同！'})
          } else if (res.data.returnCode == 2) {
            this.$message({showClose: true, type: 'error', duration: 3000, message: '最多创建十个收藏夹！'})
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
          }
        })
      },
      //
      updateCollect(id) {
        let userId = this.$cookie.get('userId')
        let updateFavouriteName = this.formData.favouriteName
        if (this.formData.favouriteName === this.oldFavouriteName) {
          updateFavouriteName = ''
        }
        this.$http({
          method: "POST",
          url: this.$api.teamFavourite.updateFavouriteName,
          params: {
            companyId: this.userInfo.companyId,
            id: id,
            favouriteName: updateFavouriteName,
            range: this.formData.type.toString(),
            introduction: this.formData.introduction
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '收藏夹修改成功'})
            this.$router.go(-1)
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #application-add-collect {
    .txtName {
      width: 400px;
    }
    .el-textarea__inner {
      width: 400px;
      height: 190px;
    }
    .el-checkbox-group {
      width: 120px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
</style>
