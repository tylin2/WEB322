const express = require('express')
const router = express.Router();
const productModel = require("../model/products");
const cartModel = require("../model/cart");
const isLoggedIn = require("../middleware/auth");
const isAdmin = require("../middleware/admit");
const moment=require('moment');
const path=require("path");

//because product already wrote in app.use("/products",productController);
//we just wrote / here
router.get("/",(req,res)=>{
    productModel.find()
    .then((products)=>{        
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,
                Category:product.Category,
                BestSeller:product.BestSeller,
                productPic:product.productPic,
                Quantity:product.Quantity                
            }
        });
        res.render("products/products",{ 
            title:"Products",
            headingInfo: "Products",
            products:filterProducts                   
        })
    })
    .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));  

});

router.get("/Adventure",(req,res)=>{
    productModel.find({Category:`Adventure`})
    .then((products)=>{       
        const AdventureProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,
                Category:product.Category,
                BestSeller:product.BestSeller,
                productPic:product.productPic,
                Quantity: product.Quantity,                                
            }
        });
        res.render("products/products",{ 
            title:"Products",
            headingInfo: "Products",
            products:AdventureProducts                   
        })
    })
    .catch(err=>console.log(`Error happened when filtering from the database: ${err}`));
});

router.get("/Racing",(req,res)=>{
    productModel.find({Category:"Racing"})
    .then((products)=>{       
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,
                Category:product.Category,
                BestSeller:product.BestSeller,
                productPic:product.productPic,
                Quantity: product.Quantity,                
            }
        });
        res.render("products/products",{ 
            title:"Products",
            headingInfo: "Products",
            products:filterProducts                   
        })
    })
    .catch(err=>console.log(`Error happened when filterin from the database: ${err}`));  

});

router.get("/Sports",(req,res)=>{
    productModel.find({Category:"Sports"})
    .then((products)=>{       
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,
                Category:product.Category,
                BestSeller:product.BestSeller,
                productPic:product.productPic,
                Quantity: product.Quantity,                
            }
        });
        res.render("products/products",{ 
            title:"Products",
            headingInfo: "Products",
            products:filterProducts                   
        })
    })
    .catch(err=>console.log(`Error happened when filterin from the database: ${err}`));  

});

router.get("/Party",(req,res)=>{
    productModel.find({Category:"Party"})
    .then((products)=>{       
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,
                Category:product.Category,
                BestSeller:product.BestSeller,
                productPic:product.productPic,
                Quantity: product.Quantity,                
            }
        });
        res.render("products/products",{ 
            title:"Products",
            headingInfo: "Products",
            products:filterProducts                   
        })
    })
    .catch(err=>console.log(`Error happened when filterin from the database: ${err}`));  

});

router.get("/add",isLoggedIn,(req,res)=>{
    res.render("products/addForm",{ //add products
        title:"Add Product",
        headingInfo: "Add Product"        
    });
});

router.post("/add",isLoggedIn,(req,res)=>{
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

        if(req.body.description =="")  {                            
            errorMessages.push("! Enter Product's description");
        }

        if(req.body.Quantity=="")  {                            
            errorMessages.push("! Enter Product's Quantity");
        }else{
            if(req.body.Quantitys<=0)  {                
                errorMessages.push("! Enter the Correct Product's Quantity");
            }
        }

        if(req.body.productPic==null)  {                            
            errorMessages.push("! Enter Product's Picture Only image");
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
                Players : req.body.Players,
                Quantity: req.body.Quantity,
                description: req.body.description               
            });

        }else{
            const newProduct = {
                Name : req.body.Name,
                Price : req.body.Price,
                Category : req.body.Category,
                ReleasedDate : req.body.ReleasedDate,
                Players : req.body.Players,
                Quantity: req.body.Quantity,
                description: req.body.description,
                createBy: req.session.userInfo.email
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

router.get("/list",isLoggedIn,(req,res)=>{    
    productModel.find({createBy:req.session.userInfo.email})
    .then((products)=>{
        //forEach does not return an array(filterProducts)
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,               
                BestSeller:product.BestSeller,
                Quantity: product.Quantity,
                productPic:product.productPic                
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

router.get("/MyCart",isLoggedIn,(req,res)=>{
    cartModel.find({createBy:req.session.userInfo.email})
    .then((products)=>{                 
        const filterProducts=products.map(product=>{
            return{
                id:product._id,                
                productId:product.productId,
                Name:product.Name,
                Price:product.Price,                
                productPic:product.productPic,
                Quantity:product.Quantity,
                MAX_Quantity:product.MAX_Quantity,
                subtotal:product.Price*product.Quantity,                                                                               
            }
                                          
        });
        var sum=0;
        for(var i=0;i<filterProducts.length;i++){
            sum=sum+filterProducts[i].subtotal;
        } 
        var tax=sum*0.13;
        var total=sum+tax;       
        res.render("products/cart",{ 
            title:"MyCart",
            headingInfo: "MyCart",
            data:filterProducts,
            subtotal:sum.toFixed(2),
            tax:tax.toFixed(2),
            total:total.toFixed(2)                                           
        })
        
        
    })
    .catch(err=>console.log(`Error happened when pulling from the database in cart: ${err}`));     
})

router.put("/myCart",isLoggedIn,(req,res)=>{    
    cartModel.find({createBy:req.session.userInfo.email})
    .then((products)=>{                       
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                productId:product.productId,            
                Name:product.Name,
                Price:product.Price,         
                Quantity:product.Quantity,
                MAX_Quantity:product.MAX_Quantity,                
                subtotal:product.Price*product.Quantity,                                                                               
            }                                          
        });
        var sum=0;
        var text="";
        for(var i=0;i<filterProducts.length;i++){
            sum=sum+filterProducts[i].subtotal;
            const product={
                Quantity:filterProducts[i].MAX_Quantity-filterProducts[i].Quantity
            }
            productModel.updateOne({_id:filterProducts[i].productId,},product)
            .then(()=>{})
            .catch(err=>console.log(`Error happened when updating for the database for order: ${err}`));
            text += "<tr> <td>"+`${filterProducts[i].Name}`+"</td> <td>"+`${filterProducts[i].Quantity}`+"</td> <td>"+ `${filterProducts[i].Price}`+"</td> <td>"+ `${filterProducts[i].subtotal}`+"</td> </tr>";
        }         
        var tax=sum*0.13;
        var total=sum+tax;             
        const orderMail = require('@sendgrid/mail');
        orderMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const PlaceOrder = {
            to: `${req.session.userInfo.email}`,
            from: `s88432000@gmail.com`,
            subject: `Thank you for your Order`,
            html: 
            `Thank you, ${req.session.userInfo.fullName} <br>
             <table>
               <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price(unit)</th>
                  <th>Price</th>                  
               </tr>               
               ${text}              
               <tr>
                  <td colspan="3">Subtotal: </th>
                  <td>${sum.toFixed(2)}</th>                                    
               </tr>
               <tr>
                  <td colspan="3">Tax: </th>
                  <td>${tax.toFixed(2)}</th>                                    
               </tr>
               <tr>
                  <td colspan="3">Total: </th>
                  <td>${total.toFixed(2)}</th>                                    
               </tr>
             </table>
                        
            `,
        };
        orderMail.send(PlaceOrder)
        .then(()=>{            
            cartModel.deleteMany({createBy:req.session.userInfo.email})
            .then(()=>{
                res.redirect("/");
            })
            .catch(err=>console.log(`Error happened when deleting data from the database in cart :${err}`));
            
        })
        .catch(err=>{
            console.log(`Error ${err}`)
        })       
    })
    .catch(err=>console.log(`Error happened when placing order from the database in cart: ${err}`));    
})



router.post("/MyCart/:id",isLoggedIn,(req,res)=>{
    productModel.findById(req.params.id)
    .then((product)=>{        
        const {_id,Name,Price,productPic,Quantity}=product;        
        const newProduct = {
            productId:product._id,
            Name : product.Name,
            Price : product.Price,
            productPic:product.productPic,            
            Quantity: req.body.Quantity,
            MAX_Quantity:product.Quantity,           
            createBy: req.session.userInfo.email            
        }
        const cart = new cartModel(newProduct);        
        cart.save()
        .then(()=>{
            res.redirect("/products")
        })
        .catch(err=>console.log(`Error happened when inserting in the database in cart:${err}`));        
    })
    .catch(err=>console.log(`Error happened when adding for the database in cart: ${err}`));
       
})

router.put("/MyCart/edit/:id",isLoggedIn,(req,res)=>{    
    const product={
        Quantity:req.body.Quantity
    }
    cartModel.updateOne({_id:req.params.id},product)
    .then(()=>{
        if(req.session.userInfo.type=="Admin"){
            res.redirect("/products/AdminList");
        }else{
            res.redirect("/products/MyCart"); 
        }        
       
    })
    .catch(err=>console.log(`Error happened when updating for the database in cart: ${err}`)); 
    
})

router.delete("/MyCart/delete/:id",isLoggedIn,(req,res)=>{
    cartModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/products/MyCart");
    })
    .catch(err=>console.log(`Error happened when updating data from the database in cart :${err}`));
})

router.get("/edit/:id",isLoggedIn,(req,res)=>{    
    productModel.findById(req.params.id)
    .then((product)=>{        
        const {_id,Name,Price,Category,ReleasedDate,Players,BestSeller,productPic,description,Quantity}=product;
        var date=moment(ReleasedDate).format("YYYY-MM-DD");
        res.render("products/editForm",{
            title:"Edit Product",
            headingInfo: "Edit Product",
            _id,Name,Price,Category,ReleasedDate,Players,BestSeller,productPic,date,description,Quantity            
        })
    })
    .catch(err=>console.log(`Error happened when editing for the database: ${err}`));
    
})

router.put("/edit/:id",isLoggedIn,(req,res)=>{    
    const product={
        //body.nameOfSchma
        Name:req.body.Name,
        Price:req.body.Price,
        Category:req.body.Category,
        BestSeller:req.body.BestSeller,
        ReleasedDate:req.body.ReleasedDate,
        Quantity: req.body.Quantity,
        description: req.body.description,
        Players:req.body.Players
    }
    productModel.updateOne({_id:req.params.id},product)
    .then(()=>{
        if(req.session.userInfo.type=="Admin"){
            res.redirect("/products/AdminList");
        }else{
            res.redirect("/products/list"); 
        }        
       
    })
    .catch(err=>console.log(`Error happened when updating for the database: ${err}`)); 
    
})

router.delete("/delete/:id",isLoggedIn,(req,res)=>{
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/products/list");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));
})

router.get("/AdminList",isAdmin,(req,res)=>{
    productModel.find()
    .then((products)=>{        
        const filterProducts=products.map(product=>{
            return{
                id:product._id,
                Name:product.Name,
                Price:product.Price,
                Category:product.Category,
                ReleasedDate:product.ReleasedDate,
                BestSeller:product.BestSeller,
                createBy:product.createBy                
            }
        });
        res.render("products/adminList",{ 
            title:"AdminAccount",
            headingInfo: "AdminAccount",
            data:filterProducts                   
        })
    })
    .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));    
})

router.get("/:id",(req,res)=>{    
    productModel.findOne({_id:req.params.id})
    .then((product)=>{        
        const {_id,Name,Price,Category,ReleasedDate,Players,BestSeller,productPic,description,Quantity}=product;
        var date=moment(ReleasedDate).format('L');
        res.render("products/productDetail",{
            title:req.body.Name,
            headingInfo: "Product",
            _id,Name,Price,Category,date,Players,BestSeller,productPic,description,Quantity            
        })
    })
    .catch(err=>console.log(`Error happened when showing for the database: ${err}`));
    
})

module.exports=router;