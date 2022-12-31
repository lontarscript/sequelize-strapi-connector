const Sequelize = require('sequelize');
const generateStrapiObject = require('../../src/generateStrapiObject');

describe('test function generateStrapiObject', () => {
  it('should throw error when not provided info table name and database', () => {
    // Given
    const exampleArguments = {};

    // When

    // Then
    expect(() => {
      generateStrapiObject(exampleArguments);
    }).toThrow();
  });

  it('should return certain strapi object', () => {
    // Given
    const exampleSequelizeObject = {
      name: Sequelize.DataTypes.STRING,
      age: {
        type: Sequelize.DataTypes.INTEGER
      },
      photos: {
        strapiType: 'media',
        strapiAllowedTypes: ['images', 'files', 'videos', 'audios'],
        strapiMultiple: false
      }
    };

    // When
    const exampleStrapiObject = generateStrapiObject(exampleSequelizeObject, {
      tableName: 'profile',
      database: 'postgres'
    });

    // Then
    expect(exampleStrapiObject?.collectionName).toStrictEqual('profiles');
    expect(exampleStrapiObject?.info).toMatchObject({
      singularName: 'profile',
      pluralName: 'profiles',
      displayName: 'Profile'
    });
    expect(exampleStrapiObject?.attributes).toMatchObject({
      name: { type: 'string' },
      age: { type: 'integer' },
      photos: {
        type: 'media',
        allowedTypes: ['images', 'files', 'videos', 'audios'],
        multiple: false
      }
    });
  });
});
