import Web3 from 'web3'
import blog from '../../contracts/Blog.json'
import TruffleContract from "truffle-contract";

export const state = {
    contract: TruffleContract
};
const getters = {
    contract: (state) => state.contract,
};
const actions = {
    async LoadWeb3() {
        var web3 = window.web3;
        var ethereum = window.ethereum
        if (typeof web3 !== 'undefined') {
            this.web3Provider = ethereum;
            web3 = new Web3(ethereum);
         } else {
            // this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            // web3 = new Web3(this.web3Provider);

            window.alert("Please connect to Metamask.")
        }

        // Modern dapp browsers...
        if (ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await web3.eth.requestAccounts()
            } catch (error) {
                // User denied account access...
                window.alert(`Error: ${error}`)
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(window.ethereum)
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    async LoadContracts({commit}) {
      const contract = TruffleContract(blog)
      contract.setProvider(window.ethereum)

      const blogContract = await contract.deployed();
      commit('setContracts', { blogContract })
    }
};
const mutations = {
    setContracts(state, contract) {
        state.contract = contract.blogContract;
    },
};
export default {
    state,
    getters,
    actions,
    mutations,
};
