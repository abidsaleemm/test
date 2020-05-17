import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Classes, ButtonGroup, Card, Elevation } from "@blueprintjs/core";
import { Table, Column, Cell, RenderMode } from "@blueprintjs/table";
import { upperFirst, toLower } from "lodash-es";
import Header from "components/header";
import { getUsers, setParams } from "store/actions/user";
import { ROLES } from "constants/index";
import withToast from "hoc/withToast";
import Pagination from "components/pagination";
import { AddRow, EditRow, DeleteRow } from "components/user";
import { getRecords } from "store/actions/record";

const style = {
  card: {
    width: "70%",
    maxWidth: "100rem",
    margin: "auto",
    marginTop: "3rem"
  }
};

const Users = props => {
  const { users, getUsers, params, setParams, count } = props;

  useEffect(() => {
    setParams({ page: 1, rowsPerPage: 5 });
  }, []);

  useEffect(() => {
    getUsers({ params });
  }, [params, getUsers]);

  const onPageChange = page => {
    setParams({ page });
  };

  return (
    <div>
      <Header />
      <Card
        elevation={Elevation.FOUR}
        style={style.card}
        className={Classes.DARK}
      >
        <AddRow />
        {params.rowsPerPage === users.length && (
          <Table
            className="my-3"
            numRows={users.length}
            defaultRowHeight={38}
            columnWidths={[50, 250, 300, 200, 274, 200]}
            renderMode={RenderMode.NONE}
            enableRowHeader={false}
          >
            <Column
              className={Classes.LARGE}
              name="No"
              cellRenderer={row => (
                <Cell>{row + (params.page - 1) * params.rowsPerPage + 1}</Cell>
              )}
            />
            <Column
              className={classNames(Classes.LARGE, "pt-1", "pl-2")}
              name="Name"
              cellRenderer={row => (
                <Cell>
                  {users[row]
                    ? users[row].firstName + " " + users[row].lastName
                    : ""}
                </Cell>
              )}
            />
            <Column
              className={Classes.LARGE}
              name="Email"
              cellRenderer={row => (
                <Cell>{users[row] ? users[row].email : ""}</Cell>
              )}
            />
            <Column
              className={Classes.LARGE}
              name="Role"
              cellRenderer={row => (
                <Cell>
                  {users[row]
                    ? upperFirst(toLower(Object.keys(ROLES)[users[row].role]))
                    : ""}
                </Cell>
              )}
            />
            <Column
              className={Classes.LARGE}
              name="Preferred Working Hours"
              cellRenderer={row => (
                <Cell>
                  {users[row] ? users[row].preferredWorkingHours : ""}
                </Cell>
              )}
            />
            <Column
              name="Actions"
              cellRenderer={row => (
                <Cell>
                  {users[row] && (
                    <ButtonGroup>
                      <EditRow selectedRow={users[row]} />
                      <DeleteRow selectedRow={users[row]} />
                    </ButtonGroup>
                  )}
                </Cell>
              )}
            />
          </Table>
        )}
        <Pagination
          initialPage={params.page}
          onPageChange={onPageChange}
          setParams={setParams}
          params={params}
          count={count}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = state => ({
  users: state.user.users,
  params: state.user.params,
  count: state.user.count
});

const mapDispatchToProps = {
  getUsers: getUsers,
  setParams: setParams
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(Users)
);
