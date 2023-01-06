const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const createStrapiModule = require('../../src/createStrapiModule');

describe('test function createStrapiModule', () => {
  it('should throw error when data info table name & database not exists, non postgres database included and environment variable STRAPI_DIR not provided', () => {
    // Given
    const exampleObj = {};
    const exampleObj2 = { tableName: 'test', database: 'mysql' };
    const exampleObj3 = { tableName: 'test', database: 'postgres' };

    // When

    // Then
    expect(() => {
      createStrapiModule({}, exampleObj);
    }).toThrow(
      new Error(
        'failed to create strapi module causes : \ntable name and database info should provided'
      )
    );
    expect(() => {
      createStrapiModule({}, exampleObj2);
    }).toThrow(
      new Error(
        'failed to create strapi module causes : \nonly postgresql database supported'
      )
    );
    expect(() => {
      createStrapiModule({}, exampleObj3);
    }).toThrow(
      new Error(
        'failed to create strapi module causes : \nenvironment variable STRAPI_DIR not defined'
      )
    );
  });

  describe('integration test: should generate and create strapi module with spesific location directory', () => {
    beforeAll(() => {
      // Given
      process.env.STRAPI_DIR = path.resolve(__dirname, 'fixtures');
      const sequelizeObj = {
        name: Sequelize.DataTypes.STRING,
        age: Sequelize.DataTypes.INTEGER
      };

      // When
      createStrapiModule(sequelizeObj, {
        tableName: 'contact',
        database: 'postgres'
      });
    });

    it('strapi schema files should exists', () => {
      // Then
      expect(
        fs.existsSync(
          path.resolve(
            process.env.STRAPI_DIR,
            'src/api/contact/content-types/contact',
            'schema.json'
          )
        )
      ).toBe(true);
    });

    it('strapi controller files should exists', () => {
      // Then
      expect(
        fs.existsSync(
          path.resolve(
            process.env.STRAPI_DIR,
            'src/api/contact/controllers',
            'contact.js'
          )
        )
      ).toBe(true);
    });

    it('strapi routes files should exists', () => {
      // Then
      expect(
        fs.existsSync(
          path.resolve(
            process.env.STRAPI_DIR,
            'src/api/contact/routes',
            'contact.js'
          )
        )
      ).toBe(true);
    });

    it('strapi services files should exists', () => {
      // Then
      expect(
        fs.existsSync(
          path.resolve(
            process.env.STRAPI_DIR,
            'src/api/contact/services',
            'contact.js'
          )
        )
      ).toBe(true);
    });

    afterAll(() => {
      // cleanup fixture folder
      fs.rmSync(path.resolve(process.env.STRAPI_DIR, 'src'), {
        force: true,
        recursive: true
      });
      // remove environment variable STRAPI_DIR
      delete process.env.STRAPI_DIR;
    });
  });
});
