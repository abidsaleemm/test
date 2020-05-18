import React from "react";
import { RadioGroup, Radio } from "@blueprintjs/core";
import { upperFirst, toLower, omit } from "lodash-es";
import PropTypes from "prop-types";
import { ROLES } from "constants/index";

const RadioInput = props => {
  const { field, ...passProps } = props;
  return (
    <RadioGroup {...field} {...omit(passProps, "form")}>
      {Object.keys(ROLES).map(role => {
        return <Radio label={upperFirst(toLower(role))} value={ROLES[role]} />;
      })}
    </RadioGroup>
  );
};

RadioInput.propTypes = {
  field: PropTypes.object
};

export default RadioInput;
