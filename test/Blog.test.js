const { assert } = require('chai')

const Blog = artifacts.require('./Blog.sol')

const articlesFromJSON = (json) => {
  const articles = []
  
  if (json) {
    for (let i of json[0]) {
      articles.push({
        id: json[0][i],
        date: json[1][i],
        title: json[2][i],
        imageHash: json[3][i],
        content: json[4][i],
        author: json[5][i],
        published: json[6][i]
      })
    }
  }

  return articles
}

contract('Blog', () => {

  before(async () => {
    this.blog = await Blog.deployed()
  })

  describe('deployment', async () => {

    it('deployed successfully', async () => {
      const address = await this.blog.address
      assert.notEqual(address, 0x0, "[Blog contract address is 0x0]")
      assert.notEqual(address, '', "[Blog contract address is empty]")
      assert.notEqual(address, null, "[Blog contract address is null]")
      assert.notEqual(address, undefined, "[Blog contract address is undefined]")
    })

    it('creates user and one article', async () => {
      const articleCount = await this.blog.articleCount()
      assert.equal(articleCount, 1, "[We don't have one Article on the array]")

      const article = await this.blog.articles(0)
      const user = await this.blog.users(article.author);
      assert.equal(web3.utils.hexToUtf8(user.name), "Tiago Dias", "[User is not correct]")
    })

  })
  describe('Articles ', async () => {
    const imageHash = 'QmQpmL2kW6YfTmGwmN82AqNUAh7rbp6rTj3QDBaAsrWgcm' // Wolf

    it('lists articles', async () => {
      const articleCount = await this.blog.articleCount()
      assert.equal(articleCount, 1, "[We don't have one Article on the array]")
      const article = await this.blog.articles(0)

      assert.equal(article.id.toNumber(), 0, "[Wrong article ID]")
      assert.notEqual(article.date.toNumber(), null, "[Wrong article date]")
      assert.equal(article.title, "My first blog's title.", "[Wrong article Title]")
      assert.equal(article.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(article.content, "My first blog article content!", "[Wrong article Content]")
      assert.equal(article.published, false, "[Wrong article Published Status]")

      const article_user = await this.blog.users(article.author);
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
    })

    it('lists articles with getArticles()', async () => {
      const articlesJSON = await this.blog.getArticles()
      const articles = articlesFromJSON(articlesJSON)
      const article = articles[0]

      assert.equal(article.id.toNumber(), 0, "[Wrong article ID]")
      assert.notEqual(article.date.toNumber(), null, "[Wrong article date]")
      assert.equal(article.title, "My first blog's title.", "[Wrong article Title]")
      assert.equal(article.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(article.content, "My first blog article content!", "[Wrong article Content]")
      assert.equal(article.published, false, "[Wrong article Published Status]")

      const article_user = await this.blog.users(article.author);
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, article.author, "[Wrong article Author]")
    })

    it('creates article', async () => {
      var articlesJSON = await this.blog.getArticles()
      var articles = articlesFromJSON(articlesJSON)
      assert.equal(articles.length, 1, "[We don't have one Article on the array]")

      const article = articles[0]
      const result = await this.blog.createArticle("A secondary title", imageHash , "A secondary article", article.author)
      
      articlesJSON = await this.blog.getArticles()
      assert.equal(articlesJSON[0].length, 2, "[We don't have two Article on the array]")
      
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 1, "[Wrong article ID]")
      assert.notEqual(event.date.toNumber(), null, "[Wrong article date]")
      assert.equal(event.title, "A secondary title", "[Wrong article Title]")
      assert.equal(event.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(event.content, "A secondary article", "[Wrong article Content]")
      assert.equal(event.published, false, "[Wrong article Published Status]")

      const article_user = await this.blog.users(article.author);
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, article.author, "[Wrong article Author]")
    })

    it('toggles article publish', async () => {
      const article = await this.blog.articles(0)
      assert.equal(article.published, false, "[Wrong article Published Status]")

      const result = await this.blog.togglePublished(0)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.equal(event.published, true, "[Wrong article Published Status]")
    })
  })
  
})