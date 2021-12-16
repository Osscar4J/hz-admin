<template>
  <div class="app-container">
    <div>
      <div class="f-fl">
        <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
          <el-form-item label="单位">
            <el-select v-model="reqvo.orgId" placeholder="选择单位" @change="getPage(1)">
              <el-option label="全部" :value="null" />
              <el-option :label="item.name" :value="item.id" v-for="item in orgs" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getPage(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="f-fr">
        <el-button type="success" @click="showOrders">结账</el-button>
      </div>
    </div>

    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column align="left" label="操作人" prop="creatorName" width="160"></el-table-column>
      <el-table-column align="left" label="单位" prop="orgName"></el-table-column>
      <el-table-column align="center" label="总金额" width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.totalFee }}
          </template>
      </el-table-column>
      <el-table-column align="center" label="结账周期">
        <template slot-scope="scope">
          <div>
            {{new Date(scope.row.startTime).Format('yyyy年MM月dd日')}} - {{new Date(scope.row.endTime).Format('yyyy年MM月dd日')}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="140" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="left">
        <template slot-scope="scope">
          <pre v-if="scope.row.description">{{scope.row.description}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
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

    <el-dialog title="选择结账周期" :visible.sync="ordersVisible" width="70%">
      <div>
        <div class="margin-bottom-sm">
          <span>选择单位：</span>
          <el-select v-model="orderReqvo.orgId" placeholder="选择单位" @change="getOrderPage(1)">
            <el-option :label="item.name" :value="item.id" v-for="item in orgs" :key="item.id" />
          </el-select>

          <span> 选择周期：</span>
          <el-date-picker
            v-model="billPeriod"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="margin-bottom-sm">
          <div>备注：</div>
          <div class="margin-top-sm">
            <el-input type="textarea" :rows="2" placeholder="请输入备注内容" v-model="billDesc"></el-input>
          </div>
        </div>
        <div class="margin-bottom-sm text-center">
          <el-button type="primary" style="min-width:140px;" @click="takeBill">结 账</el-button>
        </div>
        <el-table
          v-loading="ordersLoading"
          :data="orderData.records"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
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
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.hasBill == 0">未结账</el-tag>
              <el-tag v-else-if="scope.row.hasBill == 1" type="success">已结账</el-tag>
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
        </el-table>
        
        <div class="page">
            <el-pagination 
                :current-page="orderReqvo.current" 
                background 
                layout="prev, pager, next" 
                :total="orderData.total" 
                :hide-on-single-page="true" 
                :page-size="orderReqvo.size"
                @current-change="getOrderPage">
            </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BillMainApi from '@/api/billMain'
import OrgApi from '@/api/org'
import OrderApi from '@/api/order'

export default {
  name: 'billMain',
  data() {
    return {
        reqvo: {
            current: 1,
            size: 10,
            status: null
        },
        data: {},
        dataLoading: true,
        entity: null,
        orgs: [],

        ordersVisible: false,
        orderReqvo: {
          current: 1,
          size: 10,
          confirmed: 1
        },
        orderData: {},
        ordersLoading: false,
        billPeriod: null,
        billDesc: '', // 结账时的备注
    }
  },
  watch: {
    billPeriod(n, o) {
      if (n) {
        this.orderReqvo.startTime = n[0].Format('yyyy-MM-dd hh:mm:ss')
        this.orderReqvo.endTime = n[1].Format('yyyy-MM-dd hh:mm:ss')
      } else {
        this.orderReqvo.startTime = null
        this.orderReqvo.endTime = null
      }
      this.getOrderPage(1)
    }
  },
  mounted() {
    this.getPage(1)
    this.getOrgs()
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await BillMainApi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    getOrgs() {
      OrgApi.getPage({ pageable: 0, neAuth: 0 }).then(res => {
        this.orgs = res.content.records || []
      })
    },

    // 结账，打开订单列表弹窗
    showOrders() {
      this.ordersVisible = true
      // 选中第一个单位
      if (this.orgs[0]) {
        this.orderReqvo.orgId = this.orgs[0].id
      }
      this.getOrderPage(1)
    },

    async getOrderPage(page) {
      this.orderReqvo.current = page || this.orderReqvo.current
      this.ordersLoading = true
      let res = await OrderApi.getPage(this.orderReqvo)
      this.orderData = res.content
      this.ordersLoading = false
    },

    // 结账
    takeBill() {
      this.$confirm('确定结账吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(v => {
        if (this.orderData.total == 0) {
          this.$message.warning('没有可以结账的订单')
          return false
        }
        BillMainApi.save({
          orgId: this.orderReqvo.orgId,
          startTime: this.orderReqvo.startTime,
          endTime: this.orderReqvo.endTime,
          description: this.billDesc
        }).then(res => {
          if (res.code == 0) {
            this.$message.success('已结账')
            this.getOrderPage()
            this.getPage()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
}
</script>

