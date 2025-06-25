const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

const registerUser = async (req, res) => {
  const { username, email, password, role, clubName } = req.body;

  try {
    const domain = "@vitbhopal.ac.in";
    if (!email.endsWith(domain)) {
      return res.status(400).json({ message: 'Invalid email. Only VIT Bhopal emails are allowed' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
    username,
    email,
    password: hashedPassword,
    role
    };
    if (role === 'admin') {
      newUserData.clubName = clubName;
    }
    const newUser = new User(newUserData);

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      {
        id:user._id,
        username: user.username, 
        email: user.email, 
        role: user.role,
        clubName: user.clubName || null
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

     res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        clubName: user.clubName || null
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user' });
  }
};

const profileVisit = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile details', error: err.message });
  }
};

const profileChange = async (req, res) => {
  try {
    const username = req.params.username;
    const updatedProfileData = req.body;

    // Update the user's profile in the database
    const result = await User.findOneAndUpdate(
      { username: username }, // Query to find the user by username
      updatedProfileData,     // Data to update
      { new: true }           // Option to return the updated document
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedProfile: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  profileVisit,
  profileChange
};
