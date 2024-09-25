import React from 'react'; // Importing React to use JSX and component creation
import HeroSlide from '../components/common/HeroSlide'; // Importing the HeroSlide component
import tmdbConfigs from "../api/configs/tmdb.configs"; // Importing TMDB configuration for media types and categories
import { Box } from '@mui/material'; // Importing the Box component from Material UI for layout and styling
import uiConfigs from "../configs/ui.configs"; // Importing UI configurations
import Container from "../components/common/Container"; // Importing the Container component for structured content
import MediaSlide from "../components/common/MediaSlide"; // Importing the MediaSlide component for displaying media content

const HomePage = () => {
  return (
    <>
      {/* Hero section showing a slide of popular movies */}
      <HeroSlide
        mediaType={tmdbConfigs.mediaType.movie} // Specifies the media type as movies
        mediaCategory={tmdbConfigs.mediaCategory.popular} // Specifies the media category as popular
      />

      {/* Main content section with media slides */}
      <Box
        marginTop="-4rem" // Negative margin to overlap the content with the HeroSlide
        sx={{ ...uiConfigs.style.mainContent }} // Applies additional styles from UI configurations
      >
        {/* Container for popular movies */}
        <Container header="popular movies">
          <MediaSlide
            mediaType={tmdbConfigs.mediaType.movie} // Media type set to movie
            mediaCategory={tmdbConfigs.mediaCategory.popular} // Media category set to popular
          />
        </Container>

        {/* Container for popular series */}
        <Container header="popular series">
          <MediaSlide
            mediaType={tmdbConfigs.mediaType.tv} // Media type set to TV series
            mediaCategory={tmdbConfigs.mediaCategory.popular} // Media category set to popular
          />
        </Container>

        {/* Container for top rated movies */}
        <Container header="top rated movies">
          <MediaSlide
            mediaType={tmdbConfigs.mediaType.movie} // Media type set to movie
            mediaCategory={tmdbConfigs.mediaCategory.top_rated} // Media category set to top rated
          />
        </Container>

        {/* Container for top rated series */}
        <Container header="top rated series">
          <MediaSlide
            mediaType={tmdbConfigs.mediaType.tv} // Media type set to TV series
            mediaCategory={tmdbConfigs.mediaCategory.top_rated} // Media category set to top rated
          />
        </Container>
      </Box>
    </>
  );
};

export default HomePage; // Export the HomePage component as the default export
