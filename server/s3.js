import dotenv from 'dotenv';
dotenv.config();

const fs = require('fs');

const S3 = require('aws-sdk/clients/s3');

const bucketName="amritblog"
const region="us-east-1"
const accessKeyId="AKIAT5G6HJ6HSQRVAWHJ"
const secretAccessKey="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"

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// upload a file to s3
function uploadFile(file){
  const fileStream = fs.createReadStream(file.path);
  console.log(process.env.AWS_BUCKET_NAME);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }
  return s3.upload(uploadParams).promise();

}
exports.uploadFile = uploadFile;


// download a file from s3

function getFile(filekey){
  const downloadParams = {
    Key: filekey,
    Bucket:bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFile = getFile
