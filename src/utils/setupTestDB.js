const mongoose = require("mongoose");
const config = require("../config/config");

const setupTestDB = () => {
    beforeAll(async () => {
        await mongoose.connect(config.mongoose.url, {
            ...config.mongoose.options,
            // Xóa useCreateIndex nếu tồn tại
            useCreateIndex: undefined,
        });
    });

    beforeEach(async () => {
        await Promise.all(
            Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany())
        );
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
};

module.exports = setupTestDB;
