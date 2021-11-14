<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="发布状态">
          <el-select v-model="reqvo.status" placeholder="选择发布状态" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="已发布" :value="1" />
            <el-option label="未发布" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="reqvo.classifyId" placeholder="选择类型" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option v-for="item in classifies" :label="item.name" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="text-right" style="margin-bottom:15px;">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/device/parts/editor')">新增</el-button>
    </div>
    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="封面">
        <template slot-scope="scope">
          <div class="cover">
            <img :src="scope.row.avatar">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column label="价格" align="left" width="120">
        <template slot-scope="scope">
          <div>
            <div :class="{ 'text-green': scope.row.sellPrice > scope.row.basePrice, 'text-red': scope.row.sellPrice < scope.row.basePrice }">销售价：{{scope.row.sellPrice}}</div>
            <div>成本价：{{scope.row.basePrice}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属分类" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.classify">{{scope.row.classify.name}}</div>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="发布状态" width="110" align="center">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="updateEntity(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="$router.push('/device/parts/editor?id=' + scope.row.id)">修改</el-button>
          <el-button type="text" icon="el-icon-coin" @click="$router.push('/device/parts/sku?id=' + scope.row.id)">库存</el-button>
          <el-button v-if="scope.row.status == 0" type="text" class="text-red" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="page">
        <el-pagination 
            :current-page="reqvo.current" 
            background 
            layout="prev, pager, next" 
            :total="data.total" 
            :hide-on-single-page="true" 
            :page-size="reqvo.size"
            @current-change="getPage">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import PartsApi from '@/api/parts'
import ClassifyApi from '@/api/classify'

export default {
  name: 'parts',
  data() {
    return {
        reqvo: {
            current: 1,
            size: 10,
            status: null,
            classifyId: null,
            brandId: null,
        },
        data: {},
        dataLoading: true,
        classifies: [],
    }
  },
  mounted() {
    this.getPage(1)
    this.getClassifies()
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await PartsApi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    updateEntity(entity) {
        PartsApi.saveOrUpdate({
            id: entity.id,
            status: entity.status
        }).then(res => {
            if (res.code != 0) {
                this.$message.error(res.msg)
            } else {
                this.$message.success('更新成功')
            }
        })
    },

    removeById(id) {
        this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(res => {
          PartsApi.removeById(id).then(res => {
              if (res.code == 0) {
                  this.getPage(1)
                  this.$message.success('删除成功')
              } else {
                  this.$message.error(res.msg)
              }
          })
      })
    },

    getClassifies() {
      ClassifyApi.getPage({
        pageable: 0,
        type: 1,
        status: 1
      }).then(res => {
        this.classifies = res.content.records || []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
    img {
        height: 100px;
    }
}
</style>
