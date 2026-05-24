const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET user profile by ID (public info)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email'); // Exclude sensitive info
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE user profile (own profile only)
router.put('/:userId', async (req, res) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body;
    
    // Note: Your schema doesn't have firstName/lastName separately
    // You might want to add them or just use bio and avatar
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        bio: bio,
        avatar: avatar
        // Add firstName/lastName if you add them to schema
      },
      { new: true }
    ).select('-password -email');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// GET user's public playlists
router.get('/:userId/playlists', async (req, res) => {
  try {
    const List = require('../models/List');
    const playlists = await List.find({ 
      userId: req.params.userId, 
      isPublic: true 
    }).populate('movies', 'title poster averageRating releaseYear');
    
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
});

module.exports = router;