<template>
  <div class="hello flex-col items-center justify-center container mx-auto">
    <h1>Your address is:</h1>
    <p>{{ user.wallet_address }}</p>
    <h3>Your balance is:</h3>
    <p>{{ ethBalance }} ETH</p>
    <h3>Articles:</h3>
    <p>We have {{ count }} {{count > 1 ? "articles" : "article"}}</p>
    <div>
      <button type="button" @click="$router.push({ path: 'create' })" class="bg-blue-400 text-white px-6 py-1">
        <span class="text-lg">Create</span>
      </button>
    </div>
    <p class="mt-10">List: </p>
    <div class="flex-col mx-auto">
      <div v-for="article in articles" :key="article.id">
        <router-link :to="{ name: 'Details', params: { id: article.id }}">
          <figure class="flex justify-between py-10">
            <div class="flex-col pt-6 md:p-8 text-center md:text-left space-y-4 p-8">
              <p class="text-lg">
                {{ article.title }}
              </p>
              <p class="text-lg font-semibold max-h-6 overflow-ellipsis overflow-hidden">
                {{ article.content }}
              </p>
              <figcaption class="font-medium">
                <div class="text-blue-500">
                  {{ article.authorName }}
                </div>
                <div class="text-gray-500">
                  {{ article.published ? "Yes" : "No" }}
                </div>
              </figcaption>
            </div>
            <img class="flex float-right" :src="'https://ipfs.infura.io/ipfs/' + article.imageUrl" alt="" width="384" height="512">
          </figure>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
  name: "Article List",
  computed: {
    user () { return this.$store.getters.user },
    ethBalance () { return this.$store.getters.accountEthBalance },
    contract () { return this.$store.getters.contract },
    articles () { return this.$store.getters.articles },
    count () { return this.articles ? this.articles.length : 0 },
  },
  mounted() {
    this.count = 0
    this.load()
  },
  methods: {
    ...mapActions(["LoadContracts","GetAddress", 'GetArticles']),
    async load() {
      await this.LoadContracts()
      await this.GetAddress()
      await this.GetArticles()
    },
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
