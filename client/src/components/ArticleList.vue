<template>
  <div class="hello flex-col items-center justify-center container mx-auto">
    <h1>Your address is:</h1>
    <p>{{ address }}</p>
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
                  {{ article.author }}
                </div>
                <div class="text-gray-500">
                  {{ article.published ? "Yes" : "No" }}
                </div>
              </figcaption>
            </div>
            <img class="flex float-right" :src="article.imageUrl" alt="" width="384" height="512">
          </figure>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import Article from '../store/models/Article'
export default {
  name: "Article List",
  data() {
    return {
      count: 0,
      articles: [Article]
    }
  },
  computed: {
    address: function() { return this.$store.getters.accountAddress },
    ethBalance: function() { return this.$store.getters.accountEthBalance },
    contract: function() { return this.$store.getters.contract },
  },
  mounted() {
    this.count = 0
    this.articles = []
    this.load()
  },
  methods: {
    ...mapActions(["LoadContracts","GetAddress"]),
    async load() {
      await this.GetAddress()
      await this.getCount()
      await this.getArticles()
    },
    async getCount() {
      this.count = await this.$store.getters.contract.articleCount()
    },
    async getArticles() {
      const json = await this.$store.getters.contract.getArticles()
      
      this.articles = []
      for (let i of json[0]) {
        const article = new Article([
          json[0][i],
          json[1][i],
          json[2][i],
          json[3][i],
          json[4][i],
          json[5][i],
          json[6][i]
        ])

        this.articles.push(article)
      }
      
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
