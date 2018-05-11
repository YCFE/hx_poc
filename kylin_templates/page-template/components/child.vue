<template>
  <div>
    Hello {{name}}
  </div>
</template>

<style lang="less">

</style>

<script>

  export default {
    name: 'child',
    data() {
      return {
        name: 'child'
      }
    },
    mounted() {

    }
  }

</script>
