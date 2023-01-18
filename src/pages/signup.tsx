import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import { Auth } from "aws-amplify";
import { useState } from "react";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

const Signup = () => {
  const { user, setUser } = useUser();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      code: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [showCode, setShowCode] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpWithEmailAndPassword(data);
        setShowCode(true);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setSignUpError(error.message);
      }
      setOpen(true);
    }
  };

  async function signUpWithEmailAndPassword(
    data: IFormInput
  ): Promise<CognitoUser> {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email, // optional
        },
      });
      console.log(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      const amplifyUser = await Auth.signIn(username, password);
      console.log("Success signed in a user: ", amplifyUser);
      if (amplifyUser) {
        router.push("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
            id="email"
            label="Email"
            type="email"
            error={errors.email ? true : false}
            helperText={errors.email?.message}
            {...register("email", {
              required: { value: true, message: "Please enter a valid email" },
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
        {showCode && (
          <Grid item>
            <TextField
              variant="outlined"
              id="code"
              label="Verification code"
              type="code"
              error={errors.password ? true : false}
              helperText={errors.password?.message}
              {...register("code", {
                required: {
                  value: true,
                  message: "Please enter a verification code",
                },
              })}
            />
          </Grid>
        )}
        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            {showCode ? "Confirm Code" : " Sign Up"}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose}>
          {signUpError}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default Signup;
