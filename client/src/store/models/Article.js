export default class Article {
  constructor(json) {
    this.id = json[0]
    this.date = json[1]
    this.title = json[2]
    this.imageUrl = json[3]
    this.content = json[4]
    this.author = json[5]
    this.published = json[6]
    this.tips = json[7]
  }
}