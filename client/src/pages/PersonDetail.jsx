import { Box, Toolbar, Typography, Stack } from "@mui/material"; // Import Material UI components for layout and styling
import { useEffect, useState } from "react"; // Import React hooks
import { useParams } from "react-router-dom"; // Import hook to access route parameters
import PersonMediaGrid from "../components/common/PersonMediaGrid"; // Import a custom component to display media related to the person
import tmdbConfigs from "../api/configs/tmdb.configs"; // Import configurations specific to the TMDb API
import uiConfigs from "../configs/ui.configs"; // Import UI configurations
import Container from "../components/common/Container"; // Import a custom Container component for consistent layout
import personApi from "../api/modules/person.api"; // Import API module to fetch person details
import { toast } from "react-toastify"; // Import toast notifications
import { useDispatch } from "react-redux"; // Import Redux hook for dispatching actions
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"; // Import Redux action to control global loading state

const PersonDetail = () => {
  const { personId } = useParams(); // Extract personId from the URL
  const [person, setPerson] = useState(); // State to hold person details
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  useEffect(() => {
    const getPerson = async () => {
      dispatch(setGlobalLoading(true)); // Set global loading state to true
      const { response, err } = await personApi.detail({ personId }); // Fetch person details using API
      dispatch(setGlobalLoading(false)); // Set global loading state to false

      if (err) toast.error(err.message); // Show error toast if there's an error
      if (response) setPerson(response); // Set person details in state
    };

    getPerson();
  }, [personId]); // Re-run effect when personId changes

  return (
    <>
      <Toolbar /> {/* Toolbar for consistent spacing and styling */}
      {person && (
        <>
          <Box sx={{ ...uiConfigs.style.mainContent }}>
            {" "}
            {/* Main content area with custom styles */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {/* Profile picture section */}
              <Box
                sx={{
                  width: { xs: "50%", md: "20%" },
                }}
              >
                <Box
                  sx={{
                    paddingTop: "160%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "darkgrey",
                    backgroundImage: `url(${tmdbConfigs.posterPath(
                      person.profile_path
                    )})`,
                  }}
                />
              </Box>
              {/* Details and biography section */}
              <Box
                sx={{
                  width: { xs: "100%", md: "80%" },
                  padding: { xs: "1rem 0", md: "1rem 2rem" },
                }}
              >
                <Stack spacing={2}>
                  {/* Person's name and lifespan */}
                  <Typography variant="h5" fontWeight="700">
                    {`${person.name} (${
                      person.birthday && person.birthday.split("-")[0]
                    }`}
                    {person.deathday &&
                      ` - ${person.deathday && person.deathday.split("-")[0]}`}
                    {")"}
                  </Typography>
                  {/* Person's biography */}
                  <Typography sx={{ ...uiConfigs.style.typoLines(10) }}>
                    {person.biography}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            {/* Section for media related to the person */}
            <Container header="medias">
              <PersonMediaGrid personId={personId} />
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

export default PersonDetail;
