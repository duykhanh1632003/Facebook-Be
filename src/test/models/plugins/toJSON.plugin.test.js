/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { Schema } = mongoose;
const  toJSON  = require('../../../../src/models/plugins/toJson.plugin'); // Adjust the path as needed

describe('toJSON plugin', () => {
  let User;
  let userInstance;

  beforeAll(() => {
    // Define a simple schema with some fields
    const userSchema = new Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, private: true }, // Example of a private field
      password: { type: String, required: true, private: true }, // Example of another private field
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    // Apply the toJSON plugin to the schema
    userSchema.plugin(toJSON);

    // Create the User model
    User = mongoose.model('User', userSchema);
  });

  beforeEach(() => {
    // Create a user instance for each test
    userInstance = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'securepassword',
    });
  });

  afterAll(async () => {
    // Clean up after all tests are done
    await mongoose.connection.close();
  });

  test('should replace _id with id', () => {
    const jsonUser = userInstance.toJSON();
    expect(jsonUser.id).toBeDefined();
    expect(jsonUser._id).toBeUndefined();
  });

  test('should remove __v', () => {
    const jsonUser = userInstance.toJSON();
    expect(jsonUser.__v).toBeUndefined();
  });

  test('should remove createdAt and updatedAt by default', () => {
    const jsonUser = userInstance.toJSON();
    expect(jsonUser.createdAt).toBeUndefined();
    expect(jsonUser.updatedAt).toBeUndefined();
  });

  test('should keep createdAt and updatedAt if keepTimestamps option is true', () => {
    const jsonUser = userInstance.toJSON({ keepTimestamps: true });
    expect(jsonUser.createdAt).toBeDefined();
    expect(jsonUser.updatedAt).toBeDefined();
  });

  test('should remove fields with private: true', () => {
    const jsonUser = userInstance.toJSON();
    expect(jsonUser.email).toBeUndefined();
    expect(jsonUser.password).toBeUndefined();
  });
});
