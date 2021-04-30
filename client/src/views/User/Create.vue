<template>
  <div v-if="loading">
    <h1>Loading...</h1>
  </div>
  <div v-else>
    <div>
      <h1>Create User</h1>
    </div>
    <div>
      <input type="text" placeholder="Name" v-model="name">
      <input value="Create User" type="submit" @click.prevent="submit">
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "Create User",
  data() {
    return {
      name: ""
    }
  },
  computed: {
    loading () { return this.$store.getters.loading },
  },
  methods: {
    ...mapActions(['CreateUser', 'GetUser']),
    async submit() {
      await this.CreateUser(this.name)
      await this.GetUser()
    }
  }
}
</script>