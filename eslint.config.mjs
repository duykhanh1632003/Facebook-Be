import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: globals.node, // Thiết lập môi trường Node.js
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      // Các quy tắc tùy chỉnh (nếu cần)
      "no-console": "off", // Cho phép sử dụng console.log
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Cảnh báo nhưng bỏ qua các biến bắt đầu bằng dấu gạch dưới
      // Thêm các quy tắc khác tùy thuộc vào nhu cầu của bạn
    },
  },
];
