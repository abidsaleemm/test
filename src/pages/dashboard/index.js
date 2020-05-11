import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Card, Elevation, ButtonGroup, Classes } from "@blueprintjs/core";
import { Table, Column, Cell } from "@blueprintjs/table";
import { DateRangeInput } from "@blueprintjs/datetime";
import moment from "moment";
import Header from "components/header";
import Pagination from "components/pagination";
import AddRow from "components/add_row";
import EditRow from "components/edit_row";
import DeleteRow from "components/delete_row";
import { setParams, getRecords } from "store/actions/record";
import { MomentDateRange, MomentDate } from "components/moment_daterange";
import withToast from "hoc/withToast";

const style = {
  card: {
    width: "80%",
    maxWidth: "70rem",
    margin: "auto",
    marginTop: "3rem"
  },
  cell: {
    padding: "0.3rem"
  }
};

const Dashboard = props => {
  const { setParams, params, getRecords, records } = props;
  const [startDate, updateStartDate] = useState(null);
  const [endDate, updateEndDate] = useState(null);

  const jsDateFormatter = {
    formatDate: date => {
      return moment(date).format("YYYY/MM/DD");
    },
    parseDate: str => {
      return new Date(str);
    },
    placeholder: "YYYY/MM/DD"
  };

  const onPageChange = page => {
    setParams({ page });
  };

  useEffect(() => {
    getRecords({ params });
  }, [params, getRecords]);

  const handleChangeDateRange = dateRange => {
    const [fromDate, toDate] = dateRange;
    setParams({
      from: moment(fromDate).format("YYYY/MM/DD"),
      to: moment(toDate).format("YYYY/MM/DD")
    });
    updateStartDate(fromDate);
    updateEndDate(toDate);
    getRecords(params);
  };

  return (
    <>
      <Header />
      <Card elevation={Elevation.FOUR} style={style.card}>
        <div className={Classes.NAVBAR_GROUP}>
          <ButtonGroup>
            <AddRow />
            <DateRangeInput
              className="mr-3"
              value={[startDate, endDate]}
              onChange={handleChangeDateRange}
              {...jsDateFormatter}
            />
          </ButtonGroup>
          <MomentDateRange
            className={classNames(Classes.DIALOG_FOOTER_ACTIONS)}
            range={[startDate, endDate]}
          />
        </div>
        <Table
          numRows={records.length}
          style={style.table}
          defaultRowHeight={38}
          defaultColumnWidth={200}
        >
          <Column
            className={classNames(Classes.LARGE, "pt-1", "pl-2")}
            name="Date"
            cellRenderer={row => (
              <Cell>
                <MomentDate withTime={false} date={records[row].date} />
              </Cell>
            )}
          />
          <Column
            className={Classes.LARGE}
            name="Note"
            cellRenderer={row => <Cell>{records[row].note}</Cell>}
          />
          <Column
            className={Classes.LARGE}
            name="Working Hours"
            cellRenderer={row => <Cell>{records[row].hour}</Cell>}
          />
          <Column
            name="Actions"
            cellRenderer={row => (
              <Cell style={style.cell}>
                <ButtonGroup>
                  <EditRow selectedRow={records[row]} />
                  <DeleteRow selectedRow={records[row]} />
                </ButtonGroup>
              </Cell>
            )}
          />
        </Table>
        <Pagination initialPage={1} onPageChange={onPageChange} />
      </Card>
    </>
  );
};

Dashboard.propTypes = {
  setParams: PropTypes.func.isRequired,
  getRecords: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  params: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  records: state.record.records,
  params: state.record.params,
  count: state.record.count
});

const mapDispatchToProps = {
  setParams: setParams,
  getRecords: getRecords
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(Dashboard)
);
