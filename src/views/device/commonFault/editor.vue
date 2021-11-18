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

      <el-form-item label="所属分类" required>
        <el-select v-model="entity.classifyId" placeholder="选择分类">
          <el-option label="无" value="0" />
          <el-option v-for="item in classifies" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="故障描述" required>
        <el-input v-model="entity.description" maxlength="500" type="textarea" placeholder="500字以内" :rows="4" />
      </el-form-item>

      <el-form-item label="解决方案">
        <el-input v-model="entity.answer" maxlength="500" type="textarea" placeholder="500字以内" :rows="4" />
      </el-form-item>

      <el-form-item label="所需配件">
        <el-select
          style="width:100%;"
          v-model="currPartsIndex"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          @change="partsChanged"
          :remote-method="searchParts"
          :loading="partsLoading">
          <el-option
            v-for="(item,index) in partsList"
            :key="item.id"
            :label="item.name"
            :value="index">
          </el-option>
        </el-select>
        <div class="parts">
          <div class="item" v-for="(item, index) in selectedParts" :key="item.id">
            <span>{{item.name}}</span>
            <span> 
              <span class="text-gray" style="padding-left:10px;"> 数量： </span>
              <input type="number" style="width: 80px; text-align:center;" v-model="item.amount">
            </span>
            <span class="close-bar" @click="removeParts(index)">
              <span class="el-icon-close"></span>
            </span>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonFaultApi from '@/api/commonFault'
import ClassifyApi from '@/api/classify'
import PartsApi from '@/api/parts'

export default {
  name: 'faultEditor',
  data() {
    return {
        entity: {
          status: 0
        },
        classifies: [],
        brands: [],
        selectedBrands: [],
        partsList: [],
        partsLoading: false,
        currPartsIndex: null,
        selectedParts: [], // 已选择的配件列表
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.$showLoading()
      CommonFaultApi.getInfo(id).then(res => {
        this.entity = res.content
        if (res.content && res.content.parts) {
          this.selectedParts = res.content.parts
        }
        this.$hideLoading()
      })
    }
    this.getClassifies()
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      let partsList = this.selectedParts.filter(p => p.amount > 0)
      if (partsList.length > 0) {
        this.entity.parts = partsList
      }

      let res = await CommonFaultApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },

    getClassifies() {
      ClassifyApi.getPage({
        pageable: 0,
        type: 3,
        status: 1
      }).then(res => {
        this.classifies = res.content.records || []
      })
    },

    searchParts(key) {
      this.partsLoading = true
      PartsApi.getPage({
        size: 20,
        name: key,
        status: 1
      }).then(res => {
        this.partsList = res.content.records || []
        this.partsLoading = false
      })
    },

    partsChanged() {
      let parts = this.partsList[this.currPartsIndex]
      let tempArr = this.selectedParts.filter(p => p.id == parts.id)
      if (tempArr.length > 0) {
        tempArr[0].amount += 1
      } else {
        parts.amount = 1
        this.selectedParts.push(parts)
      }
        this.currPartsIndex = null
    },

    removeParts(index) {
      this.selectedParts.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.parts {
  &>.item+.item {
    border-top: 1px solid #f1f1f1;
  }
  .close-bar {
    padding: 0 10px;
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
}
</style>
