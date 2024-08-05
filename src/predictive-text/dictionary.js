class Dictionary  {
    contains(words) {
        throw new Error("Method contains() must be implemented")
    }
}

class SetDictionary extends Dictionary {
    constructor(words) {
        super()
        this.words = new Set(words)
    }

    contains(word) {
        return this.words.has(word)
    }
}

module.exports = { Dictionary, SetDictionary };
