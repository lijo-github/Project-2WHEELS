const userSchema = require("../model/userModel");
const Category = require("../model/category");
const Product = require("../model/product.js")
const Banner = require("../model/banner")
const {Order, Address,OderItem} = require("../model/order")

module.exports = {
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            try {
                var validAdmin = await userSchema.findOne({ email: adminData.email });
            } catch (err) {
                console.error(err);
            }
            if (validAdmin) {
                if (validAdmin.isAdmin) {
                    response.validAdmin = validAdmin;
                    response.status = true;
                    resolve(response);
                } else {
                    console.log("login Failed");
                    resolve({ status: false });
                }
            } else {
                console.log("NO Admin Found");
                resolve({ status: false });
            }
        });
    },
    getAllusers: (status) => {
        return new Promise(async (resolve, reject) => {
            if (status) {
                let filter = {};
                status === "active" ? (filter.status = true) : status === "inactive" ? (filter.status = false) : filter;
                try {
                    let users = await userSchema.find({ status: filter.status })
                    resolve(users);
                } catch (err) {
                    console.error(err);
                }
            } else {
                try {
                    let users = await userSchema.find({});
                    resolve(users);
                } catch (err) {
                    console.error(err);
                }
            }
        });
    },

    getUsercount:async()=>{
      const count = await userSchema.find({}).countDocuments();
      return count;

    },
    blockUser: async(userId)=>{
        try{
            const user = await userSchema.findById(userId);
            user.status = false;
            await user.save();
            console.log(`User with ID $ {userId} has been blocked`);

        }catch(error){
            console.error(error);
            throw new Error("Failed to block user")
        }
    },
    unblockUser: async(userId)=>{
        try {
            const user = await userSchema.findById(userId);
            user.status = true;
            await user.save();
            console.log(`User with ID ${userId} has been unblocked`);
          } catch (error) {
            console.error(error);
            throw new Error("Failed to unblock user");
          }
    },
    getAllCategory: async () => {
        try {
          let viewCategory = await Category.find({});
          return viewCategory;
        } catch (err) {
          console.error(err);
        }
      },
      addCategory: async (category) => {
        try {
          const existingCategory = await Category.findOne({
            CategoryName: category.CategoryName.toUpperCase(),
          });
    
          if (existingCategory) {
            const updatedCategory = await Category.findByIdAndUpdate(
              existingCategory._id,
              {
                CategoryName: category.CategoryName.toUpperCase(),
              },
              { new: true }
            );
    
            return updatedCategory;
          } else {
            // Create a new category
            const newCategory = new Category({
              CategoryName: category.CategoryName,
              CategoryDescription: category.CategoryDescription,
            });
            await newCategory.save();
            return;
          }
        } catch (error) {
          console.error("Error updating category:", error);
        }
      },
      editCategory: async (categoryName, id) => {
        console.log(id);
        try {
          const existingCategory = await Category.findByIdAndUpdate(
            id,
            {
              CategoryName: categoryName.toUpperCase(),
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
        }
      },
      deleteCategory: async (categoryId) => {
        try {
          await Category.findByIdAndUpdate(
            categoryId,
            {
              isListed: false,
            },
            { new: true }
          );
          return;
        } catch (err) {
          console.error(err);
        }
      },
      listCategory: async (categoryId) => {
        try {
          await Category.findByIdAndUpdate(
            categoryId,
            {
              isListed: true,
            },
            { new: true }
          );
          return;
        } catch (err) {
          console.error(err);
        }
      },
      addProducts: async (productData) => {
        try {
          console.log("sasasas");
          const newProducts = new Product({
            productModel: productData.productModel,
    
            productName: productData.productName,
    
            productPrice: productData.productPrice,
    
            productDescription: productData.productDescription,
    
            productQuantity: productData.productQuantity,
    
            productColor: productData.productColor,
    
            productImage: productData.productImages,
    
            productStatus: productData.productStatus,
    
            category: productData.Category,
          });
    
          await newProducts.save();
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
      getAllProducts: async () => {
        try {
          
          
          const products = await Product.find({})
          return products;
         
        } catch (err) {
          console.error(err);
        }
      },
      getProductsCount: async () => {
        try {
          
          const count = await Product.find({}).countDocuments();
          return count;
         
        } catch (err) {
          console.error(err);
        }
      },
      getProductDetails: async (proId) => {
        try {
          const product = await Product.findById(proId);
          return product;
        } catch (err) {
          console.error(err);
        }
      },
      updateProducts: async (productData, proID) => {
        let update = {};
        if (productData.productImages && productData.productImages.length > 0) {
          update.productImage = productData.productImages;
        }
        try {
          await Product.findByIdAndUpdate(
            proID,
            {
              productModel: productData.productModel,
    
              productName: productData.productName,
    
              productPrice: productData.productPrice,
    
              productDescription: productData.productDescription,
    
              productQuantity: productData.productQuantity,
    
              productColor: productData.productColor,
    
              ...update,
    
              productStatus: productData.productStatus,
            },
            { new: true }
          );
    
          return;
        } catch (err) {
          console.error(err);
        }
      },
      unlistProduct: async (proID) => {
        try {
          await Product.findByIdAndUpdate(
            proID,
            { productStatus: "Unlisted" },
            { new: true }
          );
        } catch (err) {
          console.error(err);
        }
      },
      getOrderDetails: async () => {
        try {
          const order = await Order.find({})
            .populate("address")
            .populate("items.product_id")
            .exec();
          if (order.length === 0) {
            console.log("No orders found for user");
          } else {
            return order;
          }
        } catch (err) {
          console.error(err);
        }
      },

      addBanner: async(data)=>{
        try{
          const newBanner = new Banner({
            headline: data.headline,
            image: data.Image,
            category: data.Category,
            additionalInfo: data.productDescription,
          })
          await newBanner.save();

        }catch(err){
          console.error(err);
        }
        
      },
      getAllBanner: async()=>{
        try{
          const banners = await Banner.find({}).populate("category");
          return banners;

        }catch(err){
          console.error(err);
        }
      },
      removeBanner: async(id)=>{
        try{
          const banners = await Banner.findByIdAndUpdate(id,{status:false},{new:true});
          return banners;
        }catch(err){
          console.error(err);
        }
      },
      listBanner: async(id) =>{
        try{
          const banner = await Banner.findByIdAndUpdate(id,{status:true},{new:true});
<<<<<<< HEAD
          return banner;
=======
          return banner
>>>>>>> 0b7da8e43902f1241da174055d35b7e32691b06d
        }catch(err){
          console.error(err);
        }
      },


    
};
