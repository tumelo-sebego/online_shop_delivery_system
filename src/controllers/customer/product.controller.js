const Product = require('../../models/product.model');

const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;
        
        const query = { is_available: true };
        if (category) query.category_id = category;

        const products = await Product.find(query)
            .populate('category_id', 'name')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await Product.countDocuments(query);

        res.status(200).json({
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { query, category } = req.query;
        // TODO: Implement product search logic
        res.status(200).json({
            products: [],
            total: 0,
            query,
            category
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        // TODO: Implement fetch categories logic
        const categories = [];
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProducts,
    searchProducts,
    getCategories
};