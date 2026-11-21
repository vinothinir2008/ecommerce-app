const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!items || !items.length) return res.status(400).json({ msg: 'Cart is empty' });
    let total = 0;
    const orderItems = [];
    for (const i of items) {
      const p = await Product.findById(i.id);
      if (!p) return res.status(400).json({ msg: 'Product not found' });
      total += p.price * i.qty;
      orderItems.push({ product: p._id, name: p.name, price: p.price, qty: i.qty });
    }
    const order = await Order.create({
      user: req.user.id, userName: req.body.userName,
      items: orderItems, total, address
    });
    res.json(order);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.get('/mine', auth, async (req, res) =>
  res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 })));

router.get('/', auth, isAdmin, async (req, res) =>
  res.json(await Order.find().sort({ createdAt: -1 })));

router.put('/:id', auth, isAdmin, async (req, res) =>
  res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })));

module.exports = router;