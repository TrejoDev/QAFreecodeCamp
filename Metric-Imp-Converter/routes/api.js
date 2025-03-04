'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      let input = req.query.input;
      let convertHandler = new ConvertHandler();
      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input);

       if (initNum === null) { 
        return res.status(400).json({message: 'invalid number'}); 
      }

      if (!initUnit) { 
        return res.status(400).json({message: 'invalid unit'}); 
      }

      let returnUnit = convertHandler.getReturnUnit(initUnit);
      let returnNum = convertHandler.convert(initNum, initUnit);
      let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      let responseObject = {
        initNum: initNum,
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: toString
      }

      res.json(responseObject);
    });

};
