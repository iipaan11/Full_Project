const express = require('express');
const rateLimit = require('express-rate-limit');
const e = require('express');

const apiLimit = rateLimit({
    windowMs: 1000 * 60 * 3, // 3 minutes
    max: 100,
    message: 'You have exceeded the 100 requests in 3 minutes limit!',
});

const router = express.Router();
const productController = require('../controllers/products');

router.post('/products', apiLimit, productController.createProduct);
router.put('/products/:id',  productController.updateProduct);
router.delete('/products/:id',  productController.deleteProduct);
router.get('/products/:id',  productController.getProduct);
router.get('/products',  productController.getProducts);

module.exports = router;
