// main.js
const { SetDictionary } = require('./dictionary');
const { TrieDictionary } = require('./trie');
const { SimilarWordSuggester } = require('./suggester');
const { benchmark } = require('./benchmark');
const { DictionaryFactory } = require('./factory');
const userModel = require('../models/user.model');

const words = ['example', 'words', 'for', 'testing']; // Giả sử đã có dữ liệu

const context = {
    dictionary: null,
    setDictionary: function (dictionary) {
        this.dictionary = dictionary;
    },
    contains: function (word) {
        return this.dictionary.contains(word);
    }
};

const setDictionary = DictionaryFactory.createDictionary("Set", words);
context.setDictionary(setDictionary);
console.log("Contains 'example': " + context.contains("example"));

const trieDictionary = DictionaryFactory.createDictionary("Trie", words);
context.setDictionary(trieDictionary);
console.log("Contains 'example': " + context.contains("example"));

const suggester = new SimilarWordSuggester(trieDictionary);
const suggestions = suggester.suggest("exampl");
console.log("Suggestions for 'exampl': " + suggestions);

console.log("SetDictionary: " + benchmark(setDictionary, "example") + " ms");
console.log("TrieDictionary: " + benchmark(trieDictionary, "example") + " ms");
