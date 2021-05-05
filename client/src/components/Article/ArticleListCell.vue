<template>
  <router-link :to="{ name: 'Details', params: { id: article.id }}">
    <figure class="flex justify-between my-10 max-h-48 border-2 border-gray-400 p-4 bg-white">
      <div class="flex-col text-center md:text-left space-y-2 w-full">
        <figcaption class="flex text-xs">
          <span class="mr-2">Writer: </span>
          <div class="text-blue-500">
            {{ article.authorName }}
          </div>
          <span class="mx-2">-</span>
          <div class="text-blue-500">
            Tips Received: {{ article.tips.toNumber() }}
          </div>
        </figcaption>
        <p class="text-2xl font-semibold">
          {{ article.title }}
        </p>
        <p class="text-lg max-h-20 overflow-hidden"><span v-html="article.content"></span></p>
      </div>
      <div class="overflow-hidden w-1/5">
        <img class="flex float-right h-full content-center" :src="'https://ipfs.infura.io/ipfs/' + article.imageHash" alt="" width="384" height="512">
      </div>
    </figure>
  </router-link>
</template>

<script>
import Article from '../../store/models/Article'

export default {
  props: {
    article: Article
  }
};
</script>