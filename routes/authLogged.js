require('dotenv').config()
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

//GET/authLogged/current
router.get('/current', async (req, res) => {
  res.send(req.user);
});

module.exports = router;
