import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Classes, ButtonGroup, Card, Elevation } from "@blueprintjs/core";
import { Table, Column, Cell } from "@blueprintjs/table";
import { upperFirst, toLower } from "lodash-es";
import Header from "components/header";
import { getUsers } from "store/actions/user";
import { ROLES } from "constants/index";

const Users = props => {
  const { users, getUsers, params } = props;

  useEffect(() => {
    getUsers({ params });
  }, [params]);

  console.log("users: ", users);

  return (
    <>
      <Header />
      <Card elevation={Elevation.FOUR}>
        <Table
          numRows={users.length}
          defaultRowHeight={38}
          columnWidths={[200, 200, 200, 200, 200]}
        >
          <Column
            className={classNames(Classes.LARGE, "pt-1", "pl-2")}
            name="Name"
            cellRenderer={row => (
              <Cell>{users[row].firstName + " " + users[row].lastName}</Cell>
            )}
          />
          <Column
            className={Classes.LARGE}
            name="Email"
            cellRenderer={row => <Cell>{users[row].email}</Cell>}
          />
          <Column
            className={Classes.LARGE}
            name="Role"
            cellRenderer={row => (
              <Cell>
                {upperFirst(toLower(Object.keys(ROLES)[users[row].role]))}
              </Cell>
            )}
          />
          <Column
            className={Classes.LARGE}
            name="Preferred Working Hours"
            cellRenderer={row => (
              <Cell>{users[row].preferredWorkingHours}</Cell>
            )}
          />
          <Column
            name="Actions"
            cellRenderer={row => (
              <Cell>
                <ButtonGroup></ButtonGroup>
              </Cell>
            )}
          />
        </Table>
      </Card>
    </>
  );
};

const mapStateToProps = state => ({
  users: state.user.users,
  params: state.user.params
});

const mapDispatchToProps = {
  getUsers: getUsers
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Users);
