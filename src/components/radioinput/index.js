import React, { useState } from "react";
import { RadioGroup, Radio } from "@blueprintjs/core";
import { upperFirst, toLower } from "lodash-es";
import { ROLES } from "constants/index";

const RadioInput = ({ field, form, ...props }) => {
  return (
    <RadioGroup {...field} {...props}>
      {Object.keys(ROLES).map(role => {
        return <Radio label={upperFirst(toLower(role))} value={ROLES[role]} />;
      })}
    </RadioGroup>
  );
};

export default RadioInput;
