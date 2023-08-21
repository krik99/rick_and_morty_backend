const { imgPath } = require('../database/filestorage');

function fixImgPath(realPath) {
  return `${imgPath}/${realPath}`;
}

function charactersApplyShortFormat(articles) {
  return articles.map((el) => {
    const { ...rest } = el;
    // reduce size for description
    const descr = rest.description.slice(0, 100);
    const lastWhiteSpace = descr.lastIndexOf(' ');
    rest.description = descr.slice(0, lastWhiteSpace);
    // modify path
    rest.img = fixImgPath(rest.img);
    return rest;
  });
}

async function getArticles(req, model, filter) {
  const {
    page = 1, limit = 10, id,
  } = req.query;

  let articlesData = null;
  let count = 0;

  if (id) {
    const ids = id.split(',');
    articlesData = await model.find(filter)
      .where('_id').in(ids)
      .select(['-author', '-content', '-comments'])
      .sort({ published: -1 })
      .lean();
    count = articlesData.length;
  } else {
    articlesData = await model.find(filter)
      .select(['-author', '-content', '-comments'])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ published: -1 })
      .lean();
    count = await model.countDocuments(filter);
  }

  const articles = charactersApplyShortFormat(articlesData);
  return {
    articles,
    pages: Math.ceil(count / limit),
    page: parseInt(page, 10),
  };
}

module.exports = {
  getArticles,
  fixImgPath,
};
