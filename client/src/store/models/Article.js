export default class Article {
  constructor(json) {
    this.id = json.id
    this.date = json.date
    this.title = json.title
    this.imageHash = json.imageHash
    this.content = json.content
    this.author = json.author
    this.published = json.published
    this.tips = json.tips
  }
}