import Product from '../models/Product.js';

// @desc    Get all products (with optional filtering)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, isFeatured, isNewArrival, isBestSeller } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isNewArrival === 'true') {
      query.isNewArrival = true;
    }
    if (isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    // Check if ID is a valid MongoDB ObjectId
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      originalPrice,
      salePrice,
      stock,
      description,
      isFeatured,
      isNewArrival,
      isBestSeller,
    } = req.body;

    if (!name || !image || !category || originalPrice === undefined || salePrice === undefined) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const product = new Product({
      name,
      image,
      category,
      originalPrice: Number(originalPrice),
      salePrice: Number(salePrice),
      stock: Number(stock) || 50,
      description: description || undefined,
      isFeatured: !!isFeatured,
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      originalPrice,
      salePrice,
      stock,
      description,
      isFeatured,
      isNewArrival,
      isBestSeller,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.image = image !== undefined ? image : product.image;
      product.category = category !== undefined ? category : product.category;
      product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
      product.salePrice = salePrice !== undefined ? Number(salePrice) : product.salePrice;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.description = description !== undefined ? description : product.description;
      product.isFeatured = isFeatured !== undefined ? !!isFeatured : product.isFeatured;
      product.isNewArrival = isNewArrival !== undefined ? !!isNewArrival : product.isNewArrival;
      product.isBestSeller = isBestSeller !== undefined ? !!isBestSeller : product.isBestSeller;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
