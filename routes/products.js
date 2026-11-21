const router = require('express').Router();
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => res.json(await Product.find()));

router.post('/', auth, isAdmin, async (req, res) =>
  res.json(await Product.create(req.body)));

router.put('/:id', auth, isAdmin, async (req, res) =>
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })));

router.delete('/:id', auth, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

module.exports = router;