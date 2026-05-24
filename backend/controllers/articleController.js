import Article from '../models/Article.js';

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single article by ID or Slug
// @route   GET /api/articles/:idOrSlug
// @access  Public
export const getArticleById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let article;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(idOrSlug);
    } else {
      article = await Article.findOne({ slug: idOrSlug });
    }

    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private/Admin
export const createArticle = async (req, res) => {
  try {
    const { title, image, description, content, date } = req.body;

    if (!title || !image || !description || !content) {
      return res.status(400).json({ message: 'Please provide all required fields (title, image, description, content)' });
    }

    const article = new Article({
      title,
      image,
      description,
      content,
      date: date || undefined,
    });

    const createdArticle = await article.save();
    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private/Admin
export const updateArticle = async (req, res) => {
  try {
    const { title, image, description, content, date } = req.body;

    const article = await Article.findById(req.params.id);

    if (article) {
      article.title = title !== undefined ? title : article.title;
      article.image = image !== undefined ? image : article.image;
      article.description = description !== undefined ? description : article.description;
      article.content = content !== undefined ? content : article.content;
      article.date = date !== undefined ? date : article.date;

      const updatedArticle = await article.save();
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (article) {
      await Article.findByIdAndDelete(req.params.id);
      res.json({ message: 'Article removed successfully' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

