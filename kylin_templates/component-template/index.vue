<template>
  <div>
    Hello {{name}}
  </div>
</template>

<style lang="less" rel="stylesheet/less">

</style>

<script>

  export default {
    data() {
      return {
        name: '<%=componentName%>'
      }
    },

    mounted() {

    }
  }

</script>
