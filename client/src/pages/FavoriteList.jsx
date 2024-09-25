import DeleteIcon from "@mui/icons-material/Delete"; // Importing a delete icon from Material UI Icons
import { LoadingButton } from "@mui/lab"; // Importing a button component that can show a loading state
import { Box, Button, Grid } from "@mui/material"; // Importing layout components from Material UI
import { useEffect, useState } from "react"; // Importing React hooks
import { useDispatch } from "react-redux"; // Importing useDispatch hook from Redux
import { toast } from "react-toastify"; // Importing toast for notifications
import MediaItem from "../components/common/MediaItem"; // Importing the MediaItem component for displaying media
import Container from "../components/common/Container"; // Importing the Container component for structured content
import uiConfigs from "../configs/ui.configs"; // Importing UI configurations
import favoriteApi from "../api/modules/favorite.api"; // Importing API module for favorite operations
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"; // Importing action to set global loading state
import { removeFavorite } from "../redux/features/userSlice"; // Importing action to remove a favorite from the Redux store

const FavoriteItem = ({ media, onRemoved }) => {
  const dispatch = useDispatch(); // Get the dispatch function from Redux

  const [onRequest, setOnRequest] = useState(false); // State to manage the loading state of the button
  
   // Function to handle the removal of a favorite item
  const onRemove = async () => {
    if (onRequest) return; // Prevent duplicate requests
    setOnRequest(true); // Set the request state to true
    const { response, err } = await favoriteApi.remove({ favoriteId: media.id }); // Call API to remove favorite
    setOnRequest(false); // Reset the request state

    if (err) toast.error(err.message); // Show error message if there's an error
    if (response) {
      toast.success("Remove favorite success"); // Show success message
      dispatch(removeFavorite({ mediaId: media.mediaId })); // Dispatch action to remove favorite from Redux store
      onRemoved(media.id); // Callback to update the list in the parent component
    }
  };

  return (<>
    {/* Display the media item */}
    <MediaItem media={media} mediaType={media.mediaType} />
    {/* Button to remove the media item from favorites */}
    <LoadingButton
      fullWidth
      variant="contained"
      sx={{ marginTop: 2 }}
      startIcon={<DeleteIcon />}
      loadingPosition="start"
      loading={onRequest} // Show loading state if onRequest is true
      onClick={onRemove} // Attach onClick event to the onRemove function
    >
      remove
    </LoadingButton>
  </>);
};

const FavoriteList = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]); // State to store all favorite media items
  const [page, setPage] = useState(1); // State to manage the current page
  const [count, setCount] = useState(0); // State to store the total count of favorite items

  const dispatch = useDispatch(); // Get the dispatch function from Redux

  const skip = 8; // Number of items to display per page
  
  // Effect to fetch the list of favorite items when the component mounts
  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setGlobalLoading(true)); // Set global loading state to true
      const { response, err } = await favoriteApi.getList(); // Fetch list of favorite items using API
      dispatch(setGlobalLoading(false)); // Set global loading state to false

      if (err) toast.error(err.message); // Show error message if there's an error
      if (response) {
        setCount(response.length); // Set the total count of favorite items
        setMedias([...response]); // Update medias state with the fetched items
        setFilteredMedias([...response].splice(0, skip)); // Update filteredMedias state with the initial set of items
      }
    };

    getFavorites();
  }, []);
  
  // Function to load more favorite items
  const onLoadMore = () => {
    setFilteredMedias([...filteredMedias, ...[...medias].splice(page * skip, skip)]); // Append the next set of items to the filteredMedias state
    setPage(page + 1); // Increment the page number
  };
  
  // Function to handle the removal of a media item from the list
  const onRemoved = (id) => {
    const newMedias = [...medias].filter(e => e.id !== id); // Filter out the removed item from medias state
    setMedias(newMedias); // Update medias state
    setFilteredMedias([...newMedias].splice(0, page * skip)); // Update filteredMedias state
    setCount(count - 1); // Decrement the total count
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}> {/* Main content area */}
      <Container header={`Your favorites (${count})`}> {/* Container with a header showing the total count */}
        <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}> {/* Grid layout for media items */}
          {filteredMedias.map((media, index) => ( // Map through filtered media items
            <Grid item xs={6} sm={4} md={3} key={index}> {/* Responsive grid item */}
              <FavoriteItem media={media} onRemoved={onRemoved} /> {/* Render FavoriteItem component */}
            </Grid>
          ))}
        </Grid>
        {filteredMedias.length < medias.length && ( // Show "load more" button if there are more items to load
          <Button onClick={onLoadMore}>load more</Button>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteList; // Export the FavoriteList component as the default export