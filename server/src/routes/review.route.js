import express from "express";
import { body } from "express-validator";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tokenMiddleware.auth,
  reviewController.getReviewsOfUser
);

router.post(
  "/",
  tokenMiddleware.auth,
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .notEmpty().withMessage("mediaId cannot be empty"),
  body("content")
    .exists().withMessage("content is required")
    .notEmpty().withMessage("content cannot be empty"),
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .isIn(["movie", "tv"]).withMessage("Invalid mediaType"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  requestHandler.validate, // Ensure this middleware correctly handles validation errors
  reviewController.create
);


router.delete(
  "/:reviewId",
  tokenMiddleware.auth,
  reviewController.remove
);

export default router;