<template>
  <div class="flex flex-col">
      <div class="flex">
        <input
          type="text"
          placeholder="Add your comment..."
          class="form-control h-full  w-full focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-2 mb-2"
          aria-describedby="Comment"
          v-model="message"
        />
        <button class="disabled:opacity-50 h-full rounded-md bg-blue-500 text-white px-2 py-1 ml-4" type="submit" @click.prevent="submit" :disabled="loading">
          Send
        </button>
      </div>
    </div>
</template>

<script>
export default {
  name: "Create Comment",
  props: {
    articleId: Number,
  },
  data() {
    return {
      message: "",
      loading: false,
      showSuccess: false,
      showError: false,
    }
  },
  methods: {
    async submit() {
      this.loading = true

      const txResponse = await this.$store.getters.writeContract.addCommentToArticle(this.articleId, this.message)
      const result = await txResponse.wait()

      if (result.status == 1) {
        this.showSuccess = true
      } else {
        this.showError = true
      }
      
      this.loading = false
    }
  }
}
</script>