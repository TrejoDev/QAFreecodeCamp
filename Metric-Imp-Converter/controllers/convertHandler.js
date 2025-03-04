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
      return (unit === 'l') ? 'L' : unit; 
    } else {
      return undefined; 
    }
  };
  
  this.getReturnUnit = function(initUnit) {
    let returnUnit;
    switch (initUnit) {
      case 'gal':
        returnUnit = 'L';
        break;
      case 'L':
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
      case 'L':
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
    const lToGal = 1 / galToL;
    const lbsToKg = 0.453592;
    const kgToLbs = 1 / lbsToKg;
    const miToKm = 1.60934;
    const kmToMi = 1 / miToKm; 

    switch (initUnit) {
      case 'gal':
        result = (initNum * galToL).toFixed(5); 
        break;
      case 'L':
        result = (initNum * lToGal).toFixed(5); 
        break;
      case 'lbs':
        result = (initNum * lbsToKg).toFixed(5); 
        break;
      case 'kg':
        result = (initNum * kgToLbs).toFixed(5); 
        break;
      case 'mi':
        result = (initNum * miToKm).toFixed(5); 
        break;
      case 'km':
        result = (initNum * kmToMi).toFixed(5); 
        break;
      default:
        result = undefined; 
    }
    return Number(result);
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    if (initNum === undefined || initUnit === undefined || returnNum === undefined || returnUnit === undefined) {
      return undefined;
    }
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum.toFixed(5)} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;
