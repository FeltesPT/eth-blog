<template>
  <ArticleList v-if="user.name"/>
  <CreateUser v-else />
</template>

<script>
import { mapActions } from "vuex";
import ArticleList from '../components/ArticleList.vue'
import CreateUser from '../components/CreateUser.vue'

export default {
  name: 'App',
  components: {
    ArticleList,
    CreateUser
  },
  computed: {
    user: function() { 
      return this.$store.getters.user
    },
  },
  mounted() {
    this.user = null,
    this.load()
  },
  methods: {
    ...mapActions(['GetAddress', 'GetUser']),
    async load() {
      await this.GetAddress()
      await this.GetUser()
    },
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
