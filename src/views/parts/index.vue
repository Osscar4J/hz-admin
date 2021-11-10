<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="名称">
          <el-input v-model="reqvo.name" placeholder="单位名称" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="认证">
          <el-select v-model="reqvo.auth" placeholder="选择认证状态" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="未认证" :value="0" />
            <el-option label="单位认证" :value="1" />
            <el-option label="个人认证" :value="2" />
          </el-select>
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
      <el-table-column align="left" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="管理员" width="160">
        <template slot-scope="scope">
          <div>姓名：{{ scope.row.manager.name }}</div>
          <div>电话：{{ scope.row.manager.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否认证" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.authed == 1" class="color-success">
              已认证
              <span v-if="scope.row.type == 1">（单位）</span>
              <span v-else-if="scope.row.type == 2">（个人）</span>
          </span>
          <div v-else-if="scope.row.authed == 0" class="color-danger">
            <span v-if="scope.row.auth && scope.row.auth.status==0" class="text-blue">待审核</span>
            <span v-else>未认证</span>
          </div>
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
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="$router.push('/orgs/editor?id=' + scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.authed == 0 && scope.row.auth && scope.row.auth.status == 0" type="text" icon="el-icon-check" @click="$router.push('/orgs/check?id=' + scope.row.id)">审核</el-button>
          <el-button v-if="scope.row.auth" type="text" icon="el-icon-s-check" @click="$router.push('/orgs/check?id=' + scope.row.id)">认证资料</el-button>
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
            size: 10,
            auth: null
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
      this.data = res.content
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
