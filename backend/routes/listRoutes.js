const express = require('express');
const router = express.Router();
const {
  createList, getMyLists, getList,
  addMovieToList, removeMovieFromList,
  updateList, deleteList
} = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createList);
router.get('/my', protect, getMyLists);
router.get('/:id', getList);
router.put('/:id', protect, updateList);
router.delete('/:id', protect, deleteList);
router.post('/:id/movies', protect, addMovieToList);
router.delete('/:id/movies/:movieId', protect, removeMovieFromList);

module.exports = router;