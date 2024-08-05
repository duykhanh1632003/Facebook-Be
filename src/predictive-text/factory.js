// factory.js
const { SetDictionary } = require('./dictionary');
const { TrieDictionary } = require('./trie');

class DictionaryFactory {
    static createDictionary(type, words) {
        if (type === "Set") {
            return new SetDictionary(words);
        } else if (type === "Trie") {
            const trie = new TrieDictionary();
            words.forEach(word => trie.insert(word));
            return trie;
        }
        throw new Error("Unknown dictionary type: " + type);
    }
}

module.exports = { DictionaryFactory };
