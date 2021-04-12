<template>
  <ArticleList/>
</template>

<script>
import ArticleList from '../components/ArticleList.vue'

export default {
  name: 'App',
  components: {
    ArticleList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
