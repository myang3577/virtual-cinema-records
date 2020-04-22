import React, { useState } from "react";
import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  IconButton,
} from "@material-ui/core";
import { Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import "../styles/App.css";

export interface UserFormProps {
  //   error: boolean;
  //   username: string;
  password: string;
  //   feedback: string;
  loading: boolean;
  //   setUsername: (username: string) => any;
  setPassword: (password: string) => any;
  placeholder: string;
  //   onSubmit: () => any;
}

export function PasswordField(props: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl>
      <InputLabel>{props.placeholder}</InputLabel>
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
  );
}

export default PasswordField;
