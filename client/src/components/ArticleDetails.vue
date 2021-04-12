<template>
  <div class="hello flex-col items-center justify-center container mx-auto">
    <h1>Article:</h1>
    <div v-if="!loading">
      <p class="text-lg">
        {{ article.title }}
      </p>
      <p class="text-lg font-semibold">
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Article from '../store/models/Article'
export default {
  name: "Article List",
  data() {
    return {
      articles: Article,
      loading: true
    }
  },
  computed: {
    address: function() { return this.$store.getters.accountAddress },
    contract: function() { return this.$store.getters.contract },
  },
  mounted() {
    this.article = null
    this.loading = true
    this.load()
  },
  methods: {
    ...mapActions(["LoadWeb3", "LoadContracts","GetAddress"]),
    async load() {
      await this.LoadWeb3()
      await this.LoadContracts()
      await this.getArticle()
    },
    async getArticle() {
      this.loading = true

      const json = await this.$store.getters.contract.articles(this.$route.params.id);
      this.article = new Article([
          json[0],
          json[1],
          json[2],
          json[3],
          json[4],
          json[5],
          json[6]
        ])

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
