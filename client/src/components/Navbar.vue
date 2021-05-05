<template>
  <div class="bg-gray-600 py-2 text-white flex justify-center">
    <div class="flex container justify-between">
      <button type="button" @click="$router.push({ path: '/' })">
        <p class="my-2 text-3xl">Epic Code - Blog</p>
      </button>
      <div class="flex h-full">
        <router-link class="mr-4 my-auto" :to="{ name: 'Profile'}">
          <p>{{ user.name.length > 0 ? user.name : user.wallet_address }}</p>
        </router-link>
        <div class="my-auto">
          <button type="button" @click="$router.push({ path: 'create' })" class="bg-blue-400 text-white px-6 py-1">
            <span class="text-lg">Write</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {}
  }
};
</script>