'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let num = bankAccount.split('\n'),
        numStr = '';
    num = num.map((x)=> x = x.split(/(.{3})/).filter((x)=> x));

    for(let x=0; x<9; x++) {
        if(num[2][x]==='|_|') {
            if(num[1][x]==='|_|') { numStr += 8; }
            else if(num[1][x]==='|_ ') { numStr += 6; }
            else { numStr += 0; }
        }
        else if(num[2][x]==='  |') {
            if(num[1][x]==='|_|') { numStr += 4; }
            else if(num[0][x]===' _ ') { numStr += 7; }
            else { numStr += 1; }
        }
        else if(num[2][x]===' _|') {
            if(num[1][x]==='|_|') { numStr +=9; }
            else if(num[1][x]===' _|') { numStr +=3; }
            else { numStr += 5; }
        }
        else { numStr += 2; }
    }
    return +numStr;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let indSp = 0,
        str = '';

    while (text) {
        str = text.substring(0, columns+1);
        indSp = str.length<columns ? str.length : str.lastIndexOf(' ');
        yield str.substring(0, indSp);
        text = text.substring(indSp).trim();
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    let card = hand.map((x)=> {
        if(x[0]==='J') { return x = 11; }
        else if(x[0]==='Q') { return x = 12; }
        else if(x[0]==='K') { return x = 13; }
        else if(x[0]==='A') { return x = 14; }
        else if(x[0]==='1') { return x = 10; }
        else { return x = +x[0]; }
    }).sort((a, b)=> a>b),
        flush = hand.every((x, ind, arr)=> x[x.length-1]===arr[0][arr[0].length-1]),
        equal = card.every((x, ind, arr)=> arr.indexOf(x)===arr.lastIndexOf(x));

    if(flush) { return straightSearch(true); }
    else if(equal) { return straightSearch(false); }
    else { return equalCard() }

    function straightSearch (boolFlush) {
        let straight = card.every((x, ind, arr)=> {
            if(ind===arr.length-1 && arr.indexOf(2)+1 && arr.indexOf(14)+1) {
                x = 6;
            }
            return x===arr[0]+ind
        });

        if(straight) {
            return  boolFlush ? PokerRank.StraightFlush : PokerRank.Straight;
        }
        else { return boolFlush ? PokerRank.Flush : PokerRank.HighCard; }
    }

    function equalCard() {
        let cardsIden = card.filter((x, ind, arr)=> ind!==arr.indexOf(x) || ind!==arr.lastIndexOf(x)),
            other = cardsIden.every((x, ind, arr)=> {
                if(!ind || ind===arr[arr.length-1]) {
                    return true;
                }
                return arr[1]===x;
            });

        if(cardsIden.length===4 && other) { return PokerRank.FourOfKind }
        else if(cardsIden.length===5) { return PokerRank.FullHouse }
        else if(cardsIden.length===3) { return PokerRank.ThreeOfKind }
        else if(cardsIden.length===4) { return PokerRank.TwoPairs }
        else if(cardsIden.length===2) { return PokerRank.OnePair }
        else { return  PokerRank.HighCard }
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let myFigure = figure.split('\n');

    while(myFigure.length>2) {
        let height = 0,
            myStr = [''];

        myStr[0] = parse(myStr)+'+';

        for (let x=0; x<myFigure.length; x++) {
            if(myFigure[x+1].indexOf('|')!==-1) {
                myStr.push('|'+' '.repeat(myStr[0].length-2)+'|');
                height++;
            } else { break; }
        }

        myStr.push(myStr[0]);
        yield myStr = myStr.join('\n')+'\n';
        if(myFigure[0].length<2) {
            myFigure.splice(0, height+1); }
    }

    function parse(str) {
        if(myFigure[1].trim().length<myFigure[0].trim().length) {
            myFigure.reverse();
            myFigure.shift();
        }
        let inspectInd,
            ind = myFigure[0].substring(myFigure[0].indexOf('+')+1).indexOf('+')+myFigure[0].indexOf('+')+1,
            find = myFigure[1].substr(myFigure[1].length-myFigure[0].length+ind, 1);

        str[0] += myFigure[0].match(/\+-+|\+/);
        str[0] = str[0].replace(/-\+-/,'---');
        inspectInd = find==='|' || find==='+';
        myFigure[0] = myFigure[0].trim().substring(ind);
        return inspectInd ? str : parse(str);
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
