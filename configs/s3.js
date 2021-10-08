import AWS from "aws-sdk";
import { v4 } from "uuid";

import { awsCredentials } from "./constants.js";

const s3Client = new AWS.S3({
  accessKeyId: awsCredentials.id,
  secretAccessKey: awsCredentials.secret_key,
});

const uploadParams = {
  Bucket: awsCredentials.bucket_name,
  Key: "", // pass key
  Body: null, // pass file body
  ACL: "public-read",
};

const uploadFile = async (file) => {
  const myFileName = file.originalname.split(".");
  const fileType = myFileName[myFileName.length - 1];
  (uploadParams.Key = `${v4()}.${fileType}`), (uploadParams.Body = file.buffer);
  let data = await s3Client.upload(uploadParams).promise();
  return data;
};
export default uploadFile;

export const deleteFile = async (imageUrl) => {
  let pathname = new URL(imageUrl).pathname;
  uploadParams.Key = pathname.slice(1);
  let deletedFile = await s3Client.deleteObjects(
    {
      Bucket: uploadParams.Bucket,
      Delete: { Objects: [{ Key: uploadParams.Key }] },
    },
    function (err, data) {
      if (err) console.log(err, err.stack);
    }
  );
};
