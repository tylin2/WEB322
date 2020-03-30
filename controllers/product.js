const express = require('express')
const router = express.Router();
const productModel2 = require("../model/product");
const productModel = require("../model/products");

//because product already wrote in app.use("/products",productController);
//we just wrote / here
router.get("/",(req,res)=>{

    res.render("products/products",{ //add products
        title:"Products",
        headingInfo: "Products",
        products :productModel2.getAllProducts()
    });

});

router.get("/add",(req,res)=>{
    res.render("products/addForm",{ //add products
        title:"Add Product",
        headingInfo: "Add Product"        
    });
});

router.post("/add",(req,res)=>{
    const errorMessages = [];
        
        if(req.body.Name=="")  {                            
                errorMessages.push("! Enter Product's Name");
        }

        if(req.body.Price=="")  {                            
            errorMessages.push("! Enter Product's Price");
        }else{                                
            if (req.body.Price<=0) {
                    errorMessages.push("! Enter Correct Product's Price");
            }
        }

        if(req.body.Category=="")  {                            
            errorMessages.push("! Enter Product's Category");
        }

        if(req.body.ReleasedDate=="")  {                            
            errorMessages.push("! Enter Product's Released Date");
        }

        if(req.body.Players=="")  {                            
            errorMessages.push("! Enter Product's Max Players");
        }else{
            if(req.body.Players<=0)  {                
                errorMessages.push("! Enter the Correct Product's Max Players");
            }
        }

        if(errorMessages.length > 0 )  {                
            res.render("products/addForm",{ 
                title:"Add Product",
                headingInfo: "Add Product",                        
                errors : errorMessages,
                Name: req.body.Name,
                Price : req.body.Price,
                Category : req.body.Category,
                ReleasedDate : req.body.ReleasedDate,
                Players : req.body.Players               
            });

        }else{
            const newUser = {
                Name : req.body.Name,
                Price : req.body.Price,
                Category : req.body.Category,
                ReleasedDate : req.body.ReleasedDate,
                Players : req.body.Players
            }
            const product = new productModel(newUser);
            product.save()
            .then(()=>{
                res.redirect("/products/list"); // notes:　this should go to list of products!!
            })
            .catch(err=>console.log(`Error happened when inserting in the database: ${err}`));
        }
});

router.get("/list",(req,res)=>{
    res.render("products/listForm",{ 
        title:"MyAccount",
        headingInfo: "MyAccount"       
    })
})

module.exports=router;