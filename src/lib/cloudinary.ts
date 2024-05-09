import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { cloudinary } from './cloudinaryConfig';
type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

export const uploadToCloudinary = (
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