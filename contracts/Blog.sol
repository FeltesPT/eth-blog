pragma solidity ^0.8.4;

contract Blog {
  struct User {
    bytes32 name;
    address wallet_address;
    uint16 tips_received;
    uint16 tips_sent;
  }

  struct Article {
    uint16 id;
    uint date;
    string title;
    string imageUrl;
    string content;
    address author;
    bool published;
  }

  uint16 public articleCount = 0;
  Article[] public articles;

  mapping(address => User) public users;
  mapping(uint => address) public articleToUser;
  mapping(address => uint) public userArticlesCount;

   event UserCreated(
    bytes32 name,
    address wallet_address,
    uint16 tips_received,
    uint16 tips_sent
  );

  event ArticleCreated(
    uint16 id,
    uint date,
    string title,
    string imageUrl,
    string content,
    address author,
    bool published
  );

  event ArticlePublished(
    uint16 id,
    uint date,
    bool published
  );

  constructor() {
    createUser("Tiago Dias", msg.sender);
    createArticle("My first blog's title.", "https://www.epiccode.dev/img/iconBlackLogo.cd7fd92e.png" ,"My first blog article content!", msg.sender);
  }

  function createUser(bytes32 _name, address _wallet_address) public {
    users[_wallet_address] = User(_name, _wallet_address, 0, 0);
    emit UserCreated(_name, _wallet_address, 0, 0);
  }

  function createArticle(string memory _title, string memory _imageUrl, string memory _content, address _author) public {
    articles.push(Article(articleCount, block.timestamp, _title, _imageUrl, _content, _author, false));
    
    articleToUser[articleCount] = msg.sender;
    userArticlesCount[msg.sender] = userArticlesCount[msg.sender] + 1;

    emit ArticleCreated(articleCount, articles[articleCount].date, _title, _imageUrl, _content, _author, false);
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
      bool[] memory
    ) {

      uint16[] memory ids = new uint16[](articleCount);
      uint[] memory dates = new uint[](articleCount);
      string[] memory titles = new string[](articleCount);
      string[] memory imageUrls = new string[](articleCount);
      string[] memory contents = new string[](articleCount);
      address[] memory authors = new address[](articleCount);
      bool[] memory publisheds = new bool[](articleCount);

      for(uint i = 0; i < articleCount; i++) {
        ids[i] = articles[i].id;
        dates[i] = articles[i].date;
        titles[i] = articles[i].title;
        imageUrls[i] = articles[i].imageUrl;
        contents[i] = articles[i].content;
        authors[i] = articles[i].author;
        publisheds[i] = articles[i].published;
      }

      return (ids, dates, titles, imageUrls, contents, authors, publisheds);
  }

  function togglePublished(uint16 _id) external articleExists(_id) {
    Article storage _article = articles[_id];

    require(msg.sender == _article.author);

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

}