'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let path = Array.from({length:puzzle.length}, (x)=> x=[]),
        letter = 0;

    function search(x, y) {
        for(let row = x || 0; row<puzzle.length; row++) {
            for(let column = y || 0; column<puzzle[0].length; column++) {

                if(letter===searchStr.length-1) { return true; }

                if(searchStr[letter]===puzzle[row][column]) {

                    let rowSearhR = puzzle[row][column+1]===searchStr[letter+1],
                        rowSearhL = puzzle[row][column-1]===searchStr[letter+1],
                        upSearh = puzzle[row-1] ? puzzle[row-1][column]===searchStr[letter+1] : false,
                        downSearh = puzzle[row+1] ? puzzle[row+1][column]===searchStr[letter+1] : false;

                    if(rowSearhR || rowSearhL || upSearh || downSearh) {

                        let result = [];
                        path[row][letter] = column;
                        letter++;

                        if(rowSearhR && path[row].indexOf(column+1)<0) { result.push(search(row, column+1)); }
                        if(rowSearhL && path[row].indexOf(column-1)<0) { result.push(search(row, column-1)); }
                        if(upSearh && path[row-1].indexOf(column)<0) { result.push(search(row-1, column)); }
                        if(downSearh && path[row+1].indexOf(column)<0) { result.push(search(row+1, column)); }

                        result = result.some((x)=> x===true);

                        if(result) { return true; }

                        path[row].pop();
                        letter--;

                    }
                }
                if(letter!==0) { return false; }
            }
        }
        return false;
    }
    return search();
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    let myStr = chars.split(''),
        len = myStr.length,
        comb = myStr.reduce((x,y,ind)=> ind>0 ? x*ind : x, 1)/(len<3 ? 1 : len-2);

    function replace(ind1, ind2) {
        if(len>1) {
            let letter = myStr[ind1];
            ind2 = ind2 || ind1+1;
            myStr[ind1] = myStr[ind2];
            myStr[ind2] = letter;
        }
    }

    for(let x=1; x<=len; x++) {
        for(let y=comb; y--;) {
            for (let z=1; z<len-1; z++) {
                replace(z);
                yield myStr.join('');
            }
        }
        replace(0, x);
        if(len<3) { yield myStr.join(''); }
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let profit = 0,
        maxPrice = quotes[quotes.length-1];

    for (let x=quotes.length; x--;) {
        if(quotes[x]>maxPrice) {
            maxPrice = quotes[x];
        }
        else {
            profit = profit+(maxPrice-quotes[x])
        }
    }
    return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {

        let str = '';

        for(let x=0; x<url.length; x++) {

            str += this.urlAllowedChars.indexOf(url[x])<10
                   ?'0'+this.urlAllowedChars.indexOf(url[x])
                   :this.urlAllowedChars.indexOf(url[x]);
            if(x%2 && x!==url.length-1) { str += ',';}
        }
        str = str.split(',').map((x)=> x = String.fromCharCode((+x)+20000));
        return str.join('');
    },

    decode: function(code) {
        return code.split('').map((x)=> {
                    x = ''+ (x.charCodeAt(0)-20000);
                    if(x.length===3) { x = '0'+x; }
                    if(x.length===2) {
                        return x = this.urlAllowedChars[+x]
                    }
                    else {
                        return x = this.urlAllowedChars[+x.slice(0, 2)] + this.urlAllowedChars [+x.slice(2)];
                    }
                }).join('');
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
