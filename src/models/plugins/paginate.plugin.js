const paginate = (schema) => {
    schema.statics.paginate = async function (filter, options) {
        // Xử lý sắp xếp
        let sort = options.sortBy ? options.sortBy.split(',').map(sortOption => {
            const [key, order] = sortOption.split(':');
            return `${order === 'desc' ? '-' : ''}${key}`;
        }).join(' ') : 'createdAt';

        // Tính toán giới hạn và trang
        const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
        const page = Math.max(parseInt(options.page, 10) || 1, 1);
        const skip = (page - 1) * limit;

        try {
            // Thực hiện đếm và truy vấn
            const [totalResults, results] = await Promise.all([
                this.countDocuments(filter).exec(),
                this.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .populate(
                        options.populate ? 
                        options.populate.split(',').map(populateOption => 
                            populateOption.split('.').reverse().reduce((a, b) => ({ path: b, populate: a }), {})
                        ) : []
                    )
                    .exec()
            ]);

            const totalPages = Math.ceil(totalResults / limit);
            return { results, page, limit, totalPages, totalResults };
        } catch (error) {
            return Promise.reject(new Error('Error occurred during pagination',error));
        }
    };
};

module.exports = paginate;
