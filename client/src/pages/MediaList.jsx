import { LoadingButton } from "@mui/lab"; // Importing a button that supports loading state from Material UI lab
import { Box, Button, Stack, Typography } from "@mui/material"; // Importing layout and UI components from Material UI
import { useEffect, useState, useMemo } from "react"; // Importing React hooks
import { useDispatch } from "react-redux"; // Importing useDispatch hook from Redux
import { useParams } from "react-router-dom"; // Importing useParams hook from React Router to access route parameters
import tmdbConfigs from "../api/configs/tmdb.configs"; // Importing TMDB API configurations
import mediaApi from "../api/modules/media.api"; // Importing media API module
import uiConfigs from "../configs/ui.configs"; // Importing UI configurations
import HeroSlide from "../components/common/HeroSlide"; // Importing the HeroSlide component
import MediaGrid from "../components/common/MediaGrid"; // Importing the MediaGrid component
import { setAppState } from "../redux/features/appStateSlice"; // Importing action to set the app state in Redux
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"; // Importing action to set global loading state in Redux
import { toast } from "react-toastify"; // Importing toast notifications
import usePrevious from "../hooks/usePrevious"; // Importing a custom hook to track the previous value of a variable

const MediaList = () => {
  const { mediaType } = useParams(); // Extracting the mediaType parameter from the route

  const [medias, setMedias] = useState([]); // State to store the list of media items
  const [mediaLoading, setMediaLoading] = useState(false); // State to manage the loading state of media items
  const [currCategory, setCurrCategory] = useState(0); // State to manage the current category index
  const [currPage, setCurrPage] = useState(1); // State to manage the current page number

  const prevMediaType = usePrevious(mediaType); // Using a custom hook to get the previous mediaType
  const dispatch = useDispatch(); // Getting the dispatch function from Redux

  const mediaCategories = useMemo(() => ["popular", "top_rated"], []); // Memoized array of media categories
  const category = ["popular", "top rated"]; // Array of category labels for UI

  useEffect(() => {
    dispatch(setAppState(mediaType)); // Dispatching action to set the app state based on mediaType
    window.scrollTo(0, 0); // Scrolling the window to the top
  }, [mediaType, dispatch]);

  useEffect(() => {
    const getMedias = async () => {
      if (currPage === 1) dispatch(setGlobalLoading(true)); // Setting global loading state to true if it's the first page
      setMediaLoading(true); // Setting media loading state to true

      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory: mediaCategories[currCategory],
        page: currPage,
      }); // Fetching media items based on the current category and page

      setMediaLoading(false); // Setting media loading state to false
      dispatch(setGlobalLoading(false)); // Setting global loading state to false

      if (err) toast.error(err.message); // Displaying error message if there's an error
      if (response) {
        if (currPage !== 1)
          setMedias((m) => [
            ...m,
            ...response.results,
          ]); // Appending new media items if it's not the first page
        else setMedias([...response.results]); // Setting media items if it's the first page
      }
    };

    if (mediaType !== prevMediaType) {
      setCurrCategory(0); // Resetting category index if mediaType has changed
      setCurrPage(1); // Resetting page number if mediaType has changed
    }

    getMedias(); // Calling the function to fetch media items
  }, [
    mediaType,
    currCategory,
    prevMediaType,
    currPage,
    mediaCategories,
    dispatch,
  ]);

  // Function to handle category change
  const onCategoryChange = (categoryIndex) => {
    if (currCategory === categoryIndex) return; // If the selected category is the same as the current one, do nothing
    setMedias([]); // Clear media items
    setCurrPage(1); // Reset page number
    setCurrCategory(categoryIndex); // Update current category index
  };

  // Function to load more media items
  const onLoadMore = () => setCurrPage(currPage + 1); // Increment page number

  return (
    <>
      {/* Hero slide component displaying media based on type and category */}
      <HeroSlide
        mediaType={mediaType}
        mediaCategory={mediaCategories[currCategory]}
      />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        {" "}
        {/* Main content area with custom styles */}
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: 4 }}
        >
          {/* Typography component displaying the title based on media type */}
          <Typography fontWeight="700" variant="h5">
            {mediaType === tmdbConfigs.mediaType.movie ? "Movies" : "TV Series"}
          </Typography>
          {/* Stack component containing category buttons */}
          <Stack direction="row" spacing={2}>
            {category.map((cate, index) => (
              <Button
                key={index}
                size="large"
                variant={currCategory === index ? "contained" : "text"} // Conditional styling based on the current category
                sx={{
                  color:
                    currCategory === index
                      ? "primary.contrastText"
                      : "text.primary",
                }}
                onClick={() => onCategoryChange(index)} // Event handler for category change
              >
                {cate}
              </Button>
            ))}
          </Stack>
        </Stack>
        {/* MediaGrid component displaying the media items */}
        <MediaGrid medias={medias} mediaType={mediaType} />
        {/* Loading button to load more media items */}
        <LoadingButton
          sx={{ marginTop: 8 }}
          fullWidth
          color="primary"
          loading={mediaLoading}
          onClick={onLoadMore}
        >
          load more
        </LoadingButton>
      </Box>
    </>
  );
};

export default MediaList; // Exporting the MediaList component as the default export
