import { LoadingButton } from "@mui/lab"; // Import a button that shows a loading indicator
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material"; // Import various components from Material UI
import { useState, useEffect, useCallback } from "react"; // Import React hooks
import { toast } from "react-toastify"; // Import toast notifications
import mediaApi from "../api/modules/media.api"; // Import media API for fetching media data
import MediaGrid from "../components/common/MediaGrid"; // Import a component to display media items in a grid
import uiConfigs from "../configs/ui.configs"; // Import UI configuration

// Define the available media types for searching
const mediaTypes = ["movie", "tv", "people"];
let timer; // Timer variable for debouncing search input
const timeout = 500; // Timeout duration for the debounce

const MediaSearch = () => {
  const [query, setQuery] = useState(""); // State for the search query
  const [onSearch, setOnSearch] = useState(false); // State to manage the loading state of the search
  const [mediaType, setMediaType] = useState(mediaTypes[0]); // State for the selected media type, default to "movie"
  const [medias, setMedias] = useState([]); // State to store the list of media items
  const [page, setPage] = useState(1); // State to manage the current page number

  // Search function that fetches data from the API
  const search = useCallback(
    async () => {
      setOnSearch(true); // Set the search state to true to show loading indicator

      const { response, err } = await mediaApi.search({
        mediaType,
        query,
        page,
      }); // Fetch data based on media type, query, and page number

      setOnSearch(false); // Set the search state to false after the API call

      if (err) toast.error(err.message); // Show error toast if there's an error
      if (response) {
        if (page > 1)
          setMedias((m) => [
            ...m,
            ...response.results,
          ]); // Append new results if not the first page
        else setMedias([...response.results]); // Set new results if it's the first page
      }
    },
    [mediaType, query, page] // Dependencies for useCallback
  );

  useEffect(() => {
    if (query.trim().length === 0) {
      // If query is empty, clear the media list and reset the page
      setMedias([]);
      setPage(1);
    } else search(); // Otherwise, perform the search
  }, [search, query, mediaType, page]); // Dependencies for useEffect

  useEffect(() => {
    setMedias([]); // Clear the media list when the media type changes
    setPage(1); // Reset the page number when the media type changes
  }, [mediaType]); // Dependency for useEffect

  // Handler for changing the selected media type
  const onCategoryChange = (selectedCategory) => setMediaType(selectedCategory);

  // Handler for changing the search query with debounce
  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer); // Clear the previous timer

    timer = setTimeout(() => {
      setQuery(newQuery); // Set the query after the timeout
    }, timeout);
  };

  return (
    <>
      <Toolbar /> {/* Empty toolbar for spacing */}
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        {" "}
        {/* Main content area with custom styles */}
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            {/* Buttons for selecting media types */}
            {mediaTypes.map((item, index) => (
              <Button
                size="large"
                key={index}
                variant={mediaType === item ? "contained" : "text"}
                sx={{
                  color:
                    mediaType === item
                      ? "primary.contrastText"
                      : "text.primary",
                }}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </Button>
            ))}
          </Stack>
          <TextField
            color="success"
            placeholder="Search MoodFlix"
            sx={{ width: "100%" }}
            autoFocus
            onChange={onQueryChange}
          />

          <MediaGrid medias={medias} mediaType={mediaType} />

          {medias.length > 0 && (
            <LoadingButton loading={onSearch} onClick={() => setPage(page + 1)}>
              load more
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;
