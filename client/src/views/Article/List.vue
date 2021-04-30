<template>
  <div class="hello flex-col items-center justify-center container mx-auto">
    <h1>Welcome: {{ user.name }}</h1>
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
      <ArticleList :articles="articles"/>
    </div>
  </div>
</template>

<script>
import ArticleList from '../../components/ArticleList.vue'
import { mapActions } from "vuex"

export default {
  name: "Article List",
  components: {
    ArticleList
  },
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
