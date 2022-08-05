import User from "../../model/user/User.js";
import expressAsyncHandler from "express-async-handler";
import generateToken from "../../config/token/generateToken.js";
import validateMongodbId from "../../utils/validateMongoDbID.js";
import sendMail from "../../utils/sendMail.js";
import crypto from "crypto";

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

const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  // FIND THE TARGET USER AND CHECK IF THE LOGIN ID EXISTS
  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId?.toString()
  );

  if (alreadyFollowing) {
    throw new Error("You have already followed this user");
  }

  // FIND THE USER YOU WANT TO FOLLOW AND UPDATE IT'S FOLLOWERS FIELD
  await User.findByIdAndUpdate(
    followId,
    {
      $push: {
        followers: loginUserId,
      },
      isFollowing: true,
    },
    {
      new: true,
    }
  );

  // FIND THE LOGIN USER FOLLOWING FIELD
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: {
        following: followId,
      },
    },
    {
      new: true,
    }
  );

  res.json("You have successfully followed User");
});

const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const { unFollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unFollowId,
    {
      $pull: {
        followers: loginUserId,
      },
      isFollowing: false,
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: {
        following: unFollowId,
      },
    },
    {
      new: true,
    }
  );
  res.json("You have successfully unfollowed this User");
});

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.json(user);
});

const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.json(user);
});

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  const loginUser = req.user.id;
  const user = await User.findById(loginUser);
  const verificationToken = await user.createAccountVerificationToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/verify-account/${verificationToken}`;
  const text = `Verify you Blog App Account in 10min:- <a href="${resetUrl}">Click To Verify</a> `;

  try {
    await sendMail({
      email: user.email,
      subject: `Blog App Verification`,
      text,
    });
    res.json("email send");
  } catch (error) {
    res.json(error);
  }
});

const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: {
      $gt: Date.now(),
    },
  });

  if (!userFound) {
    throw new Error("Token Expired");
  }

  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
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
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
};
