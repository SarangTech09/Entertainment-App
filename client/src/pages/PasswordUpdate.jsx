import { LoadingButton } from "@mui/lab"; // Import a button that shows a loading indicator
import { Box, Stack, TextField } from "@mui/material"; // Import various components from Material UI
import { useFormik } from "formik"; // Import Formik for form management
import * as Yup from "yup"; // Import Yup for validation schema
import Container from "../components/common/Container"; // Import a custom Container component
import uiConfigs from "../configs/ui.configs"; // Import UI configuration
import { useState } from "react"; // Import React hooks
import userApi from "../api/modules/user.api"; // Import user API for updating password
import { toast } from "react-toastify"; // Import toast notifications
import { useNavigate } from "react-router-dom"; // Import hook for navigation
import { useDispatch } from "react-redux"; // Import hook for Redux dispatch
import { setUser } from "../redux/features/userSlice"; // Import Redux action to set user state
import { setAuthModalOpen } from "../redux/features/authModalSlice"; // Import Redux action to control auth modal state

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false); // State to manage the loading state of the update request

  const navigate = useNavigate(); // Hook to navigate between routes
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  // Initialize Formik with initial values, validation schema, and submit handler
  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      newPassword: Yup.string()
        .min(8, "newPassword minimum 8 characters")
        .required("newPassword is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "confirmNewPassword not match")
        .min(8, "confirmNewPassword minimum 8 characters")
        .required("confirmNewPassword is required"),
    }),
    onSubmit: async (values) => onUpdate(values),
  });

  // Function to handle the password update
  const onUpdate = async (values) => {
    if (onRequest) return; // Prevent duplicate requests
    setOnRequest(true); // Set the request state to true to show loading indicator

    const { response, err } = await userApi.passwordUpdate(values); // Make API call to update password

    setOnRequest(false); // Set the request state to false after the API call

    if (err) toast.error(err.message); // Show error toast if there's an error
    if (response) {
      form.resetForm(); // Reset the form fields
      navigate("/"); // Navigate to the home page
      dispatch(setUser(null)); // Reset the user state in Redux
      dispatch(setAuthModalOpen(true)); // Open the auth modal
      toast.success("Update password success! Please re-login"); // Show success toast
    }
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      {" "}
      {/* Main content area with custom styles */}
      <Container header="update password">
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            {/* Text field for current password */}
            <TextField
              type="password"
              placeholder="password"
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.password && form.errors.password !== undefined
              }
              helperText={form.touched.password && form.errors.password}
            />
            {/* Text field for new password */}
            <TextField
              type="password"
              placeholder="new password"
              name="newPassword"
              fullWidth
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.newPassword &&
                form.errors.newPassword !== undefined
              }
              helperText={form.touched.newPassword && form.errors.newPassword}
            />
            {/* Text field for confirming new password */}
            <TextField
              type="password"
              placeholder="confirm new password"
              name="confirmNewPassword"
              fullWidth
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword !== undefined
              }
              helperText={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              update password
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordUpdate;
