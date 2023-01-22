const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const deleteStrapiModule = require('../../src/deleteStrapiModule');
const createStrapiModule = require('../../src/createStrapiModule');

describe('test function deleteStrapiModule', () => {
  it('should throw error when passing with wrong datatype arguments', () => {
    // Given
    const exampleArgs = [null, null];
    const exampleArgs1 = [1, {}];
    const exampleArgs2 = ['./fixtures', 'test'];

    // When

    // Then
    expect(() => {
      deleteStrapiModule(...exampleArgs);
    }).toThrow(
      new Error(
        'failed to delete strapi module causes : \nfilepath or collection name must be provided'
      )
    );
    expect(() => {
      deleteStrapiModule(...exampleArgs1);
    }).toThrow(
      new Error(
        'failed to delete strapi module causes : \nfilepath or collection name has wrong data type'
      )
    );
    expect(() => {
      deleteStrapiModule(...exampleArgs2);
    }).toThrow(
      new Error(
        'failed to delete strapi module causes : \nstrapi file path is not found or valid'
      )
    );
  });

  it('should cleanup/delete strapi module from given arguments', () => {
    // Given
    const dir = path.resolve(__dirname, 'fixtures');
    const exampleArgs = [dir, 'contact'];
    const sequelizeObj = {
      id: Sequelize.DataTypes.UUID,
      name: Sequelize.DataTypes.STRING,
      age: Sequelize.DataTypes.INTEGER
    };

    // When
    process.env.STRAPI_DIR = dir;
    createStrapiModule(sequelizeObj, {
      tableName: 'contact',
      database: 'postgres'
    });
    const moduleBeforeDelete = fs.existsSync(
      path.resolve(dir, 'src/api/contact')
    );
    deleteStrapiModule(...exampleArgs);
    const moduleAfterDelete = fs.existsSync(
      path.resolve(dir, 'src/api/contact')
    );

    // Then
    expect(moduleBeforeDelete).toBe(true);
    expect(moduleAfterDelete).toBe(false);
  });

  afterAll(() => {
    fs.rmSync(path.resolve(__dirname, 'fixtures', 'src'), {
      force: true,
      recursive: true
    });
  });
});
