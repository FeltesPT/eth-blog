<template>
  <div class="flex w-full h-screen justify-center items-center bg-gradient-to-tr from-yellow-900 via-blue-900 to-green-900">
    <div v-if="loading">
      <h1 class="text-3xl text-white text-center">Loading...</h1>
    </div>
    <div v-else class="flex-col">
      <!-- Create User Box -->
      <div class="flex-col container rounded-xl px-6 py-4 bg-white bg-opacity-10 mt-10">
        <h1 class="text-3xl text-white text-center">Create User</h1>
        <p class="text-gray-200 mt-2 max-w-sm">In order to provide you with a full experience, please tell us your name.</p>
        <div class="flex-col mt-8">
          <input class="border border-white border-opacity-100 rounded-md px-2 w-full h-10 bg-white bg-opacity-10 text-white placeholder-white" type="text" placeholder="Name*" v-model="name">
          <input class="text-white font-bold rounded-md flex items-center justify-center bg-blue-900 px-4 py-2 w-full mt-10" value="Create User" type="submit" @click.prevent="submit">
        </div>
      </div>
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
      if (this.name.length > 0) {
        await this.CreateUser(this.name)
        await this.GetUser()
      } else {
        // Show Error properly
        window.alert("You need to set a name")
      }
    }
  }
}
</script>