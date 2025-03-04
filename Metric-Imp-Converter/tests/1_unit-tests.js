const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){

    test('convertHandler should correctly read a whole number input', function() {
      let input = '32';
      assert.equal(convertHandler.getNum(input), 32);
    });

    test('convertHandler should correctly read a decimal number input', function() {
      let input = '3.14';
      assert.equal(convertHandler.getNum(input), 3.14);
    });

    test('convertHandler should correctly read a fractional input', function() {
      let input = '1/2';
      assert.equal(convertHandler.getNum(input), 0.5);
    });

    test('convertHandler should correctly read a fractional input with a decimal', function() {
      let input = '1.5/2.5';
      assert.equal(convertHandler.getNum(input), 0.6);
    });

    test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3)', function() {
      let input = '3/2/3';
      assert.isNull(convertHandler.getNum(input), 'Double-fraction should return null');
    });

     test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', function() {
      let input = 'kg';
      assert.equal(convertHandler.getNum(input), 1);
    });

    test('convertHandler should correctly read each valid input unit', function() {
      var inputStrings = ['gal','GAL','l','L','mi','MI','km','KM','lbs','LBS','kg','KG'];
      inputStrings.forEach(function(input) {
        assert.isString(convertHandler.getUnit(input), 'getUnit should return a string');
        assert.oneOf(convertHandler.getUnit(input), ['gal','l','mi','km','lbs','kg'], 'getUnit should return a valid unit');
      });
    });

    test('convertHandler should correctly return an error for an invalid input unit', function() {
      var invalidUnits = ['кака','илвалидна','утнит','што','ес','това','kgz','mile','pounds','gallons','litros']; // Lista de unidades inválidas (ejemplos)
      invalidUnits.forEach(function(input) {
        assert.isUndefined(convertHandler.getUnit(input), 'getUnit should return undefined for invalid unit');
      });
    });

    test('convertHandler should return the correct return unit for each valid input unit', function() {
      var inputUnits = ['gal','l','mi','km','lbs','kg'];
      var expectedReturnUnits = ['l','gal','km','mi','kg','lbs'];
      inputUnits.forEach(function(inputUnit, index) {
        assert.equal(convertHandler.getReturnUnit(inputUnit), expectedReturnUnits[index], 'getReturnUnit should return the correct unit for '+inputUnit);
      });
    });

    test('convertHandler should correctly return the spelled-out string unit for each valid input unit', function() {
      var inputUnits = ['gal','l','mi','km','lbs','kg'];
      var expectedSpellOutUnits = ['gallons','liters','miles','kilometers','pounds','kilograms'];
      inputUnits.forEach(function(inputUnit, index) {
        assert.equal(convertHandler.spellOutUnit(inputUnit), expectedSpellOutUnits[index], 'spellOutUnit should return the spelled out unit for '+inputUnit);
      });
    });

    test('convertHandler should correctly convert gal to L', function() {
      let input = [5, 'gal']; // [número, unidad] - Entrada para la conversión
      let expectedConversion = 18.92705; // Valor esperado de 5 galones en litros (aproximado)
      assert.approximately(convertHandler.convert(input[0], input[1]), expectedConversion, 0.1, 'convert gal to L should be approximately correct');
    });

    test('convertHandler should correctly convert L to gal', function() {
      let input = [5, 'l']; // [número, unidad] - Entrada para la conversión
      let expectedConversion = 1.32086; // Valor esperado de 5 litros en galones (aproximado)
      assert.approximately(convertHandler.convert(input[0], input[1]), expectedConversion, 0.1, 'convert L to gal should be approximately correct');
    });

    test('convertHandler should correctly convert mi to km', function() {
      let input = [5, 'mi'];
      let expectedConversion = 8.0467;
      assert.approximately(convertHandler.convert(input[0], input[1]), expectedConversion, 0.1, 'convert mi to km should be approximately correct');
    });

    test('convertHandler should correctly convert km to mi', function() {
      let input = [5, 'km'];
      let expectedConversion = 3.106855;
      assert.approximately(convertHandler.convert(input[0], input[1]), expectedConversion, 0.1, 'convert km to mi should be approximately correct');
    });

    test('convertHandler should correctly convert lbs to kg', function() {
      let input = [5, 'lbs'];
      let expectedConversion = 2.26796;
      assert.approximately(convertHandler.convert(input[0], input[1]), expectedConversion, 0.1, 'convert lbs to kg should be approximately correct');
    });

    test('convertHandler should correctly convert kg to lbs', function() {
      let input = [5, 'kg'];
      let expectedConversion = 11.0231;
      assert.approximately(convertHandler.convert(input[0], input[1]), expectedConversion, 0.1, 'convert kg to lbs should be approximately correct');
    });

});