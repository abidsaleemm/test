import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash-es";
import {
  Card,
  Elevation,
  ButtonGroup,
  Classes,
  Intent,
  Colors
} from "@blueprintjs/core";
import { Table, Column, Cell } from "@blueprintjs/table";
import { DateRangeInput } from "@blueprintjs/datetime";
import moment from "moment";
import Header from "components/header";
import Pagination from "components/pagination";
import { AddRow, EditRow, DeleteRow } from "components/record";
import PreferredWorkingHours from "components/preferred_working_hours";
import { setParams, getRecords } from "store/actions/record";
import {
  MomentDateRange,
  EnhancedMomentDate
} from "components/moment_daterange";
import withToast from "hoc/withToast";
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
  const { setParams, params, getRecords, records, count } = props;
  const [startDate, updateStartDate] = useState(null);
  const [endDate, updateEndDate] = useState(null);

  const getColor = row => {
    const pair = {};
    _.toPairs(
      _.groupBy(records, record => moment(record.date).format(DATE_FORMAT))
    ).map(group => {
      pair[group[0]] = _.sumBy(group[1], "hour");
    });

    if (row >= 0) {
      const rowDate = moment(_.get(records, `${row}.date`)).format(DATE_FORMAT);
      const preferredWorkingHours = _.get(
        records,
        `${row}.user.preferredWorkingHours`,
        0
      );
      return preferredWorkingHours > pair[rowDate]
        ? Intent.DANGER
        : Intent.SUCCESS;
    }
  };

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
    <div>
      <Header />
      <Card
        elevation={Elevation.FOUR}
        className={Classes.DARK}
        style={style.card}
      >
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
          defaultRowHeight={38}
          columnWidths={[200, 1000, 150, 180]}
        >
          <Column
            className={classNames(Classes.LARGE, "pt-1", "pl-2")}
            name="Date"
            cellRenderer={row => (
              <Cell intent={getColor(row)}>
                <EnhancedMomentDate
                  withTime={false}
                  date={records[row].date}
                  row={row}
                  intent={getColor(row)}
                />
              </Cell>
            )}
          />
          <Column
            className={Classes.LARGE}
            name="Note"
            cellRenderer={row => (
              <Cell intent={getColor(row)}>{records[row].note}</Cell>
            )}
          />
          <Column
            className={Classes.LARGE}
            name="Working Hours"
            cellRenderer={row => (
              <Cell intent={getColor(row)}>{records[row].hour}</Cell>
            )}
          />
          <Column
            name="Actions"
            cellRenderer={row => (
              <Cell intent={getColor(row)} style={style.cell}>
                <ButtonGroup>
                  <EditRow selectedRow={records[row]} />
                  <DeleteRow selectedRow={records[row]} />
                </ButtonGroup>
              </Cell>
            )}
          />
        </Table>
        <Pagination
          initialPage={1}
          onPageChange={onPageChange}
          setParams={setParams}
          params={params}
          count={count}
        />
      </Card>
    </div>
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
