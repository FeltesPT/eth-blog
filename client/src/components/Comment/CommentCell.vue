<template>
  <figure class="flex justify-between my-2 max-h-48 border-2 border-gray-400 p-4 bg-white">
    <div class="flex-col text-center md:text-left space-y-2 w-full">
      <figcaption class="flex-col text-xs">
        <div class="text-blue-500">
          Writer: {{ comment.authorName }}
        </div>
        <div class="text-blue-500">
          Tips: {{ this.tips }} Eth
        </div>
      </figcaption>
      <p class="text-lg max-h-20 overflow-hidden"><span v-html="comment.message"></span></p>
    </div>
  </figure>
</template>

<script>
import { ethers } from 'ethers';
import Comment from '../../store/models/Comment'

export default {
  props: {
    comment: Comment
  },
  computed: {
    tips () { return ethers.utils.formatEther(this.comment.tips.toString()) },
  },
};
</script>