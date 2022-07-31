import mongoose from "mongoose";

const dbConnect = (url) => {
  return mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

export default dbConnect;
