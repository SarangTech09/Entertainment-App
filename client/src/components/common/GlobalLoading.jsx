import { useSelector } from "react-redux";
import { Paper, Box, LinearProgress, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";

const GlobalLoading = () => {
  const { globalLoading } = useSelector((state) => state.globalLoading);
  const themeMode = useSelector((state) => state.themeMode.themeMode); // Access themeMode from the store

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [globalLoading]);

  // Choose different loading images based on the theme mode (dark or light)
  const loadingImage =
    themeMode === "dark"
      ? `${process.env.PUBLIC_URL}/moodflix-color-transparent.png`
      : `${process.env.PUBLIC_URL}/moodflix-black-transparent.png`;

  return (
    <>
      <Paper
        sx={{
          opacity: isLoading ? 1 : 0,
          pointerEvents: "none",
          transition: "all .3s ease",
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 999,
        }}
      >
        <Toolbar />
        <LinearProgress />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={loadingImage}
            alt="Loading"
            style={{ width: "170px", height: "170px" }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default GlobalLoading;
