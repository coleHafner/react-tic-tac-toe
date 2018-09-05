import React from 'react';
import Square from './Square';
import ResetButton from './ResetButton';
import { gameIsCantLosable, gameIsUnwinnable, calculateWinner } from '../utils';

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

export default class Board extends React.Component {
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