import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import get from "lodash-es/get";
import { Navbar, Button, Alignment, Classes } from "@blueprintjs/core";
import { signout } from "store/actions/auth";
import { ROLES } from "constants/index";
import ManageProfile from "components/manage_profile";
import withToast from "hoc/withToast";

const Header = props => {
  const { signout } = props;
  const [isOpen, toggleDialog] = useState(false);

  const history = useHistory();

  const role = useSelector(state => get(state, "auth.me.role", 0));
  const isManagable = role === ROLES.MANAGER || role === ROLES.ADMIN;

  return (
    <>
      <Navbar className={Classes.DARK}>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Time Management</Navbar.Heading>
          <Navbar.Divider />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Link
            className={classNames("mr-3", Classes.BUTTON, Classes.MINIMAL)}
            to="/dashboard"
          >
            Records
          </Link>
          {isManagable && (
            <Link
              className={classNames("mr-3", Classes.BUTTON, Classes.MINIMAL)}
              to="/users"
            >
              Users
            </Link>
          )}
          <Navbar.Divider />
          <ManageProfile isOpen={isOpen} toggleDialog={toggleDialog} />
          <Button
            className={classNames(Classes.SMALL, Classes.MINIMAL, "ml-2")}
            icon="log-out"
            onClick={() => {
              signout();
              history.push("/login");
            }}
          />
        </Navbar.Group>
      </Navbar>
    </>
  );
};

const mapDispatchToProps = {
  signout: signout
};

export default compose(connect(() => ({}), mapDispatchToProps))(
  withToast(Header)
);
