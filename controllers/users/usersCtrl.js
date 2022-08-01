import User from "../../model/user/User.js";
import expressAsyncHandler from "express-async-handler";
import generateToken from "../../config/token/generateToken.js";
import validateMongodbId from "../../utils/validateMongoDbID.js";

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) {
    throw new Error("User already exists");
  }
  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json({ user });
  } catch (error) {
    res.json({ error });
  }
});

const userLoginCtrl = expressAsyncHandler(async (req, res) => {
  const userFound = await User.findOne({ email: req?.body?.email });
  if (userFound && (await userFound.isPasswordMatched(req?.body?.password))) {
    res.json({
      _id: userFound._id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
      profilePhoto: userFound.profilePhoto,
      isAdmin: userFound.isAdmin,
      token: generateToken(userFound._id),
    });
  } else {
    res.status(401);
    throw new Error(`Login failed`);
  }
});

const fetchUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  validateMongodbId(req?.params?.id);
  try {
    const user = await User.findByIdAndDelete(req?.params?.id);
    res.json("deleted Successfully");
  } catch (error) {
    res.json(error);
  }
});

const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  validateMongodbId(req?.params?.id);
  try {
    const user = await User.findById(req?.params?.id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  validateMongodbId(req?.params?.id);
  try {
    const myProfile = await User.findById(req?.params?.id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  validateMongodbId(req?.user?._id);
  try {
    const myProfile = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  validateMongodbId(req?.user?._id);
  try {
    const user = await User.findById(req?.user?._id);
    if (user) {
      user.password = req?.body?.password;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      throw new Error("User Doesn't exist");
    }
  } catch (error) {
    res.json(error);
  }
});

export {
  userRegisterCtrl,
  userLoginCtrl,
  fetchUserCtrl,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
};
