/*
The book project lets a user keep track of different books they would like to read, are currently
reading, have read or did not finish.
Copyright (C) 2020  Karan Kumar

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.
*/


import React, { Component, ReactElement } from "react";
import "./Login.css";
import Button from "@material-ui/core/Button";
import Password from "../shared/form/Password";
import EmailAddress from "../shared/form/EmailAddress";
import { Link } from "react-router-dom";
import logo from "../shared/media/logo/logo_one_line@1x.png";
import HttpClient from "../shared/http/HttpClient";
import { RouteComponentProps } from "react-router-dom";
import { MY_BOOKS, SIGN_UP } from "../shared/routes";
import ForgotPasswordModal from "./forgotPassword/ForgotPasswordModal";
import PasswordResetModal from "./forgotPassword/PasswordResetModal";
import { getUserData, saveUserData } from "../userBooks";
import { emailContext, useEmail } from '../EmailContext';


interface IState {
  email: string;
  password: string;
  isEmailDirty: boolean;
  isPasswordDirty: boolean;
  isEmailInvalid: boolean;
  isPasswordInvalid: boolean;
  loginFailed: string;
  showForgotPasswordModal: boolean;
  showPasswordResetModal: boolean;
}

interface LoginProps extends RouteComponentProps {
  setEmail: (email: string) => void;
}
class Login extends Component<LoginProps, IState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isEmailDirty: false,
      isPasswordDirty: false,
      isEmailInvalid: false,
      isPasswordInvalid: false,
      loginFailed: "",
      showForgotPasswordModal: false,
      showPasswordResetModal: false,
    };

    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onForgotPassword = this.onForgotPassword.bind(this);
    this.onForgotPasswordModalClose =
      this.onForgotPasswordModalClose.bind(this);
    this.onPasswordResetClicked = this.onPasswordResetClicked.bind(this);
    this.onPasswordResetModalClose = this.onPasswordResetModalClose.bind(this);
    this.onEmailChanged = this.onEmailChanged.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.sendLoginRequest = this.sendLoginRequest.bind(this);
    this.sendLoginRequestIfCredentialsAreValid =
      this.sendLoginRequestIfCredentialsAreValid.bind(this);
  }

  componentDidMount() {
    this.isMountedFlag = true;
  }

  componentWillUnmount() {
    this.isMountedFlag = false;
  }

  isMountedFlag = false;

  onClickLogin(): void {
    this.setState(
      {
        isEmailInvalid: this.state.email === "",
        isPasswordInvalid: this.state.password === "",
      },
      this.sendLoginRequestIfCredentialsAreValid
    );
  }

  onEmailChanged(email: string): void {
    this.setState({
      email,
      isEmailDirty: true,
      isEmailInvalid: email === "",
    });
  }

  onPasswordChanged(password: string): void {
    this.setState({
      password,
      isPasswordDirty: true,
      isPasswordInvalid: password === "",
    });
  }

  onForgotPassword(): void {
    this.setState({
      showForgotPasswordModal: true,
    });
  }

  onForgotPasswordModalClose(): void {
    this.setState({
      showForgotPasswordModal: false,
    });
  }

  onPasswordResetClicked(): void {
    this.onForgotPasswordModalClose();
    this.setState({
      showPasswordResetModal: true,
    });
  }

  onPasswordResetModalClose(): void {
    this.setState({
      showPasswordResetModal: false,
    });
  }

  isEmailInvalid(): boolean {
    const isEmailDirtyAndBlank =
      this.state.email === "" && this.state.isEmailDirty;
    return isEmailDirtyAndBlank || this.state.isEmailInvalid;
  }

  isPasswordInvalid(): boolean {
    const isPasswordDirtyAndBlank =
      this.state.password === "" && this.state.isPasswordDirty;
    return isPasswordDirtyAndBlank || this.state.isPasswordInvalid;
  }

  sendLoginRequestIfCredentialsAreValid(): void {
    if (!this.state.isEmailInvalid && !this.state.isPasswordInvalid) {
      this.sendLoginRequest();
    }
  }

  sendLoginRequest(): void {
    HttpClient.login(this.state.email, this.state.password)
      .then((response) => {
        if (this.isMountedFlag) {
          // Check if the component is still mounted
          if (response.ok) {
            // const { setEmail } = useEmail();
            // setEmail(this.state.email);
            this.context.setEmail(this.state.email);

            localStorage.setItem("currentUserEmail", this.state.email);
            // this.props.setEmail(this.state.email);
            // localStorage.setItem("currentUserEmail", this.state.email);

            // Check if user data already exists
            let userData = getUserData(this.state.email);
            console.log("userData :", userData);
            if (!userData) {
              // If not, create a new user data object
              userData = {
                readBooks: [],
                didNotFinishBooks: [],
                toReadBooks: [],
                readingBooks: [],
                favorites: [],
                // ... any other shelves or user data fields ...
              };
              // Save the new user data in local storage
              saveUserData(this.state.email, userData);
            }
            this.props.history.push({
              pathname: MY_BOOKS,
              state: { email: this.state.email },
            });
          } else {
            this.setState({
              loginFailed:
                "Your email or password is incorrect. Please try again",
            });
          }
        }
      })
      .catch((error) => {
        if (this.isMountedFlag) {
          // Check if the component is still mounted
          this.setState({
            loginFailed:
              "Sorry, something went wrong on our end. Please try again later.",
          });
        }
      });
  }

  renderLoginError(): ReactElement {
    return <p className="error-message">{this.state.loginFailed}</p>;
  }

  render(): ReactElement {
    return (
      <div className="center-table">
        <div className="center-table-cell">
          <img src={logo} alt="Logo" className="center" />

          <br />
          <br />
          <br />

          <div className="center">
            <EmailAddress
              class={"center login"}
              classHelper={"center helper"}
              isInvalid={this.isEmailInvalid()}
              onChange={this.onEmailChanged}
              errorMessage={"Please enter an email address"}
            />

            <br />

            <Password
              placeholderText={"Password"}
              class={"center login"}
              classHelper={"center helper"}
              onPasswordChanged={this.onPasswordChanged}
              isInvalid={this.isPasswordInvalid()}
              errorMessage={"Please enter a password"}
            />

            <br />
            <br />

            <Button
              className="center login"
              variant="contained"
              color="primary"
              onClick={this.onClickLogin}
              disableElevation
            >
              Log in
            </Button>

            <br />
            <br />

            <Button
              className="center login"
              id="createAccount"
              component={Link}
              to={SIGN_UP}
            >
              Create account
            </Button>
            <Button className="center login" onClick={this.onForgotPassword}>
              Forgot Password
            </Button>

            {this.state.loginFailed && this.renderLoginError()}
          </div>
        </div>
        <ForgotPasswordModal
          open={this.state.showForgotPasswordModal}
          onClose={this.onForgotPasswordModalClose}
          onPasswordResetClicked={this.onPasswordResetClicked}
        />
        <PasswordResetModal
          open={this.state.showPasswordResetModal}
          onClose={this.onPasswordResetModalClose}
        />
      </div>
    );
  }
}

Login.contextType = emailContext;


export default Login;
