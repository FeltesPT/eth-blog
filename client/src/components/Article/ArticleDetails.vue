<template>
  <div v-if="loading">
    <h1 class="text-3xl text-white text-center">Loading...</h1>
  </div>
  <div v-else class="hello flex-col items-center justify-center container mx-auto mt-10 space-y-10">
    <img class="w-full max-h-96" :src="'https://ipfs.infura.io/ipfs/' + article.imageUrl" alt="Article Banner">
    <figcaption class="font-medium">
      <div class="text-gray-500">
        Author: <span class="text-blue-500">{{ article.authorName }}</span>
      </div>
      <div class="text-gray-500">
        Published: <span class="text-blue-500">{{ format_time(article.date.toNumber()) }}</span>
      </div>
      <div class="text-gray-500">
        Published: {{ article.published ? "Yes" : "No" }}
      </div>
    </figcaption>
    <div v-if="!loading" class="space-y-2">
      <p class="text-2xl font-semibold">
        {{ article.title }}
      </p>
      <p class="text-gray-800">
        {{ article.content }}
      </p>
    </div>
  </div>
</template>

<script>
import web3 from 'web3'
import { mapActions } from "vuex";
import Article from '../../store/models/Article'
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
    contract: function() { return this.$store.getters.readContract },
  },
  mounted() {
    this.article = null
    this.loading = true
    this.load()
  },
  methods: {
    ...mapActions(["LoadContracts","GetAddress"]),
    async load() {
      await this.LoadContracts()
      await this.getArticle()
    },
    async getArticle() {
      this.loading = true

      const json = await this.$store.getters.readContract.articles(this.$route.params.id);
      this.article = new Article([
          json[0],
          json[1],
          json[2],
          json[3],
          json[4],
          json[5],
          json[6],
          json[7]
        ])

      const author = await this.$store.getters.readContract.users(this.article.author)
      this.article.authorName = web3.utils.hexToUtf8(author.name)

      this.loading = false
    },
    format_time(s) {
      const dtFormat = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
        timeZone: 'UTC'
      });
      
      return dtFormat.format(new Date(s * 1e3));
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
