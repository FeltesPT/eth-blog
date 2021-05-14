import { ethers } from 'ethers';
import Article from '../models/Article'
import Blog from '../../contracts/Blog.json'

const CONTRACT_ADDRESS = Blog.networks['5777'].address;
const provider = new ethers.providers.Web3Provider(window.ethereum)
// const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

export const state = {
    writeContract: ethers.contract,
    contract: ethers.contract,
    articles: []
};
const getters = {
    readContract: (state) => state.contract,
    writeContract: (state) => state.writeContract,
    articles: (state) => state.articles
};
const actions = {
    async LoadContracts({commit}) {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider)
      commit('setContract', contract)

      const writeContract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider.getSigner())
      commit('setWriteContract', writeContract)
    },

    async GetArticles({ commit }) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider)
        const articles = await contract.getArticles()

        const art = []

        for(var i = 0; i < articles.length; i++) {
            const article = new Article(articles[i])
    
            const author = await contract.users(article.author)
            article.authorName = ethers.utils.toUtf8String(author.name)

            const comments = await contract.getArticleComments(article.id)
            article.comments = comments
            
            art.push(article)
        }

        commit('setArticles', art)
    },

    async GetMyArticles({ commit }) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider.getSigner())
        const articles = await contract.getUserArticles()

        const art = []

        for(var i = 0; i < articles.length; i++) {
            const article = new Article(articles[i])
    
            const author = await contract.users(article.author)
            article.authorName = ethers.utils.toUtf8String(author.name)

            const comments = await contract.getArticleComments(article.id)
            article.comments = comments

            art.push(article)
        }

        commit('setArticles', art)
    },
};
const mutations = {
    setContract(state, contract) {
        state.contract = contract;
    },
    setWriteContract(state, contract) {
        state.writeContract = contract;
    },
    setArticles(state, articles) {
        state.articles = articles;
    },
};
export default {
    state,
    getters,
    actions,
    mutations,
};
