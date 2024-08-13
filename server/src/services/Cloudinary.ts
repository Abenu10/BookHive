const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnizoc474',
  api_key: '795331495625983',
  api_secret: 'i2rxrHo8P08K65pfFc3SPcX6Z3E',
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
}

const uploadToCloudinary = (
  path: string,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return cloudinary.uploader
    .upload(path, {
      resource_type: 'auto',
      folder,
    })
    .then((data: CloudinaryUploadResult) => {
      return {
        secure_url: data.secure_url,
        public_id: data.public_id,
        format: data.format,
      };
    })
    .catch((error: Error) => {
      console.error(error);
      throw error;
    });
};

const removeFromCloudinary = async (public_id: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log(
      `Deleted image from Cloudinary with public ID: ${public_id}`,
      result
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {uploadToCloudinary, removeFromCloudinary};
