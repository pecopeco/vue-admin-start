<template lang="pug">
  component(:is="type" v-bind="linkProps(to)")
    slot
</template>

<script>

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExt () {
      return this.isExternal(this.to)
    },
    type() {
      if (this.isExt) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExt) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
