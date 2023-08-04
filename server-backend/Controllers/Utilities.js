const router = require("express").Router();
const generateUrl = require("../Utilities/s3");

router.get("/s3-url", async (req, res) => {
    try {
        const s3Url = await generateUrl();
        console.log(s3Url);
        res.status(200).json(s3Url);
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

module.exports = router