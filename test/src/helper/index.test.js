const helper = require('../../../src/helper');

describe('test function helper', () => {
  it('should return certain value when passing non valid arguments', () => {
    // Given
    const textExample = false;
    const textExample1 = {};
    const textExample2 = [];

    // When
    const isPlural = helper.isPlural(textExample);
    const singular = helper.makeSingular(textExample1);
    const plural = helper.makePlural(textExample2);

    // Then
    expect(isPlural).toStrictEqual(false);
    expect(singular).toStrictEqual('');
    expect(plural).toStrictEqual('');
  });

  it('should return certain value when passing valid arguments', () => {
    // Given
    const textExample = 'doctors';
    const textExample1 = 'users';
    const textExample2 = 'patient';

    // When
    const isPlural = helper.isPlural(textExample);
    const singular = helper.makeSingular(textExample1);
    const plural = helper.makePlural(textExample2);

    // Then
    expect(isPlural).toStrictEqual(true);
    expect(singular).toStrictEqual('user');
    expect(plural).toStrictEqual('patients');
  });
});
