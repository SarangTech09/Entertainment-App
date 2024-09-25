import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";

import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/features/userSlice";

import CastSlide from "../components/common/CastSlide";
import MediaVideosSlide from "../components/common/MediaVideosSlide";
import BackdropSlide from "../components/common/BackdropSlide";
import PosterSlide from "../components/common/PosterSlide";
import RecommendSlide from "../components/common/RecommendSlide";
import MediaSlide from "../components/common/MediaSlide";
import MediaReview from "../components/common/MediaReview";

// Main component for displaying media details
const MediaDetail = () => {
  const { mediaType, mediaId } = useParams(); // Get mediaType and mediaId from URL params

  const { user, listFavorites } = useSelector((state) => state.user); // Get user and favorites from Redux store

  const [media, setMedia] = useState(); // State to hold media details
  const [isFavorite, setIsFavorite] = useState(false); // State to track if the media is a favorite
  const [onRequest, setOnRequest] = useState(false); // State to handle loading state for favorite requests
  const [genres, setGenres] = useState([]); // State to store media genres

  const dispatch = useDispatch(); // Redux dispatch function

  const videoRef = useRef(null); // Ref to scroll to the video section


  useEffect(() => {  // Scroll to top when component mounts
    window.scrollTo(0, 0);

     // Function to fetch media details
    const getMedia = async () => {
      dispatch(setGlobalLoading(true)); // Set global loading state to true
      const { response, err } = await mediaApi.getDetail({ mediaType, mediaId }); 
      dispatch(setGlobalLoading(false)); // Unset global loading state

      // Update state with response data
      if (response) {
        setMedia(response);
        setIsFavorite(response.isFavorite);
        setGenres(response.genres.splice(0, 2));
      }
      
      // Display error message if any error occurs
      if (err) toast.error(err.message);
    };

    getMedia(); // Fetch media details on component mount
  }, [mediaType, mediaId, dispatch]);

  // Handler for adding/removing favorites
  const onFavoriteClick = async () => {
    // Show authentication modal if user is not logged in
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return; // Prevent multiple requests

    if (isFavorite) {
      onRemoveFavorite(); // Remove from favorites if already favorited
      return;
    }

    setOnRequest(true); // Set request state to true

    // Prepare data to be sent to the API
    const body = {
      mediaId: media.id,
      mediaTitle: media.title || media.name,
      mediaType: mediaType,
      mediaPoster: media.poster_path,
      mediaRate: media.vote_average
    };

    const { response, err } = await favoriteApi.add(body);  // Send add favorite request

    setOnRequest(false); // Unset request state

    // Display error message if any error occurs
    if (err) toast.error(err.message);
    if (response) {
      dispatch(addFavorite(response)); // Update Redux store with new favorite
      setIsFavorite(true); // Update local state
      toast.success("Add favorite success");
    }
  };

  // Handler for removing favorites
  const onRemoveFavorite = async () => {
    if (onRequest) return; // Prevent multiple requests
    setOnRequest(true); // Set request state

    const favorite = listFavorites.find(e => e.mediaId.toString() === media.id.toString());

    const { response, err } = await favoriteApi.remove({ favoriteId: favorite.id });  // Send remove favorite request


    setOnRequest(false); // Unset request state

    // Display error message if any error occurs
    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite)); // Update Redux store to remove favorite
      setIsFavorite(false); // Update local state
      toast.success("Remove favorite success");
    }
  };

  return (
    media ? (
      <>
        <ImageHeader imgPath={tmdbConfigs.backdropPath(media.backdrop_path || media.poster_path)} />
        <Box sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent
        }}>
          {/* media content */}
          <Box sx={{
            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" }
          }}>
            <Box sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" }
            }}>
              {/* poster */}
              <Box sx={{
                width: { xs: "70%", sm: "50%", md: "40%" },
                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" }
              }}>
                <Box sx={{
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(tmdbConfigs.posterPath(media.poster_path || media.backdrop_path))
                }} />
              </Box>
              {/* poster */}

              {/* media info */}
              <Box sx={{
                width: { xs: "100%", md: "60%" },
                color: "text.primary"
              }}>
                <Stack spacing={5}>
                  {/* title */}
                  <Typography
                    variant="h4"
                    fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                    fontWeight="700"
                    sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                  >
                    {`${media.title || media.name} ${mediaType === tmdbConfigs.mediaType.movie ? media.release_date.split("-")[0] : media.first_air_date.split("-")[0]}`}
                  </Typography>
                  {/* title */}

                  {/* rate and genres */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* rate */}
                    <CircularRate value={media.vote_average} />
                    {/* rate */}
                    <Divider orientation="vertical" />
                    {/* genres */}
                    {genres.map((genre, index) => (
                      <Chip
                        label={genre.name}
                        variant="filled"
                        color="primary"
                        key={index}
                      />
                    ))}
                    {/* genres */}
                  </Stack>
                  {/* rate and genres */}

                  {/* overview */}
                  <Typography
                    variant="body1"
                    sx={{ ...uiConfigs.style.typoLines(5) }}
                  >
                    {media.overview}
                  </Typography>
                  {/* overview */}

                  {/* buttons */}
                  <Stack direction="row" spacing={1}>
                    <LoadingButton
                      variant="text"
                      sx={{
                        width: "max-content",
                        "& .MuiButon-starIcon": { marginRight: "0" }
                      }}
                      size="large"
                      startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                      loadingPosition="start"
                      loading={onRequest}
                      onClick={onFavoriteClick}
                    />
                    <Button
                      variant="contained"
                      sx={{ width: "max-content" }}
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => videoRef.current.scrollIntoView()}
                    >
                      watch now
                    </Button>
                  </Stack>
                  {/* buttons */}

                  {/* cast */}
                  <Container header="Cast">
                    <CastSlide casts={media.credits.cast} />
                  </Container>
                  {/* cast */}
                </Stack>
              </Box>
              {/* media info */}
            </Box>
          </Box>
          {/* media content */}

          {/* media videos */}
          <div ref={videoRef} style={{ paddingTop: "2rem" }}>
            <Container header="Videos">
              <MediaVideosSlide videos={[...media.videos.results].splice(0, 5)} />
            </Container>
          </div>
          {/* media videos */}

          {/* media backdrop */}
          {media.images.backdrops.length > 0 && (
            <Container header="backdrops">
              <BackdropSlide backdrops={media.images.backdrops} />
            </Container>
          )}
          {/* media backdrop */}

          {/* media posters */}
          {media.images.posters.length > 0 && (
            <Container header="posters">
              <PosterSlide posters={media.images.posters} />
            </Container>
          )}
          {/* media posters */}

          {/* media reviews */}
          <MediaReview reviews={media.reviews} media={media} mediaType={mediaType} />
          {/* media reviews */}

          {/* media recommendation */}
          <Container header="you may also like">
            {media.recommend.length > 0 && (
              <RecommendSlide medias={media.recommend} mediaType={mediaType} />
            )}
            {media.recommend.length === 0 && (
              <MediaSlide
                mediaType={mediaType}
                mediaCategory={tmdbConfigs.mediaCategory.top_rated}
              />
            )}
          </Container>
          {/* media recommendation */}
        </Box>
      </>
    ) : null
  );
};

export default MediaDetail;