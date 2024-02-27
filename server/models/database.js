require('dotenv').config();
const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://Yukendran:yukendran2004@yukendran.k3e5pef.mongodb.net/Recipes?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",function(){
    console.log("Connected");
});

//Models
require("./Category");
require("./Recipe");