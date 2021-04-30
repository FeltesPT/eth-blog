import { ethers } from 'ethers'
import web3 from 'web3'
import Blog from '../../contracts/Blog.json'

const CONTRACT_ADDRESS = Blog.networks['5777'].address;
const provider = new ethers.providers.Web3Provider(window.ethereum)

export const state = {
    address: String | "0x0",
    balance: ethers.utils.BigNumber | 0,
    etherBalance: String | "0",
    user: {},
    loading: false
};
const getters = {
    accountAddress: (state) => state.address,
    accountBalance: (state) => state.balance,
    accountEthBalance: (state) => state.etherBalance,
    user: (state) => state.user,
    loading: (state) => state.loading
};
const actions = {
    async GetAddress({ commit }) {
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        commit('setAddress', address)

        const balance = await provider.getBalance(address)
        commit('setBalance', balance)
        commit('setEtherBalance', balance)
    },
    async GetUser({ commit }) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider)
        try {
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            const data = await contract.users(address)
            if (data.name) {
                commit('setUser', data)
            }
        } catch (err) {
            console.error(err);
        }
    },
    async CreateUser({commit}, name) {
        commit('setLoading', true)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider.getSigner())
        const bytename = ethers.utils.formatBytes32String(name)
        const transaction = await contract.createUser(bytename)
        await transaction.wait()
        commit('setLoading', false)
    }
};
const mutations = {
    setAddress(state, address) {
        state.address = address;
    },

    setBalance(state, balance) {
        state.balance = balance;
    },

    setEtherBalance(state, balance) {
        state.etherBalance = ethers.utils.formatEther(balance);
    },

    setUser(state, data) {
        state.user = { name: web3.utils.hexToUtf8(data.name), wallet_address: data.wallet_address, tips_received: data.tips_received.toNumber(), tips_sent: data.tips_sent.toNumber() }
    },
    setLoading(state, loading) {
        state.loading = loading
    }
};
export default {
    state,
    getters,
    actions,
    mutations,
};
