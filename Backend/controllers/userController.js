import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const registerUser = async (req, res) => {
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

export const loginUser = async (req, res) => {
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
        id: user._id,
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

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password -created_at ');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile details', error: err.message });
  }
};

export const profileChange = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const allowedUpdates = ['username', 'clubName'];
    const requestedUpdates = Object.keys(updates);
    const isValidOperation = requestedUpdates.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValidOperation) {
      return res.status(400).json({
        error: `Invalid update fields. Only ${allowedUpdates.join(', ')} can be updated.`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (updates.clubName && user.role !== 'admin') {
      return res.status(403).json({
        error: 'Only admins can set a club name.',
      });
    }

    if (updates.username) {
      const existingUser = await User.findOne({ username: updates.username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({ error: 'Username is already taken.' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -created_at');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    console.error('Profile update error:', err);
    res.status(500).json({
      error: 'Failed to update profile',
      details: err.message,
    });
  }
};

export const profileVisit = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select('-password -created_at');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile details', error: err.message });
  }
};
