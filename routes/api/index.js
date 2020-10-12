const router = require("express").Router();
const eventRoutes = require("./events");
// const userRoutes = require("./users");
// const usersRoutes = require("./users");
const uploadRoutes = require("./upload");
const galleriesRoutes = require("./galleries");

router.use("/events", eventRoutes);
// router.use("/users",userRoutes);
// router.use("/users",usersRoutes);
router.use("/upload",uploadRoutes);
router.use("/galleries",galleriesRoutes);

module.exports = router;
