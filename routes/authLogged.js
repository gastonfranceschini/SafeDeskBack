require('dotenv').config()
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

//GET /api/logged/current
router.get('/current', async (req, res) => {
  return res.send(req.user);
});

module.exports = router;
