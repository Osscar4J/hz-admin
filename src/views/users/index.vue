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
      <el-table-column align="center" label="姓名" width="95">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="210">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender == 0 ? '女' : ( scope.row.gender == 1 ? '男' : '未知' ) }}</span>
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
    </el-table>
  </div>
</template>

<script>
import UserAPi from '@/api/user'

export default {
  name: 'users',
  data() {
    return {
      reqvo: {current: 1},
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
      let res = await UserAPi.getPage(this.reqvo)
      this.dataLoading = false
      console.log(res)
      this.data = res.content
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
}
</style>
