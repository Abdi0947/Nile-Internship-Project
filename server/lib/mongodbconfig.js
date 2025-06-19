const mongoose=require("mongoose")


require("dotenv").config()

module.exports.MongoDBconfig=()=>{
    mongoose
      .connect('mongodb://localhost:27017/test')
      .then(() => {
        console.log("connected to database successfully");
      })
      .catch((err) => {
        console.log("MonogoDB Connection Error", err);
      });

}