/**
 * HelloController
 *
 * @description :: Server-side logic for managing helloes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: (req, res)=>{
	  res.json({
	    response: "world"
    });
  }}
;

