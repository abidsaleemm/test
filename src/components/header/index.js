import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Navbar, Button, Alignment, Classes } from "@blueprintjs/core";
import { signout } from "store/actions/auth";

const Header = props => {
  const { signout } = props;
  return (
    <Navbar className={Classes.DARK}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Time Management</Navbar.Heading>
        <Navbar.Divider />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
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
