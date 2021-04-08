pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Blog {
  struct Article {
    uint16 id;
    uint date;
    string title;
    string imageUrl;
    string content;
    bytes32 author;
    bool published;
  }

  uint16 public articleCount = 0;

  mapping(uint => Article) public articles;

  event ArticleCreated(
    uint16 id,
    uint date,
    string title,
    string imageUrl,
    string content,
    bytes32 author,
    bool published
  );

  event ArticlePublished(
    uint16 id,
    uint date,
    bool published
  );

  constructor() public {
    createArticle("My first blog's title.", "https://www.epiccode.dev/img/iconBlackLogo.cd7fd92e.png" ,"My first blog article content!", bytes32("Tiago Dias"));
  }

  function createArticle(string memory _title, string memory _imageUrl, string memory _content, bytes32 _author) public {
    articles[articleCount] = Article(articleCount, block.timestamp, _title, _imageUrl, _content, _author, false);
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
      bytes32[] memory,
      bool[] memory
    ) {

      uint16[] memory ids = new uint16[](articleCount);
      uint[] memory dates = new uint[](articleCount);
      string[] memory titles = new string[](articleCount);
      string[] memory imageUrls = new string[](articleCount);
      string[] memory contents = new string[](articleCount);
      bytes32[] memory authors = new bytes32[](articleCount);
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