<template>
  <div v-if="loading">
    <h1 class="text-3xl text-white text-center">Loading...</h1>
  </div>
  <div v-else class="flex-col items-center justify-center container mx-auto">
    <h1>Edit Article:</h1>
    <div>
      <button type="button" @click="$router.go(-1)" class="bg-blue-400 text-white px-6 py-1">
        <span class="text-lg">Back</span>
      </button>
    </div>
    <div class="flex flex-col">
      <label class="py-2 text-left" for="imageUrl">Banner - {{article.imageHash}}</label>
      <input
        type='file'
        accept=".jpg, .jpeg, .png, .bmp, .gif"
        class="form-control focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-2 mb-2"
        aria-describedby="Image Url"
        @change="imageInputChanged"
      />
    </div>
    <div class="flex flex-col">
      <label class="py-2 text-left" for="title">Title</label>
      <input
        type="text"
        class="form-control focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-2 mb-2"
        aria-describedby="Title"
        v-model="article.title"
      />
    </div>
    <div class="flex flex-col">
      <label class="py-2 text-left" for="content">Content</label>
      <editor
      :api-key="tinymceKey"
      :init="{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help'
      }"
      v-model="article.content"
    />
    </div>
    <div class="flex mt-8">
      <button class="disabled:opacity-50 w-1/2 flex py-4 items-center justify-center rounded-md bg-blue-500 text-white" type="submit" @click.prevent="submit" :disabled="loading">
        Submit
      </button>
      <button class="disabled:opacity-50 w-1/2 flex py-4 ml-2 items-center justify-center rounded-md bg-red-500 text-white" type="submit" @click.prevent="$router.go(-1)" :disabled="loading">
        Cancel
      </button>
    </div>
    <div v-if="showError"
      class="flex justify-between items-center bg-red-200 relative text-red-600 py-3 px-3 rounded-lg">
      <div>
          <span class="font-semibold text-red-700">Error!</span>
          Failed to save article! Please try again or contact a system admin.
      </div>
      <div>
        <button type="button" @click="showError = false" class=" text-red-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
    </div>
    <div v-if="showSuccess"
      class="flex justify-between items-center bg-green-200 relative text-green-600 py-3 px-3 rounded-lg">
      <div>
          <span class="font-semibold text-green-700">Success!</span>
          Article saved successfully!
      </div>
      <div>
        <button type="button" @click="showSuccess = false" class=" text-green-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ipfsClient from 'ipfs-http-client'
import Editor from '@tinymce/tinymce-vue'
import Article from '../../store/models/Article'

export default {
  name: "Create Article",
  components: {
    Editor
  },
  data() {
    return {
      imageChanged: false,
      buffer: {},
      imageHash: "",
      articles: Article,
      loading: true,
      showSuccess: false,
      showError: false
    }
  },
  computed: {
    address () { return this.$store.getters.accountAddress },
    contract () { return this.$store.getters.readContract },
    ipfs () { return ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) }, // leaving out the arguments will default to these values
    tinymceKey() { return process.env.VUE_APP_TINYMCE_API_KEY }
  },
  mounted() {
    console.log(this.tinymceKey);
    this.load()
  },
  methods: {
    ...mapActions(["LoadContracts", "GetAddress"]),
    async load() {
      await this.GetAddress()
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

      if (this.article.author !== this.address) {
        this.$router.go(-1)
      } else {
        this.loading = false
      }
    },
    imageInputChanged(event) {
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)

      reader.onloadend = () => {
        this.imageChanged = true
        this.buffer = Buffer(reader.result)
      }      
    },
    async uploadFile() {
      if (!this.imageChanged) {
        this.saveArticle()
        return
      }

      this.ipfs.add(this.buffer)
      .then((hash) => {
        if (!hash) {
          console.error("No hash!")
          return
        }

        this.article.imageHash = hash.path
        this.saveArticle()
      })
    },
    async submit() {
      this.loading = true
      await this.uploadFile()
    },
    async saveArticle() {
      if (this.article.imageHash.length === 0) {
        console.log("Error Saving article due to imageHash...");
        this.showError = true
        this.loading = false
        return
      }

      console.log("Saving article...");

      const txResponse = await this.$store.getters.writeContract.editArticle(this.article.id, this.article.title, this.article.imageHash, this.article.content)
      const result = await txResponse.wait()

      if (result.status == 1) {
        this.showSuccess = true
      } else {
        this.showError = true
      }
      
      this.loading = false
    }
  }
}
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
