<template>
  <div class="flex-col items-center justify-center container mx-auto min-h-screen" :style="{'background-image': 'url(' + require('@/assets/images/geometry.png') + ')'}">
    <div>
      <h3 class="text-6xl text-center">Your profile</h3>
      <p class="text-center">You currently have {{ count }} {{count > 1 ? "articles" : "article"}}</p>
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
  name: "Profile",
  components: {
    ArticleList
  },
  computed: {
    user () { return this.$store.getters.user },
    ethBalance () { return this.$store.getters.accountEthBalance },
    contract () { return this.$store.getters.readContract },
    articles () { return this.$store.getters.articles },
    count () { return this.articles ? this.articles.length : 0 },
  },
  mounted() {
    this.load()
  },
  methods: {
    ...mapActions(["LoadContracts","GetAddress", 'GetMyArticles']),
    async load() {
      await this.LoadContracts()
      await this.GetAddress()
      await this.GetMyArticles()
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
