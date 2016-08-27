require("./styles/importer.less");
require("sails.io.js");

import jQuery from "jquery";
import moment from 'moment';

jQuery(() => {
  console.log("document loaded");
});

console.log(moment().format('YYYY/MM/DD HH:mm:ss'));
