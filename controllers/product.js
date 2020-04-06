const express = require('express')
const router = express.Router();
const productModel2 = require("../model/product");
const productModel = require("../model/products");
const path=require("path");

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
            const newProduct = {
                Name : req.body.Name,
                Price : req.body.Price,
                Category : req.body.Category,
                ReleasedDate : req.body.ReleasedDate,
                Players : req.body.Players
            }
            const product = new productModel(newProduct);
            product.save()
            .then((product)=>{
                req.files.productPic.name=`${product._id}${path.parse(req.files.productPic.name).ext}`
                req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
                .then(()=>{
                    productModel.updateOne({_id:product._id},{
                        productPic:req.files.productPic.name
                    })
                    .then(()=>{
                        res.redirect("/products/list"); // notes:　this should go to list of products!!
                    })                    
                })                
            })
            .catch(err=>console.log(`Error happened when inserting in the database: ${err}`));
        }
});

router.get("/list",(req,res)=>{
    productModel.find()
    .then((products)=>{
        //forEach does not return an array(filterProducts)
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,
                Category:product.Category,
                BestSeller:product.BestSeller                
            }
        });
        res.render("products/listForm",{ 
            title:"MyAccount",
            headingInfo: "MyAccount",
            data:filterProducts                   
        })
    })
    .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));    
})

router.get("/edit/:id",(req,res)=>{
    //params.id: id is come from :id
    productModel.findById(req.params.id)
    .then((product)=>{
        const {_id,Name,Price,Category,ReleasedDate,Players,BestSeller,productPic}=product;
        res.render("products/editForm",{
            title:"Edit Product",
            headingInfo: "Edit Product",
            _id,Name,Price,Category,ReleasedDate,Players,BestSeller,productPic            
        })
    })
    .catch(err=>console.log(`Error happened when editing for the database: ${err}`));
    
})

router.put("/edit/:id",(req,res)=>{
    const product={
        //body.nameOfSchma
        Name:req.body.Name,
        Price:req.body.Price,
        Category:req.body.Category,
        BestSeller:req.body.BestSeller,
        ReleasedDate:req.body.ReleasedDate,
        Players:req.body.Players
    }
    productModel.updateOne({_id:req.params.id},product)
    .then(()=>{
       res.redirect("/products/list"); 
    })
    .catch(err=>console.log(`Error happened when updating for the database: ${err}`)); 
    
})

router.delete("/delete/:id",(req,res)=>{
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/products/list");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));
})

module.exports=router;