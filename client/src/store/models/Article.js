import { ethers } from 'ethers';
export default class Article {
  constructor(json) {
    this.id = json[0]
    this.date = json[1]
    this.title = json[2]
    this.imageUrl = json[3]
    this.content = json[4]
    this.author = ethers.utils.parseBytes32String(json[5])
    this.published = json[6]
  }
}