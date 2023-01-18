import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import { Auth } from "aws-amplify";
import { useState } from "react";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [signInError, setSignInError] = useState("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { password, username } = data;
    try {
      const amplifyUser = await Auth.signIn(username, password);
      if (amplifyUser) {
        router.push("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("error signing in", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={2}
        style={{ marginTop: 16 }}
      >
        <Grid item>
          <TextField
            variant="outlined"
            id="userName"
            label="Username"
            type="text"
            error={errors.username ? true : false}
            helperText={errors.username?.message}
            {...register("username", {
              required: { value: true, message: "Please enter a user name" },
              minLength: {
                value: 3,
                message: "Please enter a username between 3-16 character",
              },
              maxLength: {
                value: 16,
                message: "Please enter a username between 3-16 character",
              },
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            id="password"
            label="Password"
            type="password"
            error={errors.password ? true : false}
            helperText={errors.password?.message}
            {...register("password", {
              required: {
                value: true,
                message: "Please enter a valid password",
              },
              minLength: {
                value: 8,
                message: "Please enter a valid password.",
              },
            })}
          />
        </Grid>
        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            Sign In
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose}>
          {signInError}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default Login;
