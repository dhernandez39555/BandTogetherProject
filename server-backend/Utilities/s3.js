const aws = require("aws-sdk");
const crypto = require("crypto");

const region="us-east-1";
const bucketName="aws-bt-upload-dh";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4"
});
console.log(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
const generateUrl = async () => {
    const rawBytes = await crypto.randomBytes(16);
    const imgName = rawBytes.toString("hex");

    const params = {
        Bucket: bucketName,
        Key: imgName,
        Expires: 600
    }

    return await s3.getSignedUrlPromise("putObject", params);
}

module.exports = generateUrl;