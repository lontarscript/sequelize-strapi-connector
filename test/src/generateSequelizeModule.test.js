const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const createStrapiModule = require('../../src/createStrapiModule');
const generateSequelizeModule = require('../../src/generateSequelizeModule');

describe('test function generateSequelizeModule', () => {
  it('should throw error when get wrong arguments', () => {
    // Given
    const dir = path.resolve(__dirname, 'fixtures');
    const exampleArguments = ['./fixtures', null, dir];
    const exampleArguments2 = [dir, null, './fixtures'];
    const exampleArguments3 = [dir, null, dir];
    const exampleArguments4 = [dir, 'contact', dir];

    // When

    // Then
    expect(() => {
      generateSequelizeModule(...exampleArguments);
    }).toThrow(new Error('source path not exists'));
    expect(() => {
      generateSequelizeModule(...exampleArguments2);
    }).toThrow(new Error('target path not exists'));
    expect(() => {
      generateSequelizeModule(...exampleArguments3);
    }).toThrow(new Error('collection name not provided or not valid'));
    expect(() => {
      generateSequelizeModule(...exampleArguments4);
    }).toThrow(new Error('strapi schema.json files not found'));
  });

  describe('integration test: should generate files in spesific folder', () => {
    beforeAll(() => {
      fs.mkdirSync(path.resolve(__dirname, 'fixtures/src/api'), {
        recursive: true
      });
      process.env.STRAPI_DIR = path.resolve(__dirname, 'fixtures');
      createStrapiModule(
        { name: Sequelize.STRING, age: Sequelize.INTEGER },
        { tableName: 'contacts', database: 'postgres' }
      );
    });

    it('should create file sequelize migrations and models', () => {
      // Given
      const collectionNames = 'contact';
      const TARGET_PATH = path.resolve(__dirname, 'fixtures');

      // When
      generateSequelizeModule(
        process.env.STRAPI_DIR,
        collectionNames,
        TARGET_PATH
      );

      // Then
      expect(
        fs.existsSync(path.resolve(__dirname, 'fixtures/migrations'))
      ).toBe(true);
      expect(fs.existsSync(path.resolve(__dirname, 'fixtures/models'))).toBe(
        true
      );
    });

    afterAll(() => {
      fs.rmSync(path.resolve(__dirname, 'fixtures/src'), {
        force: true,
        recursive: true
      });
      fs.rmSync(path.resolve(__dirname, 'fixtures/migrations'), {
        force: true,
        recursive: true
      });
      fs.rmSync(path.resolve(__dirname, 'fixtures/models'), {
        force: true,
        recursive: true
      });
    });
  });
});
