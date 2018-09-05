function getLines() {
    return [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
}

export function calculateWinner(squares) {
   const lines  = getLines();

    for (let i = 0, len = lines.length; i < len; ++i) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i],
            };
        }
    }

    return null;
}

export function gameIsUnwinnable(squares, xIsNext) {
    // see if all squares but one are filled
    let filled = 0;
    let potentialWinners = [];
    const nextUp = xIsNext ? 'X' : 'O';

    squares.forEach(squareVal => {
        if (squareVal !== null) filled++;
    });

    if (filled !== (squares.length - 1)) {
        return false;
    }

    // see if there are any potential winners
    const lines = getLines();
    lines.forEach((line, index) => {
        const [ a, b, c ] = line;
        if (!squares[a] || !squares[b] || !squares[c]) {
            if (
                (!squares[a] && (squares[b] && squares[c]) && (squares[b] === squares[c]) && squares[b] === nextUp) ||
                (!squares[b] && (squares[a] && squares[c]) && (squares[a] === squares[c]) && squares[a] === nextUp) ||
                (!squares[c] && (squares[a] && squares[b]) && (squares[a] === squares[b]) && squares[a] === nextUp)
            ) {
                potentialWinners.push({line: lines[index], owner: squares[a] || squares[b] || squares[c]});
            }
        }
    });

    return potentialWinners.length === 0;
}

export function gameIsCantLosable(squares, xIsNext) {
    const nextUp = xIsNext ? 'X' : 'O';

    let totalPlays = 0,
        cantLose = false,
        potentialWins = {
            'X': 0,
            'Y': 0
        };

    // at least 4 plays
    squares.forEach(squareVal => {
        if (squareVal !== null) totalPlays++;
    });

    if (totalPlays < 4) {
        return false;
    }

    const lines = getLines();
    for (let i = 0, len = lines.length; i < len; ++i) {
        const [ a, b, c ] = lines[i];

        if (
            (!squares[a] || !squares[b] || !squares[c]) && ( // at least one free space
                    squares[a] === squares[b] || 
                    squares[b] === squares[c] || 
                    squares[a] === squares[c]
                )
        ) {
            const team = squares[a] || squares[b] || squares[c];
            if (team === nextUp) {
                cantLose = true;
                break;
            }else {
                potentialWins[team]++;
            }
        }
    }

    return (
        cantLose === true || 
        potentialWins.Y > 1 || 
        potentialWins.X > 1
    );
}