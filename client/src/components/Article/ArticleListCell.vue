<template>
  <router-link :to="{ name: 'Details', params: { id: article.id }}">
    <figure class="flex justify-between my-10 max-h-48 border-2 border-gray-400 p-4 bg-white">
      <div class="flex-col text-center md:text-left space-y-2 w-full">
        <figcaption class="flex-col text-xs">
          <div class="text-blue-500">
            Writer: {{ article.authorName }}
          </div>
          <div class="text-blue-500">
            Tips: {{ this.tips }} Eth
          </div>
          <div class="text-blue-500">
            Comments: {{ article.comments.length }}
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
import { ethers } from 'ethers';
import Article from '../../store/models/Article'

export default {
  props: {
    article: Article
  },
  computed: {
    tips () { return ethers.utils.formatEther(this.article.tips.toString()) },
  },
};
</script>