<template>
  <div v-if="loading">
    <h1 class="text-3xl text-white text-center">Loading...</h1>
  </div>
  <div v-else class="flex-col items-center justify-center container mx-auto mt-10 space-y-10">
    <!-- Buttons -->
    <div class="flex justify-between">
      <button type="button" @click="$router.go(-1)" class="bg-blue-400 text-white px-6 py-1">
        <span class="text-lg">Back</span>
      </button>
      <div v-if="address === article.author" class="space-x-3">
        <button type="button" @click.prevent="togglePublish" class="bg-red-400 text-white px-6 py-1">
          <span class="text-lg"> {{article.published ? "Unpublish" : "Publish" }}</span>
        </button>
        <button type="button" @click.prevent="$router.push({ path: `/${article.id}/edit` })" class="bg-blue-400 text-white px-6 py-1">
          <span class="text-lg">Edit</span>
        </button>
      </div>
    </div>
    <!-- Article Banner and Details -->
    <img class="w-full max-h-96" :src="'https://ipfs.infura.io/ipfs/' + article.imageHash" alt="Article Banner">
    <figcaption class="font-medium">
      <div class="text-gray-500">
        Author: <span class="text-blue-500">{{ article.authorName }}</span>
      </div>
      <div class="text-gray-500">
        Last Updated: <span class="text-blue-500">{{ format_time(article.date.toNumber()) }}</span>
      </div>
      <div class="text-gray-500">
        Published: {{ article.published ? "Yes" : "No" }}
      </div>
      <div class="text-gray-500">
        Article Tips: {{ tips }}
      </div>
    </figcaption>
    <!-- Article Title and Body -->
    <div v-if="!loading" class="space-y-2">
      <p class="text-2xl font-semibold">
        {{ article.title }}
      </p>
      <p><span v-html="article.content"></span></p>
    </div>
    <!-- Article Footer and Tip -->
    <div v-if="!isOwner">
      <button type="button" @click="tipArticle" class="bg-blue-400 text-white px-6 py-1">
        <span class="text-lg">Tip Article</span>
      </button>
    </div>
    <!-- Comment section -->
    <div class="flex-col">
      <h2 class="text-left text-2xl" for="title">Comments:</h2>
      <div v-for="comment in article.comments" :key="comment.id">
        <CommentCell :comment="comment" />
      </div>
      <CreateComment :articleId="article.id"/>
    </div>
  </div>
</template>

<script>
import web3 from 'web3'
import { ethers } from 'ethers';
import { mapActions } from "vuex";
import Article from '../../store/models/Article'
import Comment from '../../store/models/Comment'
import CreateComment from '../../components/Comment/CreateComment'
import CommentCell from '../../components/Comment/CommentCell'

export default {
  name: "Article List",
  components: {
    CreateComment,
    CommentCell
  },
  data() {
    return {
      article: Article,
      loading: true
    }
  },
  computed: {
    address () { return this.$store.getters.accountAddress },
    isOwner () { return this.address === this.article.author },
    tips () { return this.article !== undefined ? ethers.utils.formatEther(this.article.tips.toString()) : 0 },
  },
  mounted() {
    this.article = null
    this.loading = true
    this.load()
  },
  methods: {
    ...mapActions(["LoadContracts"]),
    async load() {
      await this.LoadContracts()
      await this.getArticle()
    },
    async getArticle() {
      this.loading = true

      const json = await this.$store.getters.readContract.getArticle(this.$route.params.id);
      this.article = new Article(json)
      const comments = await this.$store.getters.readContract.getArticleComments(this.article.id)
      this.article.comments = []

      for(var i = 0; i < comments.length; i++) {
        const comment = new Comment(comments[i])
        const author = await this.$store.getters.readContract.users(comment.author)
        comment.authorName = ethers.utils.toUtf8String(author.name)

        this.article.comments.push(comment)
      }

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
    },
    async togglePublish() {
      if (this.address !== this.article.author) {
        console.log("Wrong author")
        return
      }
      
      const txResponse = await this.$store.getters.writeContract.togglePublished(this.article.id)
      const result = await txResponse.wait()

      if (result.status == 1) {
        this.getArticle()
      } else {
        // Show Error
      }
    },
    async tipArticle() {
      let tipAmount = ethers.utils.parseEther("0.1")

      const txResponse = await this.$store.getters.writeContract.tipArticle(this.article.id, { value: tipAmount })
      const result = await txResponse.wait()

      if (result.status == 1) {
        this.getArticle()
      } else {
        // Show Error
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
