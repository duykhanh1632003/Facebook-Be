/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const toJSON = (schema) => {
    let transform;
  
    if (schema.options.toJSON && schema.options.toJSON.transform) {
      transform = schema.options.toJSON.transform;
    }
  
    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
      transform(doc, ret, options) {
        // Loại bỏ các trường không cần thiết
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
  
        // Nếu muốn giữ lại `createdAt` hoặc `updatedAt`, có thể thêm tùy chọn tại đây
        if (!options || !options.keepTimestamps) {
          delete ret.createdAt;
          delete ret.updatedAt;
        }
  
        // Loại bỏ các trường có `private: true`
        Object.keys(schema.paths).forEach((path) => {
          if (schema.paths[path].options && schema.paths[path].options.private) {
            const keys = path.split('.');
            let obj = ret;
  
            while (keys.length > 1) {
              obj = obj[keys.shift()];
              if (!obj) return;
            }
  
            delete obj[keys.shift()];
          }
        });
  
        // Gọi lại hàm transform nếu có
        if (transform) {
          return transform(doc, ret, options);
        }
  
        return ret;
      },
    });
  };
  
  module.exports = toJSON;
  