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

        if (query) {
            return query;
        }
        console.log("users",users);

        const users = await user.find({}).select('_id firstName lastName email avatar'); // Fetch only necessary fields
        console.log("users",users);

        const words = users.map(user => user.firstName)
                           .concat(users.map(user => user.lastName))
                           .concat(users.map(user => user.email));

        const dictionary = DictionaryFactory.createDictionary("Trie", words);
        const regex = new RegExp(query, "i");
        console.log("dictionary",dictionary);

        const foundUser = users.filter(user => {
            const firstNameMatch = user.firstName.match(regex);
            const lastNameMatch = user.lastName.match(regex);
            const emailMatch = user.email.match(regex);
            
            return (firstNameMatch && dictionary.contains(firstNameMatch[0])) ||
                   (lastNameMatch && dictionary.contains(lastNameMatch[0])) ||
                   (emailMatch && dictionary.contains(emailMatch[0]));
        }).slice(0, 8); // limit to 8 results

        client.set(String(query), JSON.stringify(foundUser), 'EX', 3600); // cache result for 1 hour
        console.log("foundUser",foundUser);
        return foundUser;   
    }
}

module.exports = SearchService;
