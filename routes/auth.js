const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: 'Email already used' });
    const role = adminKey && adminKey === process.env.ADMIN_KEY ? 'admin' : 'user';
    await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
    res.json({ msg: 'Registered', role });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ msg: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, role: user.role, name: user.name });
});

module.exports = router;