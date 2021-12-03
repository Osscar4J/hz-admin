<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
      <el-form-item label="封面" required>
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="entity.avatar" :src="entity.avatar" class="cover">
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
      <el-form-item label="是否置顶">
        <el-switch 
          active-color="#13ce66" 
          v-model="entity.isTop" 
          :active-value="1" 
          :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="成本价" required>
        <el-input v-model="entity.basePrice" maxlength="32" type="number" />
      </el-form-item>
      <el-form-item label="销售价" required>
        <el-input v-model="entity.sellPrice" maxlength="32" type="number" />
      </el-form-item>
      <el-form-item label="所属分类" required>
        <el-select v-model="entity.classifyId" placeholder="选择分类">
          <el-option v-for="item in classifies" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" required>
        <el-select v-model="selectedBrands" multiple placeholder="选择品牌">
          <el-option v-for="item in brands" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="图集">
        <div class="images">
          <div class="img" v-for="item in images" :key="item">
            <div class="close" @click="removeImage(item)">×</div>
            <img :src="item">
          </div>
          <div class="img">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImageUpload">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <div class="margin-top clear-both">
          <el-progress v-show="percentage2 > 0 && percentage2 < 100" :stroke-width="16" :text-inside="true" :percentage="percentage2"></el-progress>
        </div>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="entity.description" maxlength="200" type="textarea" placeholder="简介" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PartsApi from '@/api/parts'
import ClassifyApi from '@/api/classify'
import FileApi from '@/api/file'
import Constants from '@/constants'
import BrandApi from '@/api/brand'

export default {
  name: 'partsEditor',
  data() {
    return {
        entity: {
          status: 0,
          classifyId: null
        },
        percentage: 0,
        percentage2: 0,
        classifies: [],
        brands: [],
        selectedBrands: [],
        images: []
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.$showLoading()
      PartsApi.getInfo(id).then(res => {
        this.entity = res.content
        if (this.entity.covers) {
          this.images = this.entity.covers.map(f => f.fileUrl)
        }
        if (this.entity.brands) {
          this.selectedBrands = this.entity.brands.map(b => b.id)
        }
        this.$hideLoading()
      })
    }
    this.getClassifies()
    this.getBrands()
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      if (this.selectedBrands.length > 0) {
        this.entity.brands = this.selectedBrands.map(id => {
          return {
            id: id
          }
        })
      }
      if (this.images.length > 0) {
        this.entity.covers = this.images.map((f, i) => {
          return {
            fileUrl: f,
            sortNo: i + 1
          }
        })
      }
      let res = await PartsApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('保存成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },

    removeImage(fileUrl) {
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i] == fileUrl) {
          FileApi.deleteFile(fileUrl)
          this.images.splice(i, 1)
          break
        }
      }
    },

    beforeAvatarUpload(e) {
      let fileUrl = 'parts/cover/'+new Date().getTime() + e.name.substr(e.name.indexOf('.'))
      FileApi.upload({
        filename: fileUrl,
        file: e,
        progress: async (n) => {
          this.percentage = parseInt(n * 100)
          if (this.percentage >= 100) {
            setTimeout(async () => {
              await FileApi.publicRead(fileUrl)
              if (this.entity.avatar) {
                FileApi.deleteFile(this.entity.avatar)
              }
              this.$set(this.entity, 'avatar', Constants.OSS_URL + fileUrl)
            }, 100)
          }
        }
      })
      return false
    },

    beforeImageUpload(e) {
      let fileUrl = 'parts/cover/'+new Date().getTime() + e.name.substr(e.name.indexOf('.'))
      FileApi.upload({
        filename: fileUrl,
        file: e,
        progress: async (n) => {
          this.percentage2 = parseInt(n * 100)
          if (this.percentage2 >= 100) {
            setTimeout(async () => {
              await FileApi.publicRead(fileUrl)
              this.images = this.images.concat(Constants.OSS_URL + fileUrl)
            }, 100)
          }
        }
      })
      return false
    },

    getClassifies() {
      ClassifyApi.getPage({
        pageable: 0,
        type: 1,
        status: 1
      }).then(res => {
        this.classifies = res.content.records || []
      })
    },

    getBrands() {
      BrandApi.getPage({
        pageable: 0,
        status: 1
      }).then(res => {
        this.brands = res.content.records || []
      })
    }
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
.avatar-uploader {
  .el-upload {
    .el-icon-plus {
      border: 1px dashed #d9d9d9;
    }
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
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
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.images {
  .img {
    float: left;
    position: relative;
    margin-right: 15px;
    margin-bottom: 15px;
    &>img {
      height: 178px;
    }
    &>.close {
      position: absolute;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: #000000;
      opacity: .4;
      color: #ffffff;
      right: -10px;
      top: -10px;
      cursor: pointer;
      &:hover {
        color: brown;
      }
    }
  }
}
</style>
