import React from "react";
import { DateInput } from "@blueprintjs/datetime";

const DatePicker = ({ field, form, ...props }) => {
  return <DateInput {...field} {...props} />;
};

export default DatePicker;
