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
import PreferredWorkingHours from "components/preferred_working_hours";
import { setParams, getRecords } from "store/actions/record";
import {
  MomentDateRange,
  EnhancedMomentDate
} from "components/moment_daterange";
import withToast from "hoc/withToast";
import withColors from "hoc/withColors";
import { DATE_FORMAT } from "constants/index";

const style = {
  card: {
    width: "90%",
    maxWidth: "100rem",
    margin: "auto",
    marginTop: "3rem"
  },
  cardChild: {
    justifyContent: "space-between"
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
      return moment(date).format(DATE_FORMAT);
    },
    parseDate: str => {
      return new Date(str);
    },
    placeholder: DATE_FORMAT
  };

  const onPageChange = page => {
    setParams({ page });
  };

  useEffect(() => {
    getRecords({ params });
  }, [params, getRecords]);

  const handleChangeDateRange = dateRange => {
    const [fromDate, toDate] = dateRange;
    const from = moment(fromDate);
    const to = moment(toDate);
    setParams({
      from: from.isValid() ? from.format(DATE_FORMAT) : null,
      to: to.isValid() ? to.format(DATE_FORMAT) : null
    });
    updateStartDate(fromDate);
    updateEndDate(toDate);
  };

  return (
    <>
      <Header />
      <Card elevation={Elevation.FOUR} style={style.card}>
        <div className={Classes.NAVBAR_GROUP} style={style.cardChild}>
          <AddRow />
          <ButtonGroup>
            <DateRangeInput
              className="mr-3"
              value={[startDate, endDate]}
              onChange={handleChangeDateRange}
              {...jsDateFormatter}
            />
            <MomentDateRange
              className={classNames(Classes.DIALOG_FOOTER_ACTIONS)}
              range={[startDate, endDate]}
            />
          </ButtonGroup>
          <PreferredWorkingHours />
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
                <EnhancedMomentDate
                  withTime={false}
                  date={records[row].date}
                  row={row}
                />
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
  withColors(withToast(Dashboard), [])
);
