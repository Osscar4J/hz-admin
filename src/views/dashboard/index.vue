<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <el-input v-model="msg"></el-input>
    <el-empty description="dashboard"></el-empty>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      msg: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
