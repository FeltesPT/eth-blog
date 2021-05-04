<template>
  <div class="hello flex-col items-center justify-center container mx-auto">
    <div>
      <h3 class="text-6xl text-center">Articles</h3>
      <p class="text-center">We currently have {{ count }} {{count > 1 ? "articles" : "article"}}</p>
    </div>
    <div class="flex-col mx-auto">
      <ArticleList :articles="articles"/>
    </div>
  </div>
</template>

<script>
import ArticleList from '../../components/Article/ArticleList.vue'
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
