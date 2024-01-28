import { v2 as cloudinary } from "cloudinary";
import fs, { rmSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null;
        //uplaod file on cloudinary
        console.log("uploading file");
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded
        console.log("File is uploaded on cloudinary...", response.url);
        console.log("Deleting file from local storage");
        fs.unlinkSync(localFilePath); //Removes the file from local storage as the file is uploaded.
        return response;
    }
    catch(err){
        console.log("file upload failed");
        fs.unlinkSync(localFilePath); //Removes the file from local storage as upload failed.
        return null;
    }
}

export default uploadOnCloudinary;