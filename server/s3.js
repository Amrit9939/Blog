import dotenv from 'dotenv';
dotenv.config();

const fs = require('fs');

const S3 = require('aws-sdk/clients/s3');

const bucketName="amritblog"
const region="us-east-1"
const accessKeyId=""
const secretAccessKey=""

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

function uploadFile1(path){
  const fileStream = fs.createReadStream(path);
  console.log(process.env.AWS_BUCKET_NAME);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: path.slice(3,)
  }
  return s3.upload(uploadParams).promise();

}
exports.uploadFile1 = uploadFile1;




// download a file from s3

function getFile(filekey){
  const downloadParams = {
    Key: filekey,
    Bucket:bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFile = getFile
