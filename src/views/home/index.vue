<template lang="pug">
  .home
    .home-text name: {{ userInfo }}
</template>

<script>

export default {
  name: 'Home',
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.home {
  margin: 30px;
  .home-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
