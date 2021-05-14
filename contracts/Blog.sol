//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Blog {
  struct User {
    bytes32 name;
    address wallet_address;
    uint tips_received;
    uint tips_sent;
  }

  struct Article {
    uint16 id;
    uint date;
    string title;
    string imageHash;
    string content;
    address payable author;
    bool published;
    uint tips;
  }

  struct Comment {
    uint id;
    uint16 articleId;
    string message;
    address payable author;
    uint tips;
    uint date;
  }

  address payable public owner;
  uint16 public articleCount = 0;
  uint public commentCount = 0;
  Article[] private articles;
  Comment[] private comments;

  mapping(address => User) public users;
  mapping(uint16 => address) public articleToUser;
  mapping(address => uint) public userArticlesCount;
  mapping(uint => uint16) public commentToArticle;
  mapping(uint16 => uint16) public articleCommentsCount;

  event UserCreated(
    bytes32 name,
    address wallet_address,
    uint tips_received,
    uint tips_sent
  );

  event ArticleCreated(
    uint16 id,
    uint date,
    string title,
    string imageHash,
    string content,
    address author,
    bool published,
    uint tips
  );

  event ArticleEdited(
    uint16 id,
    uint date,
    string title,
    string imageHash,
    string content,
    address author,
    bool published,
    uint tips
  );

  event ArticlePublished(
    uint16 id,
    uint date,
    bool published
  );

  event CommentCreated (
    uint id,
    uint16 articleId,
    string message,
    address payable author,
    uint tips,
    uint date
  );

  constructor() {
    owner = payable(msg.sender);
    createUser("Tiago Dias");
    // createArticle(
    //   "My first blog's title.",
    //   "QmQpmL2kW6YfTmGwmN82AqNUAh7rbp6rTj3QDBaAsrWgcm",
    //   "My first blog article content!"
    // );
    // createArticle(
    //   "My second blog's title.",
    //   "QmfG4fbLdwbhaS3beJuAhJduhCuvrFd8cqui6EDzVkdGYd",
    //   "It's about unicorns!"
    // );
  }

  // User Methods
  function createUser(bytes32 _name) public {
    users[msg.sender] = User(_name, msg.sender, 0, 0);
    emit UserCreated(_name, msg.sender, 0, 0);
  }

  // Article Methods
  function createArticle(string memory _title, string memory _imageHash, string memory _content) public userExists() isOwner() {
    articles.push(Article(articleCount, block.timestamp, _title, _imageHash, _content, payable(msg.sender), false, 0));
    
    articleToUser[articleCount] = msg.sender;
    userArticlesCount[msg.sender] = userArticlesCount[msg.sender] + 1;

    emit ArticleCreated(articleCount, articles[articleCount].date, _title, _imageHash, _content, msg.sender, false, 0);
    articleCount++;
  }

  function editArticle(uint16 _id, string memory _title, string memory _imageHash, string memory _content)
    public
    userExists()
    articleExists(_id)
    isAuthor(_id) {
      
      Article storage _article = articles[_id];
      _article.title = _title;
      _article.content = _content;
      _article.imageHash = _imageHash;
      _article.date = block.timestamp;

      emit ArticleEdited(_article.id, _article.date, _article.title, _article.imageHash, _article.content, _article.author, _article.published, _article.tips);
  }

  function getArticle(uint16 _id) external view returns(Article memory) {
      Article memory _article = articles[_id];

      if (_article.published || (!_article.published && _article.author == msg.sender)) {
        return _article;  
      }

      revert();
  }

  function getArticles() external view returns(Article[] memory) {
      Article[] memory _articles = new Article[](articleCount);

      uint16 _publishedCount = 0;

      for(uint i = 0; i < articleCount; i++) {
        // Only published articles are being sent
        if (articles[i].published) {
          _articles[i] = articles[i];
          _publishedCount++;
        }
      }

      Article[] memory _publishedArticles = new Article[](_publishedCount);
      for(uint i = 0; i < _articles.length; i++) {
        // Only published articles are being sent
        if (_articles[i].published) {
          _publishedArticles[i] = articles[i];
        }
      }

      return _publishedArticles;
  }

  function getUserArticles() external view returns(Article[] memory) {

      Article[] memory _articles = new Article[](articleCount);

      uint16 _myCount = 0;

      for(uint i = 0; i < articleCount; i++) {
        if (articles[i].author == msg.sender) {
          _articles[i] = articles[i];
          _myCount++;
        }
      }

      Article[] memory _myArticles = new Article[](_myCount);
      for(uint i = 0; i < _myCount; i++) {
        _myArticles[i] = _articles[i];
      }

      return _myArticles;
  }

  function togglePublished(uint16 _id) external articleExists(_id) isAuthor(_id) {
    Article storage _article = articles[_id];
    _article.published = !_article.published;
    _article.date = block.timestamp;
    emit ArticlePublished(_article.id, _article.date, _article.published);
  }

  modifier userExists() {
    if (users[msg.sender].name == '') {
      revert();
    }
    _;
  }

  modifier articleExists(uint16 _id) {
    if(articles[_id].date == 0) {
      revert();
    }
    _;
  }

  modifier isAuthor(uint16 _id) {
    if (articles[_id].author != msg.sender) {
      revert();
    }
    _;
  }

  modifier isNotAuthor(uint16 _id) {
    if (articles[_id].author == msg.sender) {
      revert();
    }
    _;
  }

  modifier isOwner() {
    if (owner != msg.sender) {
      revert();
    }
    _;
  }

  // Tips
  function tipArticle(uint16 _id) public payable articleExists(_id) isNotAuthor(_id) {
    Article memory _article = articles[_id];

    address payable _author_address = _article.author;
    _author_address.transfer(msg.value);

    _article.tips = _article.tips + msg.value;
    articles[_id] = _article;
    
    User memory _author = users[_author_address];
    _author.tips_received = _author.tips_received + msg.value;
    users[_author_address] = _author;

    User memory _tipper = users[msg.sender];
    _tipper.tips_sent = _tipper.tips_sent + msg.value;
    users[msg.sender] = _tipper;
  }

  // Comments methods
  function addCommentToArticle(uint16 _articleId, string memory _message) external articleExists(_articleId) userExists() {
    comments.push(Comment(commentCount, _articleId, _message, payable(msg.sender), 0, block.timestamp));

    commentToArticle[commentCount] = _articleId;
    articleCommentsCount[_articleId] = articleCommentsCount[_articleId] + 1;

    // Emit Event here
    emit CommentCreated(commentCount, _articleId, _message, payable(msg.sender), 0, comments[commentCount].date);
    commentCount++;
  }

  function getArticleComments(uint16 _articleId) external view returns(Comment[] memory) {
    Comment[] memory _comments = new Comment[](commentCount);

    uint _articleCommentsCount = 0;
    for (uint i = 0; i < commentCount; i++) {
      if (comments[i].articleId == _articleId) {
        _comments[i] = comments[i];
        _articleCommentsCount++;
      }
    }

    Comment[] memory _articleComments = new Comment[](_articleCommentsCount);
    for (uint i = 0; i < _articleCommentsCount; i++) {
      _articleComments[i] = _comments[i];
    }

    return _articleComments;
  }

  function getUserComments() external view returns(Comment[] memory) {
    Comment[] memory _comments = new Comment[](commentCount);

    uint _userCommentsCount = 0;
    for (uint i = 0; i < commentCount; i++) {
      if (comments[i].author == msg.sender) {
        _comments[i] = comments[i];
        _userCommentsCount++;
      }
    }

    Comment[] memory _userComments = new Comment[](_userCommentsCount);
    for (uint i = 0; i < _userCommentsCount; i++) {
      _userComments[i] = _comments[i];
    }

    return _userComments;
  }

}