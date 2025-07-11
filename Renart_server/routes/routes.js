const express = require("express");
const router = express.Router();
const {getAllProducts, getProductsByPriceRange, getProductsByPopularityRange} = require("../controllers/productController");


router.get("/", getAllProducts);

router.get("/price-range", getProductsByPriceRange);

router.get("/popularity", getProductsByPopularityRange);


module.exports = router;