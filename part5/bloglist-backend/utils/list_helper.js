var _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;

  blogs.forEach((blog) => {
    likes += blog.likes;
  });

  return likes;
};

const favoriteBlog = (blogs) => {
  let favoriteBlog = null;

  blogs.forEach((blog) => {
    if (favoriteBlog === null || favoriteBlog.likes < blog.likes) {
      favoriteBlog = blog;
      delete favoriteBlog.url;
      delete favoriteBlog._id;
      delete favoriteBlog.__v;
    }
  });

  return favoriteBlog;
};

const mostBlogs = (blogs) => {
  if (blogs.length < 1) {
    return null;
  } else if (blogs.length === 1) {
    return { author: blogs[0].author, blogs: 1 };
  } else {
    var filtered = _(blogs)
      .groupBy("author")
      .map((blogs, key) => ({
        author: key,
        blogs: _.size(blogs),
      }))
      .value();

    var mostBlogs = _.maxBy(filtered, "blogs");
    return mostBlogs;
  }
};

const mostLikes = (blogs) => {
  var mostLikes;
  if (blogs.length < 1) {
    return null;
  } else if (blogs.length === 1) {
    mostLikes = blogs[0];
  } else {
    var filtered = _(blogs)
      .groupBy("author")
      .map((blogs, key) => ({
        author: key,
        likes: _.sumBy(blogs, "likes"),
      }))
      .value();

    mostLikes = _.maxBy(filtered, "likes");
  }

  delete mostLikes.title;
  delete mostLikes.url;
  delete mostLikes._id;
  delete mostLikes.__v;

  return mostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
