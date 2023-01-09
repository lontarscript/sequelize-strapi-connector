const Connector = require('../../src');

describe('test module index.js', () => {
  it('module should be an object', () => {
    // Given
    const expectedDataTypes = 'object';

    // When
    const moduleDataTypes = typeof Connector;

    // Then
    expect(expectedDataTypes).toStrictEqual(moduleDataTypes);
  });

  it('module should contain certain properties with certain data types', () => {
    // Given
    const expectedProperties = {
      createStrapiModule: 'function',
      deleteStrapiModule: 'function'
    };

    // When
    const checkArrayProperties = [];
    for (const item in expectedProperties) {
      if (Connector?.[item])
        if (typeof Connector[item] === expectedProperties[item]) {
          checkArrayProperties.push(true);
          continue;
        }
      checkArrayProperties.push(false);
    }

    // Then
    expect(checkArrayProperties.length).toBeGreaterThan(0);
    expect(checkArrayProperties.every((x) => x === true)).toStrictEqual(true);
  });

  it('should have immutable properties', () => {
    // Given
    const expectedDataTypes = 'function';

    // When
    Connector.createStrapiModule = 'test';
    Connector.hijackNewModule = () => {};

    // Then
    expect(typeof Connector.createStrapiModule).toStrictEqual(
      expectedDataTypes
    );
    expect(Connector.hijackNewModule).toBe(undefined);
  });
});
