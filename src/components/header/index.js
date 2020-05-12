import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import get from "lodash-es/get";
import { Navbar, Button, Alignment, Classes } from "@blueprintjs/core";
import { signout } from "store/actions/auth";
import { ROLES } from "constants/index";

const Header = props => {
  const { signout } = props;

  const role = useSelector(state => get(state, "auth.me.role", 0));
  const isManagable = role === ROLES.MANAGER || role === ROLES.ADMIN;

  return (
    <Navbar className={Classes.DARK}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Time Management</Navbar.Heading>
        <Navbar.Divider />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Link to="/dashboard">Records</Link>
        {isManagable && <Link to="/users">Users</Link>}
        <Button
          className={classNames(Classes.SMALL, Classes.MINIMAL)}
          icon="log-out"
          text="Log Out"
          onClick={() => signout()}
        />
      </Navbar.Group>
    </Navbar>
  );
};

const mapDispatchToProps = {
  signout: signout
};

export default compose(connect(() => ({}), mapDispatchToProps))(Header);
