<template>
  <div id="app">
    Hello {{name}}
    <child></child>
  </div>
</template>

<style lang="less" scoped>
  @import '~common/css/base.less';

</style>

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
        name: '<%=pageName%>',
      }
    },
    mounted() {

    }
  }

</script>
