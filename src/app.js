const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config/database")
const {PORT,DATABASE_URL} = require("./config/serverConfig");
const Database = require("./config/database");

const {PORT} = require("./config/serverConfig")

const app = express();
const db = new Database(DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

db.connect()
      .catch((err)=>console.err("Error connecting to database:", err)
);


app.use(bodyParser.urlencoded({urlencoded:true}));
app.use(bodyParser.json());

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
   
})

