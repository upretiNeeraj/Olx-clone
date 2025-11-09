const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const fileUploaderOnClouinary = async (filePath) => {
    try {
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        console.log("response =>", response);
        return response

    } catch (error) {
        console.error("error while uploading =>", error);
        return null;
    }
}


module.exports = fileUploaderOnClouinary;
