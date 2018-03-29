import React from "react";
import { render } from "react-dom";
import HomePage from "./containers/HomePage";

import "./app.global.css";

render(<HomePage />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept("./containers/HomePage", () => {
    const NextRoot = require("./containers/HomePage"); // eslint-disable-line global-require
    render(<NextRoot />, document.getElementById("root"));
  });
}
