import React from "react";
import { Icon, Tag, Classes, Colors } from "@blueprintjs/core";
import classNames from "classnames";
import moment from "moment";

const FORMAT = "dddd, LL";
const FORMAT_TIME = "dddd, LL LT";

export const MomentDate = ({
  date,
  withTime = false,
  format = withTime ? FORMAT_TIME : FORMAT
}) => {
  const m = moment(date);
  let color;
  if (m.diff(moment(), "days") >= 0) {
    color = Colors.FOREST1;
  } else {
    color = Colors.FOREST3;
  }

  if (m.isValid()) {
    return (
      <Tag className={classNames(Classes.LARGE)} style={{ background: color }}>
        {m.format(format)}
      </Tag>
    );
  } else {
    return (
      <Tag className={classNames(Classes.LARGE, Classes.MINIMAL)}>no date</Tag>
    );
  }
};

export const MomentDateRange = ({
  className,
  range: [start, end],
  withTime = false,
  format = withTime ? FORMAT_TIME : FORMAT
}) => (
  <div className={classNames("docs-date-range", className)}>
    <MomentDate withTime={withTime} date={start} format={format} />
    <Icon className="mx-1 mt-1" icon="arrow-right" />
    <MomentDate withTime={withTime} date={end} format={format} />
  </div>
);
