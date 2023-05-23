const router = require("express").Router();

router.get("/test", (req, res) => {
    console.log("test router")
})

module.exports = router;