import React, { useState } from "react";
import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  IconButton,
} from "@material-ui/core";
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import "../styles/App.css";
import LoadingButton from "./LoadingButton";

export interface UserFormProps {
  error: boolean;
  username: string;
  password: string;
  loading: boolean;
  setUsername: (username: string) => any;
  setPassword: (password: string) => any;
  onSubmit: () => any;
}

export function UserForm(props: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="user-form">
      <FormControl error={props.error}>
        <InputLabel>Username</InputLabel>
        <Input
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
          value={props.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.setUsername(e.target.value);
          }}
        />
      </FormControl>
      <div className="divider"></div>
      <FormControl>
        <InputLabel>Password</InputLabel>
        <Input
          startAdornment={
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          type={showPassword ? "text" : "password"}
          value={props.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.setPassword(e.target.value);
          }}
        />
      </FormControl>
      <div className="divider"></div>
      <LoadingButton onClick={props.onSubmit} loading={props.loading}>
        Submit
      </LoadingButton>
    </div>
  );
}

export default UserForm;
