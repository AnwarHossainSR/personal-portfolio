import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (
  fileUri: string,
  fileName: string,
  subFolder: string | null = null
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: 'auto',
        filename_override: fileName,
        folder: subFolder ? `portfolioanwar/${subFolder}` : 'portfolioanwar',
        use_filename: true,
      })
      .then(result => {
        resolve({ success: true, result });
      })
      .catch(error => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ success: false, error });
      });
  });
};

export { cloudinary, uploadToCloudinary };
