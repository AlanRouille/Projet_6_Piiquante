const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const limite = require("../middleware/check-limit");


router.post('/', multer, saucesCtrl.createSauces);    //C
router.get('/', auth, saucesCtrl.getAllSauces);       //R
router.post('/:id/like', auth, limite.Limiter, saucesCtrl.likeSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces); //U
router.delete('/:id', auth, saucesCtrl.deleteSauces);      //D
router.get('/:id', auth, saucesCtrl.getOneSauces);



module.exports = router;