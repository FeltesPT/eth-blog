export default class Comment {
  constructor(json) {
    this.id = json.id
    this.articleId = json.articleId
    this.message = json.message
    this.author = json.author
    this.tips = json.tips
    this.date = json.date
  }
}