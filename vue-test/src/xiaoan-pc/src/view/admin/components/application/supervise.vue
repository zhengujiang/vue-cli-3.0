<template>
  <div id="application-supervise">
    <header>
      <h4 class="card-title">舆情设置</h4>
    </header>
    <div class="form-list">
      <div class="form-box">
        <el-form :model="editProjectForm" status-icon :rules="rules" ref="ruleForm">
          <el-form-item prop="projectName">
            <el-input placeholder="项目名称(请不要超过15个字符)" v-model="editProjectForm.projectName" auto-complete="off">
              <!--<template slot="prepend">项目名称</template>-->
              <el-button class="label-button" size="small" slot="prepend">项目名称</el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-for="(item, index) in editProjectForm.keywords" :key="index">
            <el-autocomplete class="keyWord" v-model="editProjectForm.keywords[index]"
                             :fetch-suggestions="querySearchAsync"
                             :trigger-on-focus="false" placeholder="您感兴趣的关键词(请不要超过15个字符)" :disabled="index<2"
                             @keyup.native="keywordChange">
              <el-button class="label-button" size="small" slot="prepend">关键词{{index+1}}</el-button>
            </el-autocomplete>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="updateProject" :loading="isUpdating">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "application-supervise",
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('项目名不能为空'));
        }
        if (value.length > 15) {
          return callback(new Error('项目名过长，请不要超过15个字符'));
        }
        callback();
      };
      return {
        isUpdating: false,
        editProjectForm: {
          projectId: '',
          projectName: '',
          keywords: []
        },
        currentProject: {},
        keywords: '',
        rules: {
          // projectName: [
          //   {validator: checkName, trigger: 'blur'}
          // ]
        },
        userInfo: {}
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.getProjectData();
    },
    methods: {
      updateProject() {
        this.isUpdating = true;
        let keywords = [...this.editProjectForm.keywords].filter(s => s.trim() !== "").toString();
        if (this.editProjectForm.projectName.trim() === "") {
          this.$message({type: "error", message: "项目名称不能为空"});
          this.editProjectForm.projectName = this.currentProject.projectName;
          this.isUpdating = false;
          return;
        }
        if (this.editProjectForm.projectName.length > 15) {
          this.$message({
            type: "error",
            message: "项目名过长，请不要超过15个字符"
          });
          this.isUpdating = false;
          return;
        }
        if (this.editProjectForm.keywords[2].length > 15) {
          this.$message({
            type: "error",
            message: "关键字过长，请不要超过15个字符"
          });
          this.isUpdating = false;
          return;
        }
        this.currentProject.projectName = this.editProjectForm.projectName;
        this.currentProject.keywordList = this.editProjectForm.keywords.map(e => ({keywordName: e})
        );
        this.$http({
          url: this.$api.sentiment.updateProject,
          type: "POST",
          params: {
            userId: this.$cookie.get('userId'),
            projectId: this.editProjectForm.projectId,
            projectName: this.editProjectForm.projectName,
            keyword: keywords,
            isMonitor: true,
            isNotice: false
          }
        }).then(res => {
          this.isUpdating = false;
          if (res.data.returnCode == 1) {
            this.editProjectDialogVisible = false;
            this.$message({type: "success", message: "更新成功"});
          } else {
            this.isUpdating = false;
            this.$message({type: "error", message: "更新失败"});
          }
        }).catch(err => {
          this.isUpdating = false;
        });
      },
      //
      keywordChange(e) {
        // 过滤逗号输入
        this.editProjectForm.keywords = [...this.editProjectForm.keywords].map(
          e => e.trim().replace(/[,，]/, "")
        );
      },
      //
      querySearchAsync(queryString, cb) {
        this.$http({
          method: "GET",
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: queryString
          }
        }).then(res => {
          const obj = [];
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            console.log(res.data.returnObject);
            let data = res.data.returnObject;
            data.forEach(item => {
              obj.push({
                value: item.name,
                code: item.code
              });
            });
          }
          cb(obj);
        });
      },
      // /sentiment/getProjectByCompanyId
      getProjectData() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.sentiment.getProjectByCompanyId,
            params: {
              companyId: this.userInfo.companyId
            }
          }).then(res => {
            this.currentProject = res.data.returnObject[0];
            this.projectTitle = this.currentProject.projectName;
            this.keywords = [...this.currentProject.keywordList].map(
              e => e.keywordName
            );
            if (this.keywords.length < 3) {
              this.keywords.push("");
            }
            this.ruleForm = {
              name: this.currentProject.projectName,
              keyWordOne: '',
              keyWordTwo: '',
              keyWordThree: ''
            };
            this.editProjectForm = {
              projectId: this.currentProject.id,
              projectName: this.currentProject.projectName,
              keywords: this.keywords
            };
            console.log(this.editProjectForm);
            resolve(null);
          }).catch(err => reject);
        });
      },
      //
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.getProjectData();
        // this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss">
  #application-supervise {
    .form-list {
      width: 50%;
      .form-box {
        height: 251px;
      }
      .keyWord {
        width: 100%;
      }
      .label-button {
        width: 90px;
      }
      .footer {
        text-align: center;
      }
    }
  }
</style>
