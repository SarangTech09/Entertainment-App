import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

const create = async (req, res) => {
  try {
    // Log the request body to inspect the data
    console.log("Incoming request body:", req.body);

    // Destructure the expected fields from the request body
    const { mediaId, mediaType, mediaTitle, mediaPoster, content } = req.body;

    // Validate that all necessary fields exist
    if (!mediaId || !content || !mediaType || !mediaTitle || !mediaPoster) {
      return responseHandler.error(res, { message: "Missing required fields" });
    }

    const review = new reviewModel({
      user: req.user.id,
      mediaId,
      mediaType,
      mediaTitle,
      mediaPoster,
      content
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    });
  } catch (error) {
    console.error("Error creating review:", error);
    responseHandler.error(res);
  }
};


const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) {
      return responseHandler.notfound(res, { message: "Review not found" });
    }

    await review.deleteOne(); // Use deleteOne instead of remove

    responseHandler.ok(res, { message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error removing review:", error);
    responseHandler.error(res, { message: "Internal Server Error" });
  }
};

const getReviewsOfUser = async (req, res) => {
  try {
    const reviews = await reviewModel.find({
      user: req.user.id
    }).sort("-createdAt");

    responseHandler.ok(res, reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewsOfUser };
