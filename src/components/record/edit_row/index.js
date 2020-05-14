import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import _ from "lodash-es";
import {
  Button,
  Dialog,
  Intent,
  Classes,
  FormGroup,
  ProgressBar
} from "@blueprintjs/core";
import moment from "moment";
import { updateRecord, getRecords } from "store/actions/record";
import { showToast } from "store/actions/toast";
import { DATE_FORMAT, RECORD_FIELDS } from "constants/index";

const EditRow = props => {
  const { updateRecord, params, getRecords, showToast, selectedRow } = props;
  const [isOpen, toggleDialog] = useState(false);
  const [toDate, selectDate] = useState(new Date(selectedRow.date));

  const fieldList = ["date", "note", "hour"];

  const validation = {};
  _.toPairs(_.pick(RECORD_FIELDS, fieldList)).map(
    a => (validation[a[0]] = _.get(a[1], "validate", null))
  );
  const validateSchema = Yup.object().shape(validation);

  const handleSubmit = (values, actions) => {
    values["date"] = moment(toDate).format(DATE_FORMAT);
    updateRecord({
      id: selectedRow._id,
      body: values,
      success: () => {
        actions.setSubmitting(false);
        getRecords({ params });
        showToast({
          message: "Successfully updated the row to table!",
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

  const passProps = {
    onChange: date => {
      selectDate(date);
    },
    value: toDate
  };

  const initialValue = {};
  _.toPairs(_.pick(RECORD_FIELDS, fieldList)).map(
    a => (initialValue[a[0]] = _.get(selectedRow, a[0], ""))
  );

  return (
    <>
      <Button
        icon="edit"
        className={Classes.MINIMAL}
        intent={Intent.PRIMARY}
        onClick={() => toggleDialog(true)}
      >
        Edit
      </Button>
      <Dialog
        icon="edit"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Edit Entry"
        className={Classes.DARK}
      >
        <div className={Classes.DIALOG_BODY}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValue}
            validationSchema={validateSchema}
          >
            {({ submitForm, isSubmitting, errors }) => {
              return (
                <Form>
                  {fieldList.map(field => {
                    return (
                      <FormGroup
                        helperText={errors[field]}
                        intent={errors[field] ? Intent.DANGER : Intent.NONE}
                        label={RECORD_FIELDS[field].form_label}
                        labelFor={RECORD_FIELDS[field].id}
                      >
                        <Field
                          {...RECORD_FIELDS[field]}
                          {...(field === "date" ? passProps : null)}
                        />
                      </FormGroup>
                    );
                  })}
                  {isSubmitting && <ProgressBar />}
                  <br />
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={() => toggleDialog(false)} />
                    <Button
                      icon="edit"
                      intent={Intent.PRIMARY}
                      onClick={submitForm}
                      text="Edit"
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
  updateRecord: updateRecord,
  getRecords: getRecords,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditRow);
