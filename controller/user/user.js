const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail } = require('../../model/user');

exports.createUser = async (req, res) => {
    console.log("checking here", req.body)
  try {
    const { firstname, lastname, email, password, status } = req.body;
    console.log("checking here", firstname, lastname, email, password, status)

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      status: status || true, // default true if not provided
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.userList = async (req, res) => {
  try {
    res.status(200).json({ message: "User List successfully loaded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};