import React from "react";
import { Card, Elevation } from "@blueprintjs/core";
import { Table, Column, Cell } from "@blueprintjs/table";
import Header from "components/header";
import withToast from "hoc/withToast";

const cellRenderer = rowIndex => (
  <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>
);

const Dashboard = props => {
  return (
    <>
      <Header />
      <Card elevation={Elevation.FOUR}>
        <Table numRows={10}>
          <Column name="Dollars" cellRenderer={cellRenderer} />
        </Table>
      </Card>
    </>
  );
};

export default withToast(Dashboard);
