const express = require("express");
const router = express.Router();
const Role = require("../model/role");

router.post("/", async (req, res) => {

    try {

        const role = new Role({
            name: req.body.name,
            description: req.body.description
        });

        await role.save();

        res.json({
            success: true,
            data: role
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;