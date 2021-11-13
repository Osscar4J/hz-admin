<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
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
      <el-form-item label="行政区域">
        <el-select v-model="province" placeholder="请选择省" @change="provinceChanged">
          <el-option
            v-for="item in provinces"
            :key="item.id"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
        -
        <el-select v-model="city" placeholder="请选择市" @change="cityChanged">
          <el-option
            v-for="item in cities"
            :key="item.id"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
        -
        <el-select v-model="entity.areaCode" placeholder="请选择区县">
          <el-option
            v-for="item in districts"
            :key="item.id"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经纬度" required>
        <div class="lonlat">
          <div class="item">
            <el-input v-model="entity.longitude" type="number" placeholder="经度" />
          </div>
          <div class="splitor"> - </div>
          <div class="item">
            <el-input v-model="entity.latitude" type="number" placeholder="纬度" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="entity.description" maxlength="255" type="textarea" placeholder="140字以内" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import GroupApi from '@/api/group'
import CommonApi from '@/api/common'

export default {
  name: 'areaEditor',
  data() {
    return {
        entity: {
          type: 1,
          status: 1
        },
        cityReqvo: {
          parent: null,
          lv: 2
        },
        percentage: 0,
        provinces: [],
        cities: [],
        districts: [],
        province: null,
        city: null,
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      GroupApi.getInfo(id).then(async res => {
        this.entity = res.content
        let areaCode = this.entity.areaCode
        if (areaCode) {
          if (areaCode.length >= 4) { // 获取区县列表
            this.city = areaCode.substr(0, 4)
            await this.getAreas(this.city, 'districts')
          }
          if (areaCode.length >= 2) { // 获取市列表
            this.province = areaCode.substr(0, 2)
            this.getAreas(this.province, 'cities')
          }
        }
      })
    }
    this.getAreas()
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    getAreas(parent, arr) {
      arr = arr || 'provinces'
      this.cityReqvo.parent = parent
      if (!parent) {
        this.cityReqvo.lv = 2
      }
      return CommonApi.getAreas(this.cityReqvo).then(res => {
        this[arr] = res.content
      })
    },

    provinceChanged(v) {
      this.getAreas(v, 'cities')
    },

    cityChanged(v) {
      this.getAreas(v, 'districts')
    },

    async onSubmit() {
      if (!this.entity.name) {
        this.$message.error('请输入名称')
        return false
      }
      if (!this.entity.longitude || !this.entity.latitude) {
        this.$message.error('请输入经纬度')
        return false
      }
      let res = await GroupApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lonlat {
  display: flex;
  width: 400px;
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
