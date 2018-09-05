function getLines() {
    return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
}
;
export function calculateWinner(squares) {
    var lines = getLines();
    for (var i = 0, len = lines.length; i < len; ++i) {
        var _a = lines[i], a = _a[0], b = _a[1], c = _a[2];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                line: lines[i],
                winner: squares[a],
            };
        }
    }
    return null;
}
export function gameIsUnwinnable(squares, xIsNext) {
    // see if all squares but one are filled
    var nextUp = xIsNext ? 'X' : 'O';
    var filled = 0, potentialWinners = [];
    squares.forEach(function (squareVal) {
        if (squareVal !== null) {
            filled++;
        }
    });
    if (filled !== (squares.length - 1)) {
        return false;
    }
    // see if there are any potential winners
    var lines = getLines();
    lines.forEach(function (line, index) {
        var a = line[0], b = line[1], c = line[2];
        if (!squares[a] || !squares[b] || !squares[c]) {
            if ((!squares[a] && (squares[b] && squares[c]) && (squares[b] === squares[c]) && squares[b] === nextUp) ||
                (!squares[b] && (squares[a] && squares[c]) && (squares[a] === squares[c]) && squares[a] === nextUp) ||
                (!squares[c] && (squares[a] && squares[b]) && (squares[a] === squares[b]) && squares[a] === nextUp)) {
                potentialWinners.push({ line: lines[index], owner: squares[a] || squares[b] || squares[c] });
            }
        }
    });
    return potentialWinners.length === 0;
}
export function gameIsCantLosable(squares, xIsNext) {
    var nextUp = xIsNext ? 'X' : 'O';
    var totalPlays = 0, cantLose = false, potentialWins = {
        'X': 0,
        'Y': 0
    };
    // at least 4 plays
    squares.forEach(function (squareVal) {
        if (squareVal !== null)
            totalPlays++;
    });
    if (totalPlays < 4) {
        return false;
    }
    var lines = getLines();
    for (var i = 0, len = lines.length; i < len; ++i) {
        var _a = lines[i], a = _a[0], b = _a[1], c = _a[2];
        if ((!squares[a] || !squares[b] || !squares[c]) && ( // at least one free space
        squares[a] === squares[b] ||
            squares[b] === squares[c] ||
            squares[a] === squares[c])) {
            var team = squares[a] || squares[b] || squares[c];
            if (team === nextUp) {
                cantLose = true;
                break;
            }
            else {
                potentialWins[team]++;
            }
        }
    }
    return (cantLose === true ||
        potentialWins.Y > 1 ||
        potentialWins.X > 1);
}
//# sourceMappingURL=utils.js.map