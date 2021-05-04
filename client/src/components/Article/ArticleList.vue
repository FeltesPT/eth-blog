<template>
  <div v-for="article in articles" :key="article.id">
    <ArticleListCell :article="article" />
  </div>
</template>

<script>
import { ethers } from 'ethers';
import ArticleListCell from './ArticleListCell'

export default {
  props: {
    articles: ethers.articles
  },
  components: {
    ArticleListCell
  }
};
</script>