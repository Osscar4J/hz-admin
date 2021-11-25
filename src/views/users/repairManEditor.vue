<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
        <el-form-item label="照片">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="entity.avatar" :src="entity.avatar" class="cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>
          <el-progress v-show="percentage > 0 && percentage < 100" :stroke-width="16" :text-inside="true" :percentage="percentage"></el-progress>
        </div>
      </el-form-item>
      <el-form-item label="姓名" required>
        <el-input v-model="entity.name" maxlength="32" />
      </el-form-item>
      <el-form-item label="性别" required>
        <el-radio v-model="entity.gender" :label="1">男</el-radio>
        <el-radio v-model="entity.gender" :label="0">女</el-radio>
      </el-form-item>
      <el-form-item label="电话（账号）" required>
        <el-input v-model="entity.phone" maxlength="16" :disabled="!!entity.id" />
      </el-form-item>
      <el-form-item label="密码" v-if="!entity.id">
        <el-input v-model="entity.pwd" type="password" maxlength="16" />
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="entity.stuffNo" maxlength="10" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="entity.email" maxlength="100" />
      </el-form-item>
      <el-form-item label="维修站" required>
        <el-select v-model="entity.groupId" placeholder="选择维修站">
          <el-option v-for="item in groups" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="维修管理员">
        <el-switch v-model="isManager" active-color="#13ce66" inactive-color="#cccccc"></el-switch>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="entity.address" maxlength="255" placeholder="200字以内" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="entity.description" maxlength="255" type="textarea" placeholder="200字以内" :rows="4" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import RepairManApi from '@/api/repairMan'
import GroupApi from '@/api/group'
import FileApi from '@/api/file'
import Constants from '@/constants'

export default {
  name: 'repairManEditor',
  data() {
    return {
        entity: {
          status: 1,
          gender: 1
        },
        percentage: 0,
        isManager: false,
        groups: [],
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.$showLoading()
      RepairManApi.getInfo(id).then(async res => {
          this.isManager = res.content.isManager == 1
        this.entity = res.content
        this.$hideLoading()
      })
    }
    this.getGroups()
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      if (!this.entity.name) {
        this.$message.error('请输入姓名')
        return false
      }
      if (!this.entity.phone) {
        this.$message.error('请输入手机号')
        return false
      }
      if (this.entity.pwd) {
          this.entity.password = this.$md5(this.entity.pwd)
      }
      this.entity.isManager = this.isManager ? 1 : 0
      let res = await RepairManApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('保存成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },

    beforeAvatarUpload(e) {
      let fileUrl = 'avatar/'+new Date().getTime() + e.name.substr(e.name.indexOf('.'))
      FileApi.upload({
        filename: fileUrl,
        file: e,
        progress: async (n) => {
          this.percentage = parseInt(n * 100)
          if (this.percentage >= 100) {
            setTimeout(async () => {
              await FileApi.publicRead(fileUrl)
              if (this.entity.avatar && !/avatar\.jpg$/.test(this.entity.avatar)) {
                FileApi.deleteFile(this.entity.avatar)
              }
              this.$set(this.entity, 'avatar', Constants.OSS_URL + fileUrl)
            }, 100)
          }
        }
      })
      return false
    },

    getGroups() {
      GroupApi.getPage({
        pageable: 0,
        status: 1
      }).then(res => {
        this.groups = res.content.records || []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
  max-height: 200px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
