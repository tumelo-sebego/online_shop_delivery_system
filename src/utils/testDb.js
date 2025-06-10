const mongoose = require("mongoose");
const Address = require("../models/address.model");
require("dotenv").config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create a test address
    const testAddress = new Address({
      customer_id: new mongoose.Types.ObjectId(), // Temporary ID
      address_line_1: "123 Test Street",
      city: "Test City",
      postal_code: "12345",
      coordinates: {
        latitude: -26.2041,
        longitude: 28.0473,
      },
    });

    await testAddress.save();
    console.log("Test address created");

    // Query to verify
    const addresses = await Address.find();
    console.log("Addresses in database:", addresses);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

testConnection();
