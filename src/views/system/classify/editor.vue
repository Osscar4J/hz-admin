<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
      <el-form-item label="封面" required>
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="entity.cover" :src="entity.cover" class="cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="margin-top">
          <el-progress v-show="percentage > 0 && percentage < 100" :stroke-width="16" :text-inside="true" :percentage="percentage"></el-progress>
        </div>
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input v-model="entity.name" maxlength="255" />
      </el-form-item>
      <el-form-item label="发布状态">
        <el-switch 
          active-color="#13ce66" 
          v-model="entity.status" 
          :active-value="1" 
          :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="类型" required>
        <el-select v-model="entity.type" placeholder="选择类型">
            <el-option label="配件" :value="1" />
            <el-option label="故障" :value="2" />
            <el-option label="设备" :value="3" />
          </el-select>
      </el-form-item>
      <el-form-item label="首页展示">
        <el-switch v-model="showHome" active-color="#13ce66" inactive-color="#cccccc"></el-switch>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="entity.sortNo" maxlength="12" type="number" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ClassifyApi from '@/api/classify'
import FileApi from '@/api/file'
import Constants from '@/constants'

export default {
  name: 'classifyEditor',
  data() {
    return {
        entity: {
          type: 1,
          sortNo: 1,
          status: 0
        },
        percentage: 0,
        showHome: false,
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.$showLoading()
      ClassifyApi.getInfo(id).then(res => {
        this.showHome = res.content.showHome == 1
        this.entity = res.content
        this.$hideLoading()
      })
    }
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      this.entity.showHome = this.showHome ? 1 : 0
      let res = await ClassifyApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },

    beforeAvatarUpload(e) {
      let fileUrl = 'classify/cover/'+new Date().getTime() + e.name.substr(e.name.indexOf('.'))
      FileApi.upload({
        filename: fileUrl,
        file: e,
        progress: async (n) => {
          this.percentage = parseInt(n * 100)
          if (this.percentage >= 100) {
            setTimeout(async () => {
              await FileApi.publicRead(fileUrl)
              if (this.entity.cover) {
                FileApi.deleteFile(this.entity.cover)
              }
              this.$set(this.entity, 'cover', Constants.OSS_URL + fileUrl)
            }, 100)
          }
        }
      })
      return false
    },
  }
}
</script>

<style lang="scss" scoped>
.lonlat {
  display: flex;
  width: 350px;
  &>.item {
    flex: 1;
  }
  .splitor {
    padding: 0 10px;
  }
}
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
