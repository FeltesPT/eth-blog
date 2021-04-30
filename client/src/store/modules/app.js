import web3 from 'web3'
import { ethers } from 'ethers';
import Article from '../models/Article'
import Blog from '../../contracts/Blog.json'

const CONTRACT_ADDRESS = Blog.networks['5777'].address;
const provider = new ethers.providers.Web3Provider(window.ethereum)
// const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

export const state = {
    contract: ethers.contract,
    articles: ethers.articles,
};
const getters = {
    contract: (state) => state.contract,
    articles: (state) => state.articles,
};
const actions = {
    async LoadContracts({commit}) {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider)
      commit('setContracts', contract)
    },

    async GetArticles({ commit }) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider)
        const articles = await contract.getArticles()

        const art = []

        for (let i of articles[0]) {
          const article = new Article([
            articles[0][i],
            articles[1][i],
            articles[2][i],
            articles[3][i],
            articles[4][i],
            articles[5][i],
            articles[6][i],
            articles[7][i]
          ])

          const author = await contract.users(article.author)
          article.authorName = web3.utils.hexToUtf8(author.name)

          art.push(article)
        }

        commit('setArticles', art)
    }
};
const mutations = {
    setContracts(state, contract) {
        state.contract = contract;
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
