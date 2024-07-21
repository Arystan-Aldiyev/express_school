const AWS = require('aws-sdk');
const multer = require('multer');
const conf = require("../config/aws.config");

AWS.config.update({
    accessKeyId: conf.awsAccessKeyId,
    secretAccessKey: conf.awsSecretKey,
    region: conf.awsRegion
});

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const s3 = new AWS.S3();

module.exports = {upload, s3};
