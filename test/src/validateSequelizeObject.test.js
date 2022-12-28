const Sequelize = require('sequelize');
const validateSequelizeObject = require('../../src/validateSequelizeObject');

describe('test function validateSequelizeObject', () => {
  it('should throw error when passing non object arguments', () => {
    // Given
    const wrongArguments = 'test';

    // When

    // Then
    expect(() => {
      validateSequelizeObject(wrongArguments);
    }).toThrow();
  });

  it('should throw error when passing wrong object arguments', () => {
    // Given
    class ExampleObj {}
    const exampleObj = { name: 'John Doe', age: 12 };
    const exampleObj2 = { name: () => {}, age: () => {} };
    const exampleObj3 = { name: { first: 'John', last: 'Doe' } };
    const exampleObj4 = { name: { type: 'test' } };
    const exampleObj5 = { name: new ExampleObj() };
    const exampleObj6 = { name: { type: new ExampleObj() } };

    // When

    // Then
    expect(() => {
      validateSequelizeObject(exampleObj);
    }).toThrow();
    expect(() => {
      validateSequelizeObject(exampleObj2);
    }).toThrow();
    expect(() => {
      validateSequelizeObject(exampleObj3);
    }).toThrow();
    expect(() => {
      validateSequelizeObject(exampleObj4);
    }).toThrow();
    expect(() => {
      validateSequelizeObject(exampleObj5);
    }).toThrow();
    expect(() => {
      validateSequelizeObject(exampleObj6);
    }).toThrow();
  });

  it('should return previous argument object when arguments/object valid', () => {
    // Given
    const exampleObj = {
      name: Sequelize.DataTypes.STRING,
      age: Sequelize.DataTypes.INTEGER
    };
    const exampleObj2 = {
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      age: { type: Sequelize.DataTypes.INTEGER, defaultValue: 0 }
    };

    // When

    // Then
    expect(validateSequelizeObject(exampleObj)).toMatchObject(exampleObj);
    expect(validateSequelizeObject(exampleObj2)).toMatchObject(exampleObj2);
  });
});
