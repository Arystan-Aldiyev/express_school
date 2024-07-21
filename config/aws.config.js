require('dotenv').config();

module.exports = {
    awsSecretKey: process.env.AWS_SECRET_KEY,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucketName: process.env.AWS_BUCKET_NAME,
};
