import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const registerUser = async (req, res) => {
  // Get userDetails from frontend
  // Validation - not empty
  // Check if user already exists : check by username and email
  // Check for images, check for avatar
  // upload to cloudinary
  // Create user object - create entry in db
  // Remove password and refeshToken from response
  // Check for user creation
  // Return response

  try {
    const { username, email, fullName, password } = req.body;
    console.log(username, email, fullName, password);
    //   if (fullName === ""){
    //     throw new ApiError(400, "Full name cannot be empty.")
    //   } ;
    if (
      [fullName, email, username, password].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new ApiError(400, "All fields are required.");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User already exists.");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    console.log("Got images.");
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required.");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded.");
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("cover image uploaded.");

    if (!avatar) {
      throw new ApiError(500, "Avatar upload failed.");
    }

    try {
      const user = await User.create({
        username: username.toLowerCase(),
        fullname: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: email,
        password: password,
      });
      console.log("User checking");
      const newCreatedUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      if (!newCreatedUser) {
        throw new ApiError(
          500,
          "Something went wrong while registering the user."
        );
      }
      console.log(newCreatedUser);
      return res
        .status(201)
        .json(
          new ApiResponse(200, newCreatedUser, "User registered successfully.")
        );
    } catch (err) {
        console.log(err);
      throw new ApiError(500, "User creation failed.");
    }
  } catch (err) {
    console.log(err);
    return res
      .status(err.statusCode || 500)
      .json(new ApiResponse(err.statusCode, null, err.message));
  }
};

export { registerUser };
