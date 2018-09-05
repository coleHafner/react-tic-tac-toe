var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import Square from './Square';
import ResetButton from './ResetButton';
import { gameIsCantLosable, gameIsUnwinnable, calculateWinner } from '../utils';
;
function getDefaultBoardState() {
    return {
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: '',
        winningLine: [],
        isDraw: false,
        isUnwinnable: false,
        isCantLosable: false,
    };
}
var Board = /** @class */ (function (_super) {
    __extends(Board, _super);
    function Board(props) {
        var _this = _super.call(this, props) || this;
        _this.state = getDefaultBoardState();
        return _this;
    }
    Board.prototype.renderSquare = function (i) {
        var _this = this;
        var style = {
            backgroundColor: 'white',
            color: 'black'
        };
        if (this.state.winner &&
            this.state.winningLine.includes(i) &&
            this.state.winner === this.state.squares[i]) {
            style = {
                backgroundColor: 'green',
                color: 'white'
            };
        }
        return (React.createElement(Square, { value: this.state.squares[i], onClick: function () { return _this.handleClick(i); }, style: style }));
    };
    Board.prototype.handleClick = function (squareIndex) {
        if (this.state.isUnwinnable) {
            alert('Why even try?');
            return;
        }
        if (this.state.squares[squareIndex] !== null) {
            alert('Whoops. Can\'t go there!');
            return;
        }
        var squaresCopy = this.state.squares.slice();
        squaresCopy[squareIndex] = this.state.xIsNext ? 'X' : 'O';
        var xIsNext = !this.state.xIsNext;
        var winner = calculateWinner(squaresCopy); // @TODO export the WinnerResult interface?
        var chosenLine = winner ? winner.line : [];
        var chosenWinner = winner ? winner.winner : '';
        var isDraw = (!winner && squaresCopy.every(function (squareVal) { return squareVal !== null; }));
        var isUnwinnable = (!winner && !isDraw && gameIsUnwinnable(squaresCopy, xIsNext));
        var isCantLosable = (!winner && !isDraw && !isUnwinnable && gameIsCantLosable(squaresCopy, xIsNext));
        this.setState({
            squares: squaresCopy,
            winner: chosenWinner,
            winningLine: chosenLine,
            isCantLosable: isCantLosable,
            isUnwinnable: isUnwinnable,
            xIsNext: xIsNext,
            isDraw: isDraw,
        });
    };
    Board.prototype.resetGame = function () {
        this.setState(getDefaultBoardState());
    };
    Board.prototype.render = function () {
        var _this = this;
        var status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'), resetButton = '';
        if (this.state.winner !== null ||
            this.state.isDraw ||
            this.state.isUnwinnable ||
            this.state.isCantLosable) {
            if (this.state.isUnwinnable) {
                status = 'Well, it looks like no one is going to win this one. Better luck next time.';
            }
            else if (this.state.isDraw) {
                status = 'Game over. No one wins :-(';
            }
            else if (this.state.isCantLosable) {
                status = 'Somebody \'bout to win!';
            }
            else {
                status = 'Winner: ' + this.state.winner;
            }
            if (this.state.isCantLosable === false) {
                resetButton = React.createElement(ResetButton, { onClick: function () { return _this.resetGame(); } });
            }
        }
        return (React.createElement("div", null,
            React.createElement("div", { className: "status" }, status),
            resetButton,
            React.createElement("div", { className: "board-row" },
                this.renderSquare(0),
                this.renderSquare(1),
                this.renderSquare(2)),
            React.createElement("div", { className: "board-row" },
                this.renderSquare(3),
                this.renderSquare(4),
                this.renderSquare(5)),
            React.createElement("div", { className: "board-row" },
                this.renderSquare(6),
                this.renderSquare(7),
                this.renderSquare(8))));
    };
    return Board;
}(React.Component));
export default Board;
//# sourceMappingURL=Board.js.map