<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="名称">
          <el-input v-model="reqvo.name" placeholder="订单名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="发布人姓名">
          <el-input v-model="reqvo.creatorName" placeholder="发布人姓名" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="reqvo.status" placeholder="选择订单状态" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="待审核" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="审核不通过" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已取消" :value="4" />
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
       <el-table-column align="center" label="封面" width="100">
        <template slot-scope="scope">
          <div class="cover" v-if="scope.row.cover">
            <viewer :images="[scope.row.cover]">
                <img :src="scope.row.cover" class="f-csp">
            </viewer>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
            <i v-if="scope.row.type == 1" class="el-icon-s-cooperation text-blue" title="维修"></i>
            {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="发布人" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.creator">
            <div>姓名：{{ scope.row.creator.name }}</div>
            <div>电话：{{ scope.row.creator.phone }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="单位" prop="orgName"></el-table-column>
      <el-table-column align="center" label="上门费" width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.checkFee }}
          </template>
      </el-table-column>
      <el-table-column align="center" label="总金额" width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.totalFee }}
          </template>
      </el-table-column>
      <el-table-column align="center" label="实付金额" width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.fee }}
          </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status == 1">进行中</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="danger">审核不通过</el-tag>
          <div v-else-if="scope.row.status == 3">
              <i v-if="scope.row.confirmed == 0" class="el-icon-warning-outline text-red" title="待客户确认"></i>
              <i v-else-if="scope.row.confirmed == 1" class="el-icon-circle-check text-green" title="客户已确认"></i>
              <el-tag type="success"> 已完成 </el-tag>
          </div>
          <el-tag v-else-if="scope.row.status == 4" type="warning">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="维修员" width="140" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.state == 1">
              <div v-if="scope.row.deviceOrder">
                <div>{{scope.row.deviceOrder.repairUserName}}</div>
                <div>{{scope.row.deviceOrder.repairUserPhone}}</div>
              </div>
              <div v-else class="text-red">数据异常</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="140" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="问题描述" align="left">
        <template slot-scope="scope">
          <pre v-if="scope.row.deviceOrder">{{scope.row.deviceOrder.description}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push('/order/editor?id=' + scope.row.id)">详情</el-button>
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
import OrderAPi from '@/api/order'

export default {
  name: 'orders',
  data() {
    return {
        reqvo: {
            creatorName: '',
            current: 1,
            size: 10,
            status: null
        },
        data: {},
        dataLoading: true
    }
  },
  created() {

  },
  mounted() {
    this.getPage(1)
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await OrderAPi.getPage(this.reqvo)
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
