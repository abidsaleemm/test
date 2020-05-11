import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { NumericInput, TextArea } from "formik-blueprint";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import {
  Button,
  Dialog,
  Intent,
  Classes,
  FormGroup,
  ProgressBar
} from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import moment from "moment";
import { createRecord, getRecords } from "store/actions/record";
import { showToast } from "store/actions/toast";

const validateSchema = Yup.object().shape({
  note: Yup.string().required("Required"),
  hour: Yup.number()
    .notOneOf([0], "Hour must be over 0!")
    .min(0, "Hour must be over 0!")
    .max(24, "Hour must be less than 24!")
    .required("Required")
});

const DatePicker = ({ field, form, ...props }) => {
  return <DateInput {...field} {...props} />;
};

const AddRow = props => {
  const { createRecord, params, getRecords, showToast } = props;
  const [isOpen, toggleDialog] = useState(false);
  const [date, selectDate] = useState(new Date());

  const handleSubmit = (values, actions) => {
    values["date"] = moment(date).format("YYYY/MM/DD");
    createRecord({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        getRecords({ params });
        showToast({
          message: "Successfully added one row to table!",
          intent: Intent.SUCCESS,
          timeout: 3000
        });
        toggleDialog(false);
      },
      fail: err => {
        actions.setSubmitting(false);
        showToast({
          message: err.response.data,
          intent: Intent.DANGER
        });
      }
    });
  };

  const jsDateFormatter = {
    formatDate: date => {
      return moment(date).format("YYYY/MM/DD");
    },
    parseDate: str => {
      return new Date(str);
    },
    placeholder: "YYYY/MM/DD"
  };

  return (
    <>
      <Button icon="add" onClick={() => toggleDialog(true)}>
        Add
      </Button>
      <Dialog
        icon="add"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Add Row"
      >
        <div className={Classes.DIALOG_BODY}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={{ note: "", hour: 0 }}
            validationSchema={validateSchema}
          >
            {({
              submitForm,
              isSubmitting,
              errors: { date: dateError, note: noteError, hour: hourError }
            }) => {
              return (
                <Form>
                  <FormGroup
                    helperText={dateError}
                    intent={dateError ? Intent.DANGER : Intent.NONE}
                    label="Date"
                    labelFor="date"
                  >
                    <Field
                      component={DatePicker}
                      placeholder="Date"
                      id="date"
                      name="date"
                      type="date"
                      label="Date"
                      onChange={date => {
                        selectDate(date);
                      }}
                      value={date}
                      maxDate={new Date()}
                      canClearSelection={false}
                      large
                      {...jsDateFormatter}
                    />
                  </FormGroup>
                  <FormGroup
                    helperText={noteError}
                    intent={noteError ? Intent.DANGER : Intent.NONE}
                    label="Note"
                    labelFor="note"
                  >
                    <Field
                      component={TextArea}
                      placeholder="Note"
                      id="note"
                      name="note"
                      type="text"
                      intent={noteError ? Intent.DANGER : Intent.NONE}
                      label="Note"
                      large
                    />
                  </FormGroup>
                  <FormGroup
                    helperText={hourError}
                    intent={hourError ? Intent.DANGER : Intent.NONE}
                    label="Hour"
                    labelFor="hour"
                  >
                    <Field
                      component={NumericInput}
                      intent={hourError ? Intent.DANGER : Intent.NONE}
                      placeholder="Hour (required)"
                      id="hour"
                      name="hour"
                      type="text"
                      large
                    />
                  </FormGroup>
                  {isSubmitting && <ProgressBar />}
                  <br />
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={() => toggleDialog(false)} />
                    <Button
                      icon="add"
                      intent={Intent.PRIMARY}
                      onClick={submitForm}
                      text="Add"
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = state => ({
  params: state.record.params
});

const mapDispatchToProps = {
  createRecord: createRecord,
  getRecords: getRecords,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(AddRow);
