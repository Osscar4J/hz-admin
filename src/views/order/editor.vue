<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
      <el-form-item label="订单名称">
        <div>{{entity.name}}</div>
      </el-form-item>
      <el-form-item label="状态">
        <div>
            <el-tag v-if="entity.status == 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="entity.status == 1">进行中</el-tag>
            <el-tag v-else-if="entity.status == 2" type="danger">审核不通过</el-tag>
            <div v-else-if="entity.status == 3">
                <i v-if="entity.confirmed == 0" class="el-icon-warning-outline text-red" title="待客户确认"></i>
                <i v-else-if="entity.confirmed == 1" class="el-icon-circle-check text-green" title="客户已确认"></i>
                <el-tag type="success"> 已完成 </el-tag>
            </div>
            <el-tag v-else-if="entity.status == 4" type="warning">已取消</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="发布人">
        <div v-if="entity.creator">{{ entity.creator.name }} （{{entity.creator.phone}}）</div>
      </el-form-item>
      <el-form-item label="单位名称">
        <div>{{entity.orgName}}</div>
      </el-form-item>
      <el-form-item label="提交时间">
        <div>{{new Date(entity.createTime).Format('yyyy/MM/dd hh:mm')}}</div>
      </el-form-item>
      <el-form-item label="实付金额">
        <div>￥{{entity.fee}}</div>
      </el-form-item>
      <el-form-item label="上门费">
        <div>￥{{entity.checkFee}}</div>
      </el-form-item>

      <el-form-item label="维修员">
        <div v-if="entity.deviceOrder.repairUserId != 0">
            <span>{{entity.deviceOrder.repairUserName}}（{{entity.deviceOrder.repairUserPhone}}）</span>
        </div>
        <div>
            <el-button type="success" size="mini">更换维修员</el-button>
        </div>
      </el-form-item>

      <el-form-item label="问题描述">
          <div v-if="entity.deviceOrder">
            <div>{{entity.deviceOrder.description || '暂无描述'}}</div>
            <div>
                <div class="auth-images">
                  <viewer :images="images">
                    <div v-for="item in images" :key="item.id">
                        <img :src="item.fileUrl" preview-text="" class="f-csp">
                    </div>
                  </viewer>
                </div>
                <div class="clear-both"></div>
                <div class="auth-images" v-if="videos.length > 0">
                    <div class="text-gray">视频</div>
                    <div v-for="item in videos" :key="item.id">
                        <video :src="item.fileUrl" controls style="height:180px;"></video>
                    </div>
                </div>
                <div class="clear-both"></div>
            </div>
            <div class="text-gray">配件列表</div>
            <div class="margin-top-sm" v-if="entity.deviceOrder.parts.length > 0">
                <div class="f-df" v-for="item in entity.deviceOrder.parts" :key="item.id">
                    <div class="f-flex1">{{item.name}} × {{item.amount}}</div>
                </div>
            </div>
            <div v-else class="text-gray">无</div>
          </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import OrderAPi from '@/api/order'

export default {
  name: 'orderEditor',
  data() {
    return {
        entity: {},
        images: [],
        videos: [],
    }
  },
  mounted() {
    OrderAPi.getInfo(this.$route.query.id).then(res => {
        if (res.content.deviceOrder) {
            this.images = res.content.deviceOrder.files.filter(f => f.type == 1)
            this.videos = res.content.deviceOrder.files.filter(f => f.type == 2)
        }
        this.entity = res.content
    })
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      let res = await OrderAPi.updateById(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.auth-images {
  &>div>div {
    height: 150px;
    margin-right: 15px;
    margin-bottom: 15px;
    float: left;
    &>img {
      height: 100%;
      border-radius: 10px;
    }
  }
}
</style>
