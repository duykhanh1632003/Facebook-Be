class SimilarWordSuggester {
    constructor(dictionary) {
        this.dictionary = dictionary

    }

    suggest(word) {
        const suggestions  = []
        const allWords = this.getAllWords()
        for (const w of allWords) {
            if (this.levenshteinDistance(w, word) <= 2) {
                suggestions.push(w)
            }
        }
        return suggestions 
    }

    getAllWords() {
        //phan nay gia su tat ca cac tu da co trong tu dien

        return []
    }

    levenshteinDistance(a, b) {
        const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0)) 
        for (let i = 0; i <= a.length; i += 1) dp[i][0] = i
        for (let j = 0; j <= b.length; j += 1) dp[0][j] = j
        
        for (let i = 1; i <= a.length; i += 1){
            for (let j = 1; j <= b.length; j += 1){
                if (a[i - 1] == a[j - 1]) {
                    dp[i][j] = dp[i-1][j-1]
                }
                else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]);
                }
            }
        }
    }
}


module.exports = { SimilarWordSuggester };
