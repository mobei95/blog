<template>
  <div>
    <p @click="clickHandle">test</p>
    <router-link to="/" tag="div">to home</router-link>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    created() {
      console.log('this.$router', this)
    },
    methods: {
      clickHandle() {
        console.log('click', this.$router.push('/'))
      }
    }
  }
</script>