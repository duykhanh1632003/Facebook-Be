# Sử dụng image Node.js chính thức
FROM node:20

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose port mà ứng dụng sử dụng
EXPOSE 8000

# Chạy ứng dụng
CMD ["node", "server.js"]
