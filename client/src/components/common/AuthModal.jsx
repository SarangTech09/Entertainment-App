import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import Logo from "./Logo";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

// Define action states as constants for easy management
const actionState = {
  signin: "signin",
  signup: "signup"
};

// Access the authModalOpen state from the Redux store
const AuthModal = () => {
  const { authModalOpen } = useSelector((state) => state.authModal);

  // Get the dispatch function to dispqtch actions to the Redux store
  const dispatch = useDispatch();

  //Local state to track the current action (signin or signup)
  const [action, setAction] = useState(actionState.signin);

  //Effect to rest the action to signin whenever the modal is opened
  useEffect(() => {
    if (authModalOpen) setAction(actionState.signin);
  }, [authModalOpen]);

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (state) => setAction(state);

  return (
    <Modal open={authModalOpen} onClose={handleClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: "600px",
        padding: 4,
        outline: "none"
      }}>
        <Box sx={{ padding: 4, boxShadow: 24, backgroundColor: "background.paper" }}>
          <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            <Logo />
          </Box>
          
          {/*Conditionally render the signin or signup form based on the current action */}

          {action === actionState.signin && <SigninForm switchAuthState={() => switchAuthState(actionState.signup)} />}

          {action === actionState.signup && <SignupForm switchAuthState={() => switchAuthState(actionState.signin)} />}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;