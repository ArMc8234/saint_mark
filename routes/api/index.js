const router = require("express").Router();
const eventRoutes = require("./events");
// const userRoutes = require("./users");
// const usersRoutes = require("./users");
const uploadRoutes = require("./upload");

router.use("/events", eventRoutes);
// router.use("/users",userRoutes);
// router.use("/users",usersRoutes);
router.use("/upload",uploadRoutes);

module.exports = router;
