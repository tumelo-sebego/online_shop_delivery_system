const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/common/auth.routes');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;