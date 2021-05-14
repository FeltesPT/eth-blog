const { assert } = require('chai')

const Blog = artifacts.require('./Blog.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Blog', ([deployer, user1, user2, user3]) => {

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

    it('creates user', async () => {
      const user = await this.blog.users(deployer)
      assert.equal(web3.utils.hexToUtf8(user.name), "Tiago Dias", "[User is not correct]")
      assert.equal(user.wallet_address, deployer, "[User is not correct]")
    })

  })

 describe('Users', async () => {

    it('Gets user', async () => {
      const user = await this.blog.users(deployer)
      assert.equal(web3.utils.hexToUtf8(user.name), "Tiago Dias", ['Wrong name on user create'])
    })

    it('create user', async () => {
      const result = await this.blog.createUser(web3.utils.stringToHex("User 1"), { from: user1 })
      const event = result.logs[0].args

      assert.equal(web3.utils.hexToUtf8(event.name), "User 1", ['Wrong name on user create'])
      assert.equal(event.wallet_address, user1, ['Wrong Address on user create'])
      assert.equal(event.tips_received, 0, ['Wrong Address on user create'])
      assert.equal(event.tips_sent, 0, ['Wrong Address on user create'])
    })
  })

  describe('Articles', async () => {
    const imageHash = 'QmQpmL2kW6YfTmGwmN82AqNUAh7rbp6rTj3QDBaAsrWgcm' // Wolf
    const secondImageHash = 'QmfG4fbLdwbhaS3beJuAhJduhCuvrFd8cqui6EDzVkdGYd' // Unicorn

    it('Creates first article', async () => {
      const result = await this.blog.createArticle("My first blog's title.", imageHash , "My first blog article content!", { from: deployer })      
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.notEqual(event.date.toNumber(), null, "[Wrong article date]")
      assert.equal(event.title, "My first blog's title.", "[Wrong article Title]")
      assert.equal(event.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(event.content, "My first blog article content!", "[Wrong article Content]")
      assert.equal(event.published, false, "[Wrong article Published Status]")
      assert.equal(event.tips, 0, "[Wrong Tips amoung]")

      const article_user = await this.blog.users(event.author)
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, event.author, "[Wrong article Author]")
      assert.equal(article_user.wallet_address, deployer, "[User is not correct]")
    })

    it('Cant get unpublished article if not author', async () => {
      await this.blog.getArticle(0, { from: user1 }).should.be.rejected
    })

    it('Can get unpublished article if is author', async () => {
      const article = await this.blog.getArticle(0, { from: deployer })
      assert.equal(article.id, "0", "[Wrong article ID]")
      assert.notEqual(article.date, null, "[Wrong article date]")
      assert.equal(article.title, "My first blog's title.", "[Wrong article Title]")
      assert.equal(article.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(article.content, "My first blog article content!", "[Wrong article Content]")
      assert.equal(article.published, false, "[Wrong article Published Status]")
      assert.equal(article.tips, 0, "[Wrong Tips amoung]")
    })

    it('Get one article', async () => {
      const articleCount = await this.blog.articleCount()
      assert.equal(articleCount, 1, "[We don't have one Article on the array]")
      
      const article = await this.blog.getArticle(0)
      assert.equal(article.id, "0", "[Wrong article ID]")
      assert.notEqual(article.date, null, "[Wrong article date]")
      assert.equal(article.title, "My first blog's title.", "[Wrong article Title]")
      assert.equal(article.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(article.content, "My first blog article content!", "[Wrong article Content]")
      assert.equal(article.published, false, "[Wrong article Published Status]")
      assert.equal(article.tips, 0, "[Wrong Tips amoung]")

      const article_user = await this.blog.users(article.author);      
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, deployer, "[User is not correct]")
    })

    it('No published articles, so getArticles() returns 0', async () => {
      const articles = await this.blog.getArticles()
      assert.equal(articles.length, 0, "[Articles array should be 0]");
    })

    it('get user articles even if unpublished', async () => {
      const articles = await this.blog.getUserArticles()
      assert.equal(articles.length, 1, "[We don't have one Article on the array]")

      const article = articles[0]
      assert.equal(article.id, "0", "[Wrong article ID]")
      assert.notEqual(article.date, null, "[Wrong article date]")
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

    it('toggles article publish fails', async () => {
      const article = await this.blog.getArticle(0)
      assert.equal(article.published, false, "[Wrong article Published Status]")

      await this.blog.togglePublished(0, { from: user1 }).should.be.rejected
    })

    it('toggles article publish', async () => {
      const article = await this.blog.getArticle(0)
      assert.equal(article.published, false, "[Wrong article Published Status]")

      const result = await this.blog.togglePublished(0, { from: deployer })
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.equal(event.published, true, "[Wrong article Published Status]")
    })

    it('lists articles with getArticles()', async () => {
      const articles = await this.blog.getArticles()

      const article = articles[0]
      assert.equal(article.id, "0", "[Wrong article ID]")
      assert.notEqual(article.date, null, "[Wrong article date]")
      assert.equal(article.title, "My first blog's title.", "[Wrong article Title]")
      assert.equal(article.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(article.content, "My first blog article content!", "[Wrong article Content]")
      assert.equal(article.published, true, "[Wrong article Published Status]")
      assert.equal(article.tips, 0, "[Wrong Tips amoung]")

      const article_user = await this.blog.users(article.author);
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, article.author, "[Wrong article Author]")
      assert.equal(article_user.wallet_address, deployer, "[Wrong article Author]")
    })

    it('Creates another article', async () => {
      const result = await this.blog.createArticle("A secondary title", imageHash , "A secondary article", { from: deployer })      
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 1, "[Wrong article ID]")
      assert.notEqual(event.date.toNumber(), null, "[Wrong article date]")
      assert.equal(event.title, "A secondary title", "[Wrong article Title]")
      assert.equal(event.imageHash, imageHash, "[Wrong article Image Hash]")
      assert.equal(event.content, "A secondary article", "[Wrong article Content]")
      assert.equal(event.published, false, "[Wrong article Published Status]")
      assert.equal(event.tips, 0, "[Wrong Tips amoung]")

      const article_user = await this.blog.users(event.author)
      assert.equal(web3.utils.hexToUtf8(article_user.name), "Tiago Dias", "[Wrong article Author]")
      assert.equal(article_user.wallet_address, event.author, "[Wrong article Author]")
      assert.equal(article_user.wallet_address, deployer, "[User is not correct]")
    })

    it('tip article', async () => {
      const tipAmount = web3.utils.toWei('0.1', 'Ether')
      
      let article = await this.blog.getArticle(0)
      assert.equal(article.tips, 0, "[Article shouldnt have any tips]")

      await this.blog.tipArticle(article.id, { from: user1 , value: tipAmount })

      article = await this.blog.getArticle(0)
      assert.equal(article.tips, tipAmount, "[Should have 0.1 ether]")

      const _deployer = await this.blog.users(deployer)
      assert.equal(web3.utils.BN(_deployer.tips_received), tipAmount, "[Should have 0.1 ether]")

      const _author1 = await this.blog.users(user1)
      assert.equal(web3.utils.BN(_author1.tips_sent), tipAmount, "[Should have 0.1 ether]")
    })

    it('author tip self article', async () => {
      const tipAmount = web3.utils.toWei('0.1', 'Ether')
      let article = await this.blog.getArticle(0)

      await this.blog.tipArticle(article.id, { from: deployer , value: tipAmount }).should.be.rejected
    })

    // Can't create article if it's not the owner
    it('Users cant create article', async () => {
      await this.blog.createArticle("Title", imageHash, "Amazing Content", { from: user2 }).should.be.rejected
    })

    it('Edit article title', async () => {
      const articles = await this.blog.getArticles()
      const article = articles[0]

      const result = await this.blog.editArticle(article.id, "Updated Title", article.imageHash , article.content, { from: deployer })
      const event = result.logs[0].args
      
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.equal(event.title, "Updated Title", "[Wrong article title]")
    })

    it('Edit article imageHash', async () => {
      const articles = await this.blog.getArticles()
      const article = articles[0]

      const result = await this.blog.editArticle(article.id, article.title, secondImageHash , article.content, { from: deployer })
      const event = result.logs[0].args
      
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.equal(event.imageHash, secondImageHash, "[Wrong article imageHash]")
    })

    it('Edit article content', async () => {
      const articles = await this.blog.getArticles()
      const article = articles[0]

      const result = await this.blog.editArticle(article.id, article.title, article.imageHash, "Updated Content", { from: deployer })
      const event = result.logs[0].args
      
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.equal(event.content, "Updated Content", "[Wrong article content]")
    })

    it('Edit article', async () => {
      const articles = await this.blog.getArticles()
      const article = articles[0]

      const result = await this.blog.editArticle(article.id, "Totally Different Title", secondImageHash, "Totally Different Content", { from: deployer })
      const event = result.logs[0].args
      
      assert.equal(event.id.toNumber(), 0, "[Wrong article ID]")
      assert.equal(event.title, "Totally Different Title", "[Wrong article title]")
      assert.equal(event.imageHash, secondImageHash, "[Wrong article imageHash]")
      assert.equal(event.content, "Totally Different Content", "[Wrong article content]")
    })

    it('Wrong author should fail to edit article', async () => {
      const articles = await this.blog.getArticles()
      const article = articles[0]
      await this.blog.editArticle(article.id, "Totally Different Title", secondImageHash, "Totally Different Content", { from: user2 }).should.be.rejected
    })
  })

  // Comments
  describe('Comments', async () => {
    it('Comment first article as the author', async () => {
      const result = await this.blog.addCommentToArticle(0, "This is a basic comment", { from: deployer })
      const event = result.logs[0].args
      
      assert.equal(event.id.toNumber(), 0, "[Wrong Comment ID]")
      assert.equal(event.articleId.toNumber(), 0, "[Wrong Comment's Article ID]")
      assert.equal(event.message, "This is a basic comment", "[Wrong comment message]")
      assert.equal(event.author, deployer, "[Wrong Comment author]")
      assert.equal(event.tips, 0, "[Wrong Tips amoung]")
      assert.notEqual(event.date.toNumber(), null, "[Comment has no date]")
    })

    it('Comment first article as another user', async () => {
      const result = await this.blog.addCommentToArticle(0, "This is a basic comment", { from: user1 })
      const event = result.logs[0].args
      
      assert.equal(event.id.toNumber(), 1, "[Wrong Comment ID]")
      assert.equal(event.articleId.toNumber(), 0, "[Wrong Comment's Article ID]")
      assert.equal(event.message, "This is a basic comment", "[Wrong comment message]")
      assert.equal(event.author, user1, "[Wrong Comment author]")
      assert.equal(event.tips, 0, "[Wrong Tips amoung]")
      assert.notEqual(event.date.toNumber(), null, "[Comment has no date]")
    })

    it('Comment not registered user should fail', async () => {
      await this.blog.addCommentToArticle(0, "This is a basic comment", { from: user3 }).should.be.rejected
    })

    it('Get user comments', async () => {
      const deployerComments = await this.blog.getUserComments({from: deployer})
      assert.equal(deployerComments.length, 1, "[deployer should have 1 comment]")

      const authorComments = await this.blog.getUserComments({from: user1})
      assert.equal(authorComments.length, 1, "[author1 should have 1 comment]")

      const userComments = await this.blog.getUserComments({from: user3})
      assert.equal(userComments.length, 0, "[User1 shouldn't have any comments]")
    })

    it('Get Article comments', async () => {
      const firstArticleComments = await this.blog.getArticleComments(0, {from: deployer})
      assert.equal(firstArticleComments.length, 2, "[First Article should have 2 comments]")

      const secondArticleComments = await this.blog.getArticleComments(1, {from: deployer})
      assert.equal(secondArticleComments.length, 0, "[Second Article should have 0 comments]")
    })
  })
})