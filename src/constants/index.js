import { NumericInput, InputGroup, TextArea } from "formik-blueprint";
import * as Yup from "yup";
import moment from "moment";
import DatePicker from "components/DatePicker";

export const DATE_FORMAT = "YYYY/MM/DD";

export const FIELDS = {
  hour: {
    label: "Hour",
    placeholder: "Hour (required)",
    id: "hour",
    type: "text",
    name: "hour",
    component: NumericInput,
    validate: Yup.number()
      .notOneOf([0], "Hour must be over 0!")
      .min(0, "Hour must be over 0!")
      .max(24, "Hour must be less than 24!")
      .required("Required"),
    initialValue: 0
  },
  note: {
    label: "Note",
    placeholder: "Note (required)",
    id: "note",
    type: "text",
    name: "note",
    component: TextArea,
    validate: Yup.string().required("Required"),
    initialValue: ""
  },
  date: {
    label: "Date",
    id: "date",
    component: DatePicker,
    type: "date",
    name: "date",
    formatDate: date => {
      return moment(date).format(DATE_FORMAT);
    },
    parseDate: str => {
      return new Date(str);
    },
    placeholder: DATE_FORMAT,
    maxDate: new Date(),
    canClearSelection: false,
    initialValue: new Date()
  }
};

export const ROLES = {
  USER: 0,
  MANAGER: 1,
  ADMIN: 2
};
