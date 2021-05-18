import { ethers } from 'ethers'
import Blog from '../../contracts/Blog.json'

const CONTRACT_ADDRESS = Blog.networks['5777'].address;
const provider = new ethers.providers.Web3Provider(window.ethereum)

export const state = {
    address: String | "0x0",
    user: {},
    loading: false,
    owner: ethers.address
};
const getters = {
    accountAddress: (state) => state.address,
    accountBalance: (state) => state.balance,
    accountEthBalance: (state) => state.etherBalance,
    user: (state) => state.user,
    loading: (state) => state.loading,
    owner: (state) => state.owner,
    isOwner: (state) => state.owner === state.user.wallet_address
};
const actions = {
    async GetAddress({ commit }) {
        if (typeof window.ethereum !== 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            console.log('address: ', address);
            commit('setAddress', address)
        }
    },
    async GetUser({ commit }) {
        if (typeof window.ethereum !== 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            commit('setAddress', address)

            const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider)
            
            try {
                const data = await contract.users(address)
                if (data.wallet_address === address) {
                    commit('setUser', data)
                }
                const owner = await contract.owner()
                commit('setOwner', owner)     
            } catch (err) {
                console.error(err);
            }
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

    setUser(state, data) {
        state.user = { name: ethers.utils.toUtf8String(data.name), wallet_address: data.wallet_address }
    },
    setLoading(state, loading) {
        state.loading = loading
    },
    setOwner(state, owner) {
        state.owner = owner;
    }
};
export default {
    state,
    getters,
    actions,
    mutations,
};
