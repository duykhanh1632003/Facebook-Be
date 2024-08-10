const mongoose = require('mongoose');
const setupTestDB = require('../../utils/setupTestDB');
const paginate = require('../../models/plugins/paginate.plugin');

// Setup test database
setupTestDB();

describe('Paginate Plugin', () => {
  let User;

  beforeAll(() => {
    // Define a simple schema with some fields
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      age: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    });

    // Apply the paginate plugin to the schema
    userSchema.plugin(paginate);

    // Create the User model
    User = mongoose.model('User', userSchema);
  });

  beforeEach(async () => {
    // Clear previous data
    await User.deleteMany({});

    // Insert sample data before each test
    await User.insertMany([
      { name: 'User1', email: 'user1@example.com', age: 25 },
      { name: 'User2', email: 'user2@example.com', age: 30 },
      { name: 'User3', email: 'user3@example.com', age: 22 },
      { name: 'User4', email: 'user4@example.com', age: 28 },
      { name: 'User5', email: 'user5@example.com', age: 35 },
    ]);
  });

  test('should paginate results correctly', async () => {
    const options = { page: 1, limit: 2 };
    const result = await User.paginate({}, options);

    expect(result.results).toHaveLength(2);
    expect(result.totalResults).toBe(5);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(1);
  });

  test('should sort results correctly', async () => {
    const options = { page: 1, limit: 2, sortBy: 'age:desc' };
    const result = await User.paginate({}, options);

    expect(result.results[0].age).toBe(35); // First result should be the oldest
    expect(result.results[1].age).toBe(30); // Second result should be the second oldest
  });

  test('should return correct results for a specific page', async () => {
    const options = { page: 2, limit: 2 };
    const result = await User.paginate({}, options);

    expect(result.results).toHaveLength(2);
    expect(result.page).toBe(2);
  });

  test('should handle population', async () => {
    const options = { page: 1, limit: 2, populate: 'friends' };

    // Define a schema that includes the required fields
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      age: { type: Number, required: true },
      friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    });

    userSchema.plugin(paginate);

    const UserWithFriends = mongoose.model('UserWithFriends', userSchema);

    // Clear previous data
    await UserWithFriends.deleteMany({});

    // Create sample users with the required fields
    const user1 = await UserWithFriends.create({ name: 'User1', email: 'user1@example.com', age: 25 });
    const user2 = await UserWithFriends.create({ name: 'User2', email: 'user2@example.com', age: 30, friends: [user1._id] });

    const result = await UserWithFriends.paginate({}, options);

    expect(result.results[0].friends).toHaveLength(1);
    expect(result.results[0].friends[0]._id.toString()).toBe(user1._id.toString());
  });

  test('should return an error if something goes wrong during pagination', async () => {
    jest.spyOn(User, 'countDocuments').mockImplementation(() => {
      throw new Error('Database Error');
    });

    await expect(User.paginate({}, { page: 1, limit: 2 })).rejects.toThrow('Error occurred during pagination');
  });
});
