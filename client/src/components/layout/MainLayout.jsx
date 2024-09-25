import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import GlobalLoading from "../common/GlobalLoading";
import Topbar from "../common/Topbar";
import AuthModal from "../common/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import userApi from "../../api/modules/user.api";
import favoriteApi from "../../api/modules/favorite.api";
import { setListFavorites, setUser } from "../../redux/features/userSlice";

const MainLayout = () => {
  const dispatch = useDispatch(); // Get the dispatch function from Redux

  const { user } = useSelector((state) => state.user); // Get the user data from the Redux store

  // Effect to fetch and set the authenticated user information

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo();

      if (response) dispatch(setUser(response));
      if (err) dispatch(setUser(null));
    };

    authUser();
  }, [dispatch]);

  // Effect to fetch and set the user's list of favorites

  useEffect(() => {
    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList();

      if (response) dispatch(setListFavorites(response));
      if (err) toast.error(err.message);
    };

    if (user) getFavorites();
    if (!user) dispatch(setListFavorites([]));
  }, [user, dispatch]);

  return (
    <>
      {/* Global loading indicator */}
      <GlobalLoading />

      {/* Authentication modal */}
      <AuthModal />

      <Box display="flex" minHeight="100vh">

        {/* Header section */}
        <Topbar />

        {/* Main content section */}
        <Box component="main" flexGrow={1} overflow="hidden" minHeight="100vh">
          <Outlet /> {/* Render the nested routes here */}
        </Box>
        {/* Main content section */}

      </Box>

      {/* footer section */}
      <Footer />
    </>
  );
};

export default MainLayout;
