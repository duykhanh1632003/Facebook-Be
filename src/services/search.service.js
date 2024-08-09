const client = require("../db/init.redis");
const { user } = require("../models/user.model");
const { DictionaryFactory } = require("../predictive-text/factory");

class SearchService {
    static searchUser = async (query) => {
        const cachedResult = await new Promise((resolve, reject) => {
            client.get(String(query), (err, result) => {
                if (err) return reject(err);
                resolve(result ? JSON.parse(result) : null);
            });
        });

        if (cachedResult) {
            return cachedResult;
        }

        const users = await user.find({}).select('_id firstName lastName email avatar'); // Fetch only necessary fields
        const words = users.map(user => user.firstName)
                           .concat(users.map(user => user.lastName))
                           .concat(users.map(user => user.email));

        const dictionary = DictionaryFactory.createDictionary("Trie", words);
        const regex = new RegExp(query, "i");

        const foundUser = users.filter(user => {
            return dictionary.contains(user.firstName.match(regex)) ||
                   dictionary.contains(user.lastName.match(regex)) ||
                   dictionary.contains(user.email.match(regex));
        }).slice(0, 8); // limit to 8 results

        client.set(String(query), JSON.stringify(foundUser), 'EX', 3600); // cache result for 1 hour

        return foundUser;
    }
}

module.exports = SearchService;
