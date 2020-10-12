const router = require("express").Router();
const galleriesController = require("../../controllers/galleriesController");

// TODO: Need to configure and understand routes to DB and how each realationsip. 
// Matches with "/api/galleries"
router.route("/")
  .get(galleriesController.findAll)
  .post(galleriesController.create);

// Matches with "/api/galleries/:id"
router
  .route("/:id")
  .get(galleriesController.findById)
  .put(galleriesController.update)
  .delete(galleriesController.remove);

module.exports = router;