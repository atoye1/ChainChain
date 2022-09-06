const express = require('express');
const router = express.Router();

// Require controller modules.
const user_controller = require('../controllers/userController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', user_controller.users_get);
router.post('/', user_controller.users_create_post);

router.get('/login', user_controller.users_login_get);
router.post('/login', user_controller.users_login_post);
router.post('/logout', user_controller.users_logout_post);

router.get('/:id', user_controller.user_get);
router.delete('/:id', user_controller.user_delete);
module.exports = router;