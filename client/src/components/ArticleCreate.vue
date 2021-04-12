<template>
  <div class="flex-col items-center justify-center container mx-auto">
    <h1>New Article:</h1>
    <div class="flex flex-col">
      <label class="py-2 text-left" for="title">Title</label>
      <input
        type="text"
        class="form-control focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-2 mb-2"
        aria-describedby="Title"
        v-model="title"
      />
    </div>
    <div class="flex flex-col">
      <label class="py-2 text-left" for="imageUrl">Image Url</label>
      <input
        type="text"
        class="form-control focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-2 mb-2"
        aria-describedby="Image Url"
        v-model="imageUrl"
      />
    </div>
    <div class="flex flex-col">
      <label class="py-2 text-left" for="content">Content</label>
      <textarea
        type="text"
        class="form-control focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-2"
        rows="5" max-rows="20"
        aria-describedby="Content"
        v-model="content"
      >
      </textarea>
    </div>
    <div class="flex flex-col">
      <label class="py-2 text-left" for="author">Author</label>
      <input
        type="text"
        class="form-control focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-2 mb-2"
        aria-describedby="Author"
        v-model="author"
      />
    </div>
    <div class="flex flex-col">
      <button class="disabled:opacity-50 w-1/2 flex py-4 ml-2 items-center justify-center rounded-md bg-blue-500 text-white" type="submit" @click.prevent="submit" :disabled="isLoading">
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Article List",
  data() {
    return {
      title: "",
      imageUrl: "",
      content: "",
      author: "",
      loading: true
    }
  },
  computed: {
    address: function() { return this.$store.getters.accountAddress },
    contract: function() { return this.$store.getters.contract },
  },
  mounted() {
    this.loading = true
    this.load()
  },
  methods: {
    ...mapActions(["LoadWeb3", "LoadContracts", "GetAddress"]),
    async load() {
      await this.LoadWeb3()
      await this.GetAddress()
      await this.LoadContracts()

      this.loading = false
    },
    async submit() {
      this.loading = true
      console.log("Save")
      const article = await this.$store.getters.contract.createArticle(this.title, this.imageUrl ,this.content, window.web3.utils.utf8ToHex(this.author), {from: this.address})

      console.log(article)
      
      this.loading = false
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
