import { ethers } from 'ethers';
import Blog from '../../contracts/Blog.json'

const CONTRACT_ADDRESS = Blog.networks['5777'].address;
const provider = new ethers.providers.Web3Provider(window.ethereum)


export const state = {
    address: String | "0x0",
    balance: ethers.utils.BigNumber | 0,
    etherBalance: String | "0",
    user: {}
};
const getters = {
    accountAddress: (state) => state.address,
    accountBalance: (state) => state.balance,
    accountEthBalance: (state) => state.etherBalance,
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
    async GetUser() {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider)
        try {
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            const data = await contract.users(address)
            console.log("Data: ", data)
        } catch (err) {
            console.error(err);
        }
        
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
    }
};
export default {
    state,
    getters,
    actions,
    mutations,
};
