<template>
  <div v-for="article in articles" :key="article.id">
    <ArticleListCell :article="article" />
  </div>
</template>

<script>
import Article from '../../store/models/Article'
import ArticleListCell from './ArticleListCell'

export default {
  props: {
    articles: [Article]
  },
  components: {
    ArticleListCell
  }
};
</script>