<template>
  <ArticleList v-if="user.name"/>
  <CreateUser v-else />
</template>

<script>
import { mapActions } from "vuex";
import ArticleList from './Article/List.vue'
import CreateUser from './User/Create.vue'

export default {
  name: 'Home',
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
