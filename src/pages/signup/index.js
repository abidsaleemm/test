import React, { useState } from "react";
import {
  ProgressBar,
  Button,
  Tooltip,
  Intent,
  FormGroup,
  Card,
  Elevation,
  Classes
} from "@blueprintjs/core";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Formik, Form, Field } from "formik";
import { InputGroup } from "formik-blueprint";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { showToast } from "store/actions/toast";
import { signup } from "store/actions/auth";
import withToast from "hoc/withToast";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
};

const validateSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(8, "Length must be at least 8 letters!")
    .max(50, "Length must be less than 50 letters!")
    .required("Required")
});

function SignUp(props) {
  const { signup, showToast } = props;
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const handleSubmit = (values, actions) => {
    signup({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        history.push("/login");
        showToast({
          message: "You are successfully signed up!",
          intent: "success"
        });
      },
      fail: err => {
        actions.setSubmitting(false);
        showToast({ message: err.response.data.message, intent: "danger" });
      }
    });
  };

  const lockButton = (
    <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
      <Button
        icon={showPassword ? "unlock" : "lock"}
        intent={Intent.WARNING}
        minimal={true}
        onClick={() => setShowPassword(!showPassword)}
      />
    </Tooltip>
  );

  return (
    <Card
      className="bp3-dark transition"
      interactive={true}
      elevation={Elevation.TWO}
      style={{ width: "30rem", margin: "auto" }}
    >
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validateSchema}
      >
        {({
          submitForm,
          isSubmitting,
          errors: {
            firstName: firstNameError,
            lastName: lastNameError,
            email: emailError,
            password: passwordError
          }
        }) => (
          <Form>
            <FormGroup
              helperText={firstNameError}
              intent={firstNameError ? Intent.DANGER : Intent.NONE}
              label="First Name"
              labelFor="firstName"
            >
              <Field
                component={InputGroup}
                placeholder="First Name (required)"
                id="firstName"
                name="firstName"
                type="text"
                intent={firstNameError ? Intent.DANGER : Intent.NONE}
                label="First Name"
                large
              />
            </FormGroup>
            <FormGroup
              helperText={lastNameError}
              intent={lastNameError ? Intent.DANGER : Intent.NONE}
              label="Last Name"
              labelFor="lastName"
            >
              <Field
                component={InputGroup}
                placeholder="Last Name (required)"
                id="lastName"
                name="lastName"
                type="text"
                intent={lastNameError ? Intent.DANGER : Intent.NONE}
                label="Last Name"
                large
              />
            </FormGroup>
            <FormGroup
              helperText={emailError}
              intent={emailError ? Intent.DANGER : Intent.NONE}
              label="Email Address"
              labelFor="email"
            >
              <Field
                component={InputGroup}
                placeholder="Email Address (required)"
                id="email"
                name="email"
                type="email"
                intent={emailError ? Intent.DANGER : Intent.NONE}
                label="Email Address"
                large
              />
            </FormGroup>
            <FormGroup
              helperText={passwordError}
              intent={passwordError ? Intent.DANGER : Intent.NONE}
              label="Password"
              labelFor="password"
            >
              <Field
                component={InputGroup}
                intent={passwordError ? Intent.DANGER : Intent.NONE}
                placeholder="Password (required)"
                id="password"
                name="password"
                rightElement={lockButton}
                type={showPassword ? "text" : "password"}
                large
              />
            </FormGroup>
            {isSubmitting && <ProgressBar />}
            <br />

            <Button
              className={classNames(Classes.DARK, Classes.LARGE)}
              disabled={isSubmitting}
              onClick={submitForm}
              icon="log-in"
            >
              Sign Up
            </Button>
            <Button
              className={classNames(
                Classes.MINIMAL,
                Classes.TEXT_SMALL,
                Classes.NAVBAR_GROUP,
                Classes.ALIGN_RIGHT
              )}
              onClick={() => history.push("/login")}
            >
              Back to Log In
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

SignUp.propTypes = {
  signup: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  signup: signup,
  showToast: showToast
};

export default compose(connect(null, mapDispatchToProps))(withToast(SignUp));
