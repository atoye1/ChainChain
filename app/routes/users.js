const express = require('express');
const router = express.Router();

// Require controller modules.
const user_controller = require('../controllers/userController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', user_controller.users_get);
router.post('/', user_controller.users_create_post);
router.get('/:id', user_controller.user_get);


module.exports = router;