import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = getDefaultBoardState();
    }

    renderSquare(i) {
        let style = {
            backgroundColor: 'white',
            color: 'black'
        };

        if (
            this.state.winner && 
            this.state.winningLine.includes(i) && 
            this.state.winner === this.state.squares[i] 
        ) {
            style = {
                backgroundColor: 'green',
                color: 'white'
            };
        }

        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
                style={style}
            />
        );
    }

    handleClick(squareIndex) {
        if (this.state.isUnwinnable) {
            alert('Why even try?');
            return;
        }

        if (this.state.squares[squareIndex] !== null) {
            alert('Whoops. Can\'t go there!');
            return;
        }

        const squaresCopy = this.state.squares.slice();
        squaresCopy[squareIndex] = this.state.xIsNext ? 'X' : 'O';
        const xIsNext = !this.state.xIsNext;

        const winner = calculateWinner(squaresCopy);
        const chosenLine = winner ? winner.line : null;
        const chosenWinner = winner ? winner.winner : null;
        const isDraw = (!winner && squaresCopy.every(squareVal => squareVal !== null ));
        const isUnwinnable = (!winner && !isDraw && gameIsUnwinnable(squaresCopy, xIsNext));
        const isCantLosable = (!winner && !isDraw && !isUnwinnable && gameIsCantLosable(squaresCopy, xIsNext));

        this.setState({ 
            squares: squaresCopy, 
            winner: chosenWinner, 
            winningLine: chosenLine,
            isCantLosable,
            isUnwinnable,
            xIsNext,
            isDraw,
        });
    }

    resetGame() {
        this.setState(getDefaultBoardState());
    }

    render() {
        let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'),
            resetButton = '';
        
        if (this.state.winner !== null || 
            this.state.isDraw || 
            this.state.isUnwinnable ||
            this.state.isCantLosable
        ) {
            if (this.state.isUnwinnable) {
                status = 'Well, it looks like no one is going to win this one. Better luck next time.';
            }else if (this.state.isDraw) {
                status = 'Game over. No one wins :-(';
            }else if (this.state.isCantLosable) {
                status = 'Somebody \'bout to win!';
            }else {
                status = 'Winner: ' + this.state.winner;
            }
            
            if (this.state.isCantLosable === false) {
                resetButton = <ResetButton onClick={() => this.resetGame()} />;
            }
        }

        return (
            <div>
                <div className="status">{status}</div>
                {resetButton}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

function Square(props) {
    return (
        <button 
            style={props.style}
            className="square" 
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function ResetButton(props) {
    return <button onClick={props.onClick}>Reset Game</button>
}

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

function calculateWinner(squares) {
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

function gameIsUnwinnable(squares, xIsNext) {
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

function gameIsCantLosable(squares, xIsNext) {
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

function getDefaultBoardState() {
    return {
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: null,
        winningLine: null,
        isDraw: false,
        isUnwinnable: false,
        isCantLosable: false,
    };
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);