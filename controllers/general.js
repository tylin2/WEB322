const express = require('express')
const router = express.Router();
const productModel = require("../model/products");

router.get("/",(req,res)=>{
    productModel.find({BestSeller:"true"})
    .then((products)=>{        
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                productPic:product.productPic          
            }
        });
        res.render("general/app",{ //add general
            title:"Home",
            headingInfo: "Nin10do",
            data:filterProducts
        }); 
    })
    .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));   
    
});

module.exports=router;