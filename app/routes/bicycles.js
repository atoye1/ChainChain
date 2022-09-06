const express = require('express');
const router = express.Router();

const bicycle_controller = require('../controllers/bicycleController.js');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}_${Date.now()}`);
    }
});
const upload = multer({ storage: storage });
router.get('/', bicycle_controller.bicycles_get); //done
router.post('/', upload.single('file'), bicycle_controller.bicycles_post); //done

router.get('/:id', bicycle_controller.bicycle_get); //done
router.get('/:id/history', bicycle_controller.bicycle_get_history); //done
router.post('/:id/delete', bicycle_controller.bicycle_delete_post); //done
router.post('/:id/update', bicycle_controller.bicycle_update_post);
router.post('/:id/transfer', bicycle_controller.bicycle_transfer_post);

module.exports = router;