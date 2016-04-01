'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N', 'E', 'S', 'W'];  // use array of cardinal directions only!
    let result = [];

    for(let x=0; x<=348.75; x+=11.25) {
        let str, str1, str2,
            strR = { abbreviation : 'none',   azimuth : x },

            azimCoord = x/11.25,
            pos = azimCoord%8;

        azimCoord = Math.floor((azimCoord/8));
        str = sides[azimCoord];
        str1 = sides[(azimCoord+1)%4];
        str2 = (str===sides[0] || str===sides[2]) ? str+str1 : str1+str;

        switch (pos){
            case 0: strR.abbreviation = str;
                break;
            case 1: strR.abbreviation = str+'b'+str1;
                break;
            case 2: strR.abbreviation = str+str2;
                break;
            case 3: strR.abbreviation = str2+'b'+str;
                break;
            case 4: strR.abbreviation = str2;
                break;
            case 5: strR.abbreviation = str2+'b'+str1;
                break;
            case 6: strR.abbreviation = str1+str2;
                break;
            case 7: strR.abbreviation = str1+'b'+str;
                break;
        }
        result.push(strR);
}
    return result;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let myArr = [str],
        left = 0;

    for(let x = 0; myArr[0].indexOf('{')>-1; x++) {
        if(myArr[0][x]==='{') {
            left = x;
        }
        if(myArr[0][x]==='}') {
            parse(myArr[0].substring(left+1, x));
            x = 0;
        }
    }
    for(let x of myArr) {
        yield x;
    }

    function parse(string) {
        let completed = [],
            arr = string.split(',');
        for(let x of arr) {
            completed.push(myArr[0].replace('{'+string+'}', x));
        }
        myArr.shift();
        completed.map((x)=> {if(myArr.indexOf(x)===-1) myArr.push(x)});
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let zigZag = Array.from({length: n},()=> Array.from({length: n})),
        x=0,
        y=0;

    for(var z=0; z<n*n; z++) {
        zigZag[x][y] = z;
        if((x+y)%2===0) {
            if(y<n-1) {
                y++;
            } else {
                x += 2;
            }
            if(x>0) {
                x--;
            }
        } else {
            if(x<n-1) {
                x++;
            } else {
                y += 2;
            }
            if(y>0) {
                y--;
            }
        }
    }
    return zigZag;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let entryNum = Array.from({length: 7}, ()=> 0),
        result = 3;

    dominoes.map((x, ind)=> {
        if(x[0]===x[1] && !dominoes.some((y, index)=> ind!==index && (y[0]===x[0] || y[1]===x[0]))) {
            result--;
        } else {
            x.map((x)=> entryNum[x]++)
        }
    });

    for(let x=entryNum.length; x--;) {
        if(entryNum[x]%2!==0) {
            result--;
        }
    }
    return result>0;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let result = '',
        //undef = (x)=> result ? ','+nums[x] : nums[x],
        x = 0;

    while (x<nums.length) {
        if(nums[x]+2!==nums[x+2]) {
            result += result ? ','+nums[x] : nums[x];
            x++;
        } else {
            result += result ? ','+nums[x] : nums[x];
            x++;
            while (nums[x]+1===nums[x+1]) {
                x++;
            }
            result += '-'+nums[x];
            x++;
        }
    }
    return result;
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
