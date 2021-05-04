const { assert } = require('chai')

const Blog = artifacts.require('./Blog.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

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
        published: json[6][i],
        tips: json[7][i]
      })
    }
  }

  return articles
}

contract('Blog', ([deployer, author1, author2]) => {

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
      assert.equal(user.wallet_address, deployer, "[User is not correct]")
    })

  })

  describe('Users', async () => {
    it('create user', async () => {
      const result = await this.blog.createUser(web3.utils.stringToHex("Author 1"), { from: author1 })
      const event = result.logs[0].args

      assert.equal(web3.utils.hexToUtf8(event.name), "Author 1", ['Wrong name on user create'])
      assert.equal(event.wallet_address, author1, ['Wrong Address on user create'])
      assert.equal(event.tips_received, 0, ['Wrong Address on user create'])
      assert.equal(event.tips_sent, 0, ['Wrong Address on user create'])
    })

    it('Gets user', async () => {
      const user = await this.blog.users(deployer)
      assert.equal(web3.utils.hexToUtf8(user.name), "Tiago Dias", ['Wrong name on user create'])
    })
  })

  describe('Articles', async () => {
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
      assert.equal(article.tips, 0, "[Wrong Tips amoung]")

      const article_user = await this.blog.users(article.author);
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, deployer, "[User is not correct]")
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
      assert.equal(article.tips, 0, "[Wrong Tips amoung]")

      const article_user = await this.blog.users(article.author);
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, article.author, "[Wrong article Author]")
      assert.equal(article_user.wallet_address, deployer, "[Wrong article Author]")
    })

    it('creates article', async () => {
      var articlesJSON = await this.blog.getArticles()
      var articles = articlesFromJSON(articlesJSON)
      assert.equal(articles.length, 1, "[We don't have one Article on the array]")

      const article = articles[0]
      const result = await this.blog.createArticle("A secondary title", imageHash , "A secondary article", { from: deployer })
      
      articlesJSON = await this.blog.getArticles()
      assert.equal(articlesJSON[0].length, 2, "[We don't have two Article on the array]")
      
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 1, "[Wrong article ID]")
      assert.notEqual(event.date.toNumber(), null, "[Wrong article date]")
      assert.equal(event.title, "A secondary title", "[Wrong article Title]")
      assert.equal(event.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(event.content, "A secondary article", "[Wrong article Content]")
      assert.equal(event.published, false, "[Wrong article Published Status]")
      assert.equal(event.tips, 0, "[Wrong Tips amoung]")

      const article_user = await this.blog.users(article.author)
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, article.author, "[Wrong article Author]")
      assert.equal(article_user.wallet_address, deployer, "[User is not correct]")
    })
    
    it('toggles article publish fails', async () => {
      const article = await this.blog.articles(0)
      assert.equal(article.published, false, "[Wrong article Published Status]")

      await this.blog.togglePublished(0, { from: author1 }).should.be.rejected
    })

    it('toggles article publish', async () => {
      const article = await this.blog.articles(0)
      assert.equal(article.published, false, "[Wrong article Published Status]")

      const result = await this.blog.togglePublished(0, { from: deployer })
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.equal(event.published, true, "[Wrong article Published Status]")
    })

    it('tip article', async () => {
      const tipAmount = web3.utils.toWei('0.1', 'Ether')
      
      let article = await this.blog.articles(0)
      assert.equal(article.tips, 0, "[Article shouldnt have any tips]")

      await this.blog.tipArticle(article.id, { from: author1 , value: tipAmount })

      article = await this.blog.articles(0)
      assert.equal(article.tips, tipAmount, "[Should have 0.1 ether]")

      const _deployer = await this.blog.users(deployer)
      assert.equal(web3.utils.BN(_deployer.tips_received), tipAmount, "[Should have 0.1 ether]")

      const _author1 = await this.blog.users(author1)
      assert.equal(web3.utils.BN(_author1.tips_sent), tipAmount, "[Should have 0.1 ether]")
    })

    it('author tip self article', async () => {
      const tipAmount = web3.utils.toWei('0.1', 'Ether')
      let article = await this.blog.articles(0)

      await this.blog.tipArticle(article.id, { from: deployer , value: tipAmount }).should.be.rejected
    })

    // Can't create article if user has no name,i.e. is not created
    it('Cant create article if user has no name', async () => {
      await this.blog.createArticle("Title", imageHash, "Amazing Content", { from: author2 }).should.be.rejected
    })

    it('Create article after user is created', async () => {
      await this.blog.createUser(web3.utils.stringToHex("Author 2"), { from: author2 })
      const result = await this.blog.createArticle("Title", imageHash, "Amazing Content", { from: author2 })
      const event = result.logs[0].args
      
      assert.equal(event.id.toNumber(), 2, "[Wrong article ID]")
      assert.notEqual(event.date.toNumber(), null, "[Wrong article date]")
      assert.equal(event.title, "Title", "[Wrong article Title]")
      assert.equal(event.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(event.content, "Amazing Content", "[Wrong article Content]")
      assert.equal(event.published, false, "[Wrong article Published Status]")
      assert.equal(event.tips, 0, "[Wrong Tips amoung]")
    })
  })
})