const express = require('express')
const router = express.Router();

const productModel = require("../model/product");

//because product already wrote in app.use("/products",productController);
//we just wrote / here
router.get("/",(req,res)=>{

    res.render("products/products",{ //add products
        title:"Products",
        headingInfo: "Products",
        products :productModel.getAllProducts()
    });

});

module.exports=router;