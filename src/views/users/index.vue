<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="名称">
          <el-input v-model="reqvo.name" placeholder="名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="reqvo.phone" placeholder="手机号" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="reqvo.orgName" placeholder="输入单位名称关键词" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="头像" width="80">
        <template slot-scope="scope">
          <div class="cover">
            <img :src="scope.row.avatar">
          </div>
        </template>
      </el-table-column>
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
      <el-table-column label="单位" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.org">{{scope.row.org.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="210" align="center">
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
      reqvo: {
        current: 1,
        phone: '',
        orgName: ''
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
      let res = await UserAPi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
    img {
        height: 60px;
    }
}
</style>
