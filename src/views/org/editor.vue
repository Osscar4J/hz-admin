<template>
  <div class="app-container">
    编辑单位
  </div>
</template>

<script>
import OrgAPi from '@/api/org'

export default {
  name: 'orgEditor',
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
