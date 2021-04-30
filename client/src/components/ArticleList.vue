<template>
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
            <div class="text-blue-500">
              Tips Received: {{ article.tips.toNumber() }}
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
</template>

<script>
import Article from '../store/models/Article'

export default {
  props: {
    articles: [Article]
  }
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
