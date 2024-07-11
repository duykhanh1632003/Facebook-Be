const mongoose = require("mongoose");
const { story } = require("../models/story.model");

const updateStories = async () => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const result = await story.updateMany(
    { createdAt: { $lte: twentyFourHoursAgo }, action: true },
    { $set: { action: false } }
  );

  console.log("Updated stories older than 24 hours", result);
};

// Khởi động server và script
const startServerAndScript = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_HTTP, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Chạy script cập nhật stories mỗi giờ
    updateStories();
    setInterval(updateStories, 3600000); // 1 giờ = 3600000 milliseconds

    // Khởi động server Express
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error starting server and script:", error);
  }
};

startServerAndScript();
