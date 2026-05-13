const List = require('../models/List');

const createList = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const list = await List.create({
      userId: req.user.id,
      name,
      description,
      isPublic
    });

    res.status(201).json({ message: 'List created', list });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyLists = async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user.id })
      .populate('movies.movieId', 'title poster averageRating');
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id)
      .populate('userId', 'username')
      .populate('movies.movieId', 'title poster averageRating');

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    if (!list.isPublic && list.userId._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'This list is private' });
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMovieToList = async (req, res) => {
  try {
    const { movieId } = req.body;
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const alreadyIn = list.movies.find(m => m.movieId.toString() === movieId);
    if (alreadyIn) {
      return res.status(400).json({ message: 'Movie already in this list' });
    }

    list.movies.push({ movieId });
    await list.save();

    res.json({ message: 'Movie added to list', list });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeMovieFromList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    list.movies = list.movies.filter(
      m => m.movieId.toString() !== req.params.movieId
    );
    await list.save();

    res.json({ message: 'Movie removed from list', list });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, isPublic } = req.body;
    list.name = name ?? list.name;
    list.description = description ?? list.description;
    list.isPublic = isPublic ?? list.isPublic;
    await list.save();

    res.json({ message: 'List updated', list });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await list.deleteOne();
    res.json({ message: 'List deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createList, getMyLists, getList,
  addMovieToList, removeMovieFromList,
  updateList, deleteList
};