import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Intent } from "@blueprintjs/core";
import _ from "lodash-es";
import moment from "moment";
import { DATE_FORMAT } from "constants/index";

const withColors = (WrappedComponent, actions) => {
  const fetchActions = actions.reduce((o, fn) => ({ ...o, [fn.name]: fn }), {});
  const propTypes = actions.reduce(
    (o, fn) => ({ ...o, [fn.name]: PropTypes.func.isRequired }),
    {}
  );

  const ColoredDataHOC = props => {
    const { records, row } = props;
    const pair = {};
    _.toPairs(
      _.groupBy(records, record => moment(record.date).format(DATE_FORMAT))
    ).map(group => {
      pair[group[0]] = _.sumBy(group[1], "hour");
    });

    let intent = Intent.NONE;

    if (row >= 0) {
      const rowDate = moment(_.get(records, `${row}.date`)).format(DATE_FORMAT);
      const preferredWorkingHours = _.get(
        records,
        `${row}.user.preferredWorkingHours`,
        0
      );
      intent =
        preferredWorkingHours > pair[rowDate] ? Intent.DANGER : Intent.SUCCESS;
    }

    return (
      <>
        <WrappedComponent {...props} intent={intent} />
      </>
    );
  };

  ColoredDataHOC.propTypes = propTypes;

  const mapStateToProps = state => ({
    records: state.record.records
  });

  return connect(mapStateToProps, fetchActions)(ColoredDataHOC);
};

export default withColors;
