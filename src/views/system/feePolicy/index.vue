<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="名称">
          <el-input v-model="reqvo.name" placeholder="名称" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="reqvo.status" placeholder="选择发布状态" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="已发布" :value="1" />
            <el-option label="未发布" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="text-right" style="margin-bottom:15px;">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/system/checkFeePolicy/editor')">新增</el-button>
    </div>
    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="名称" prop="name" width="210"></el-table-column>
      <el-table-column class-name="status-col" label="计费规则" align="left">
        <template slot-scope="scope">
          <div>
              <div>
                  路程成本价：<span class="text-red">{{scope.row.roadBasePrice}}</span> 元/公里，售价：<span class="text-red">{{scope.row.roadSellPrice}}</span> 元/公里，含基础路程：<span class="text-blue">{{scope.row.baseDist}}</span> 公里。
              </div>
              <div>
                  超出 <span class="text-blue">{{scope.row.baseDist}}</span> 公里后，每 <span class="text-blue">{{scope.row.perDist}}</span> 公里增加 <span class="text-green">{{scope.row.stepHour}}</span> 工时。
              </div>
              <div>
                  工时费成本价： <span class="text-red">{{scope.row.checkBasePrice}}</span> 元/工时，售价： <span class="text-red">{{scope.row.checkSellPrice}}</span> 元/工时，含基础工时： <span class="text-green">{{scope.row.baseHour}}</span> 工时，
                  超出后每工时 <span class="text-red">{{scope.row.hourPrice}}</span> 元。
              </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="发布状态" width="110" align="center">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="updateEntity(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="$router.push('/system/checkFeePolicy/editor?id=' + scope.row.id)">修改</el-button>
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
import CheckFeePolicyApi from '@/api/checkFeePolicy'

export default {
  name: 'checkFeePolicy',
  data() {
    return {
        reqvo: {
            current: 1,
            size: 10,
            status: null
        },
        data: {},
        dataLoading: true
    }
  },
  mounted() {
    this.getPage(1)
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await CheckFeePolicyApi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    updateEntity(entity) {
        CheckFeePolicyApi.saveOrUpdate({
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
            CheckFeePolicyApi.removeById(id).then(res => {
                if (res.code == 0) {
                    this.getPage(1)
                    this.$message.success('删除成功')
                } else {
                    this.$message.error(res.msg)
                }
            })
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
