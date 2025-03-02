import React from "react";
import { Result } from "antd";
const ErrorContent = ({ error }) => (
  <Result
    status="warning"
    title={"There are some problems with your operation."}
    subTitle={error}
  />
);
export default ErrorContent;
