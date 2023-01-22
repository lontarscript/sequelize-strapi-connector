const { default: generate } = require('@babel/generator');
const translateStrapiModule = require('../../src/translateStrapiModule');

describe('test function translateStrapiModule', () => {
  it('should throw error when not provide or invalid strapi schema json buffer', () => {
    // Given
    const jsonBuffer = null;

    // When

    // Then
    expect(() => {
      translateStrapiModule(jsonBuffer);
    }).toThrow(new Error('invalid json buffer/format'));
  });

  it('should throw error when get invalid tablename data format', () => {
    // Given
    const jsonBuffer = Buffer.from('{ "name": "JohnDoe" }');

    // When

    // Then
    expect(() => {
      translateStrapiModule(jsonBuffer);
    }).toThrow(new Error('cannot get table names from json'));
  });

  it('should throw error when get invalid attributes data format', () => {
    // Given
    const jsonBuffer = Buffer.from('{ "info": {"pluralName": "JohnDoe"} }');

    // When

    // Then
    expect(() => {
      translateStrapiModule(jsonBuffer);
    }).toThrow(new Error('attributes length must more than zero'));
  });

  it('test', () => {
    // Given
    const jsonBuffer = Buffer.from(`
        {
            "info": { "pluralName": "products" },
            "attributes": {
                "name": { "type": "string"  },
                "price": { "type": "biginteger" },
                "stock": { "type": "integer" },
                "isActive": { "type": "boolean" }, 
                "photo": {
                    "type": "media",
                    "allowedTypes": ["images", "files", "videos", "audios"],
                    "multiple": false
                }
            }
        }
    `);

    // When
    const translatedObj = translateStrapiModule(jsonBuffer);

    // Then
    expect(generate(translatedObj.migration).code).not.toBe('');
    expect(generate(translatedObj.model).code).not.toBe('');
  });
});
