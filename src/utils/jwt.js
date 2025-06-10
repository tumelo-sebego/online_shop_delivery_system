const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      permissions: getPermissions(user.role),
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
};

const getPermissions = (role) => {
  const permissions = {
    admin: [
      "manage_products",
      "manage_orders",
      "manage_users",
      "view_analytics",
    ],
    customer: ["place_order", "view_orders", "manage_profile"],
    driver: ["accept_orders", "update_order_status", "update_location"],
  };
  return permissions[role] || [];
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getPermissions,
};
