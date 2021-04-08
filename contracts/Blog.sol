pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Blog {
  struct Article {
    uint16 id;
    uint date;
    string content;
    bytes32 author;
    bool published;
  }

  uint16 public articleCount = 0;

  mapping(uint => Article) public articles;

  event ArticleCreated(
    uint16 id,
    uint date,
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
    createArticle("My first blog article", bytes32("Tiago Dias"));
  }

  function createArticle(string memory _content, bytes32 _author) public {
    articles[articleCount] = Article(articleCount, block.timestamp, _content, _author, false);
    emit ArticleCreated(articleCount, articles[articleCount].date, _content, _author, false);
    articleCount++;
  }

  function getArticles()
    external
    view
    returns(
      uint16[] memory,
      uint[] memory,
      string[] memory,
      bytes32[] memory,
      bool[] memory
    ) {

      uint16[] memory ids = new uint16[](articleCount);
      uint[] memory dates = new uint[](articleCount);
      string[] memory contents = new string[](articleCount);
      bytes32[] memory authors = new bytes32[](articleCount);
      bool[] memory publisheds = new bool[](articleCount);

      for(uint i = 0; i < articleCount; i++) {
        ids[i] = articles[i].id;
        dates[i] = articles[i].date;
        contents[i] = articles[i].content;
        authors[i] = articles[i].author;
        publisheds[i] = articles[i].published;
      }

      return (ids, dates, contents, authors, publisheds);
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