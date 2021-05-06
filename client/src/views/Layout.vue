<template>
  <CreateUser v-if="!user.name" />
  <div v-else class="bg-gray-50 min-h-screen">
    <Navbar :user="user" />
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Navbar from '../components/Navbar.vue';
import CreateUser from './User/Create.vue'

export default {
  name: 'Home',
  components: {
    Navbar,
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

<style>
  body {
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
  }
</style>