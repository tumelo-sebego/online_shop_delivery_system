const getAllCustomers = async (req, res) => {
    try {
        // TODO: Implement get all customers logic
        res.status(200).json({
            customers: [],
            total: 0,
            page: 1,
            limit: 10
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllCustomers
};