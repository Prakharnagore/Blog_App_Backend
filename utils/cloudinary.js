import cloudinary from "cloudinary";

const cloudinaryUploadImg = async (filesToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(filesToUpload, {
      resourse_type: "auto",
    });

    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

export default cloudinaryUploadImg;
