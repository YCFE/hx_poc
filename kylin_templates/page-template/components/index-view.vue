<template>
  <div id="app">
    Hello
    <child></child>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import child from './child';

  export default {
    name: '<%=pageName%>',
    components: {
      child
    },
    data() {
      return {

      }
    },
    mounted() {

    }
  }

</script>

<style lang="less" scoped>
  @import '~common/css/base.less';

</style>
