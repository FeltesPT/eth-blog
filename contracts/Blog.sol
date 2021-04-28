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

  uint16 public articleCount = 0;
  Article[] public articles;

  mapping(address => User) public users;
  mapping(uint => address) public articleToUser;
  mapping(address => uint) public userArticlesCount;

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

  event ArticlePublished(
    uint16 id,
    uint date,
    bool published
  );

  constructor() {
    createUser("Tiago Dias", msg.sender);
    createArticle(
      "My first blog's title.",
      "QmQpmL2kW6YfTmGwmN82AqNUAh7rbp6rTj3QDBaAsrWgcm",
      "My first blog article content!",
      payable(msg.sender)
    );
  }

  // User Methods
  function createUser(bytes32 _name, address _wallet_address) public {
    users[_wallet_address] = User(_name, _wallet_address, 0, 0);
    emit UserCreated(_name, _wallet_address, 0, 0);
  }

  // Article Methods
  function createArticle(string memory _title, string memory _imageUrl, string memory _content, address payable _author) public {
    articles.push(Article(articleCount, block.timestamp, _title, _imageUrl, _content, _author, false, 0));
    
    articleToUser[articleCount] = msg.sender;
    userArticlesCount[msg.sender] = userArticlesCount[msg.sender] + 1;

    emit ArticleCreated(articleCount, articles[articleCount].date, _title, _imageUrl, _content, _author, false, 0);
    articleCount++;
  }

  function getArticles()
    external
    view
    returns(
      uint16[] memory,
      uint[] memory,
      string[] memory,
      string[] memory,
      string[] memory,
      address[] memory,
      bool[] memory,
      uint[] memory
    ) {

      uint16[] memory ids = new uint16[](articleCount);
      uint[] memory dates = new uint[](articleCount);
      string[] memory titles = new string[](articleCount);
      string[] memory imageHashes = new string[](articleCount);
      string[] memory contents = new string[](articleCount);
      address[] memory authors = new address[](articleCount);
      bool[] memory publisheds = new bool[](articleCount);
      uint[] memory tips = new uint[](articleCount);

      for(uint i = 0; i < articleCount; i++) {
        ids[i] = articles[i].id;
        dates[i] = articles[i].date;
        titles[i] = articles[i].title;
        imageHashes[i] = articles[i].imageHash;
        contents[i] = articles[i].content;
        authors[i] = articles[i].author;
        publisheds[i] = articles[i].published;
        tips[i] = articles[i].tips;
      }

      return (ids, dates, titles, imageHashes, contents, authors, publisheds, tips);
  }

  function togglePublished(uint16 _id) external articleExists(_id) isOwner(_id) {
    Article storage _article = articles[_id];
    _article.published = !_article.published;
    _article.date = block.timestamp;
    emit ArticlePublished(_article.id, _article.date, _article.published);
  }

  modifier articleExists(uint16 _id) {
    if(articles[_id].date == 0) {
      revert();
    }
    _;
  }

  modifier isOwner(uint16 _id) {
    if (articles[_id].author != msg.sender) {
      revert();
    }
    _;
  }

  modifier isNotOwner(uint16 _id) {
    if (articles[_id].author == msg.sender) {
      revert();
    }
    _;
  }

  // Tips
  function tipArticle(uint16 _id) public payable articleExists(_id) isNotOwner(_id) {
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

}