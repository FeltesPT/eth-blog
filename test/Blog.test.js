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
        imageUrl: json[3][i],
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

  it('deployed successfully', async () => {
    const address = await this.blog.address
    assert.notEqual(address, 0x0, "[Blog contract address is 0x0]")
    assert.notEqual(address, '', "[Blog contract address is empty]")
    assert.notEqual(address, null, "[Blog contract address is null]")
    assert.notEqual(address, undefined, "[Blog contract address is undefined]")
  })

  it('lists articles', async () => {
    const articleCount = await this.blog.articleCount()
    const article = await this.blog.articles(0)

    assert.equal(article.id.toNumber(), 0, "[Wrong article ID]")
    assert.notEqual(article.date.toNumber(), null, "[Wrong article date]")
    assert.equal(article.title, "My first blog's title.", "[Wrong article Title]")
    assert.equal(article.imageUrl, "https://www.epiccode.dev/img/iconBlackLogo.cd7fd92e.png", "[Wrong article Image URL]")
    assert.equal(article.content, "My first blog article content!", "[Wrong article Content]")
    assert.equal(web3.utils.hexToUtf8(article.author), "Tiago Dias", "[Wrong article Author]")
    assert.equal(article.published, false, "[Wrong article Published Status]")
  })

  it('lists articles with getArticles()', async () => {
    const articlesJSON = await this.blog.getArticles()
    const articles = articlesFromJSON(articlesJSON)
    const article = articles[0]

    assert.equal(article.id.toNumber(), 0, "[Wrong article ID]")
    assert.notEqual(article.date.toNumber(), null, "[Wrong article date]")
    assert.equal(article.title, "My first blog's title.", "[Wrong article Title]")
    assert.equal(article.imageUrl, "https://www.epiccode.dev/img/iconBlackLogo.cd7fd92e.png", "[Wrong article Image URL]")
    assert.equal(article.content, "My first blog article content!", "[Wrong article Content]")
    assert.equal(web3.utils.hexToUtf8(article.author), "Tiago Dias", "[Wrong article Author]")
    assert.equal(article.published, false, "[Wrong article Published Status]")
  })

  it('creates article', async () => {
    var articlesJSON = await this.blog.getArticles()
    var articles = articlesFromJSON(articlesJSON)
    assert.equal(articles.length, 1, "[We don't have one Article on the array]")

    const imageUrl = "https://pbs.twimg.com/profile_images/3009631723/ecb2d2bf2a3213878f37f9d523a580af.jpeg"
    
    const result = await this.blog.createArticle("A secondary title", imageUrl ,"A secondary article", web3.utils.utf8ToHex("Another Author"))
    
    articlesJSON = await this.blog.getArticles()
    assert.equal(articlesJSON[0].length, 2, "[We don't have two Article on the array]")
    
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1, "[Wrong article ID]")
    assert.notEqual(event.date.toNumber(), null, "[Wrong article date]")
    assert.equal(event.title, "A secondary title", "[Wrong article Title]")
    assert.equal(event.imageUrl, imageUrl, "[Wrong article Image URL]")
    assert.equal(event.content, "A secondary article", "[Wrong article Content]")
    assert.equal(web3.utils.hexToUtf8(event.author), "Another Author", "[Wrong article Author]")
    assert.equal(event.published, false, "[Wrong article Published Status]")
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