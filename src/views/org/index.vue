<template>
  <div class="app-container">
    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="left" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="管理员">
        <template slot-scope="scope">
          <div>姓名：{{ scope.row.manager.name }}</div>
          <div>电话：{{ scope.row.manager.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否认证" width="210">
        <template slot-scope="scope">
          <span v-if="scope.row.authed == 1" class="color-success">
              已认证
              <span v-if="scope.row.type == 1">（单位）</span>
              <span v-else-if="scope.row.type == 2">（个人）</span>
          </span>
          <span v-else-if="scope.row.authed == 0" class="color-danger">未认证</span>
        </template>
      </el-table-column>
      <el-table-column label="经纬度" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.longitude }} / {{ scope.row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="left">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push('/orgs/editor?id=' + scope.row.id)">编辑</el-button>
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
import OrgAPi from '@/api/org'

export default {
  name: 'orgs',
  data() {
    return {
        reqvo: {
            current: 1,
            size: 6
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
      let res = await OrgAPi.getPage(this.reqvo)
      this.dataLoading = false
      console.log(res)
      this.data = res.content
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
