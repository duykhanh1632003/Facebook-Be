const { Dictionary } = require("./dictionary")


class TrieNode {
    constructor() {
        this.children = {}
        this.isEndOfWord = false
    }
}

class TrieDictionary extends Dictionary{
    constructor() {
        super()
        this.root =new TrieNode()
    }

    insert(word) {
        let node = this.root
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode()
            }
            node = node.children[char]
        }
        node.isEndOfWord = true;

    }

    contains(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                return false
            }
            node = node.children[char]
        }
        return node.isEndOfWord
    }
}

module.exports = { TrieDictionary };
