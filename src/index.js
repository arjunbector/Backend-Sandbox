import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv';
dotenv.config({path: './.env.local'});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.log("MONGODB connection error: ", err);
});
