function ConvertHandler() {
  
  this.getNum = function(input) {
    let result;
    let fractionParts = input.split('/');
    if (fractionParts.length > 2) {
      return null;
    } else if (input.includes('/')) {
      let num = parseFloat(fractionParts[0]);
      let den = parseFloat(fractionParts[1]);
      if (den === 0) {
        result = null;
      } else {
        result = num / den;
      }
    } else {
      result = parseFloat(input);
      if (isNaN(result)) { 
        return 1;       
      }
    }
    return result;
  };

   this.getUnit = function(input) {
    let unit = '';
    for (let i = input.length - 1; i >= 0; i--) {
      const char = input[i];
      if (/[a-zA-Z]/.test(char)) {
        unit = char + unit;
      } else {
        break;
      }
    }
    unit = unit.toLowerCase(); 

    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg']; 
    if (validUnits.includes(unit)) { 
      return unit; 
    } else {
      return undefined; 
    }
  };
  
  this.getReturnUnit = function(initUnit) {
    let returnUnit;
    switch (initUnit) {
      case 'gal':
        returnUnit = 'l';
        break;
      case 'l':
        returnUnit = 'gal';
        break;
      case 'mi':
        returnUnit = 'km';
        break;
      case 'km':
        returnUnit = 'mi';
        break;
      case 'lbs':
        returnUnit = 'kg';
        break;
      case 'kg':
        returnUnit = 'lbs';
        break;
      default: 
        returnUnit = undefined; 
    }
    return returnUnit;
  };

  this.spellOutUnit = function(unit) {
    let spelledUnit;
    switch (unit) {
      case 'gal':
        spelledUnit = 'gallons';
        break;
      case 'l':
        spelledUnit = 'liters';
        break;
      case 'mi':
        spelledUnit = 'miles';
        break;
      case 'km':
        spelledUnit = 'kilometers';
        break;
      case 'lbs':
        spelledUnit = 'pounds';
        break;
      case 'kg':
        spelledUnit = 'kilograms';
        break;
      default: 
        spelledUnit = undefined; 
    }
    return spelledUnit;
  };
  
  this.convert = function(initNum, initUnit) {
    let result;
    const galToL = 3.78541;
    const lToGal = 0.264172;
    const miToKm = 1.60934;
    const kmToMi = 0.621371;
    const lbsToKg = 0.453592;
    const kgToLbs = 2.20462;

    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'l':
        result = initNum * lToGal;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum * kmToMi;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum * kgToLbs;
        break;
      default: 
        result = undefined; 
    }
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    if (initNum === undefined || initUnit === undefined || returnNum === undefined || returnUnit === undefined) {
      return undefined;
    }
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum.toFixed(5)} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;
