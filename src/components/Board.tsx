import * as React from 'react';
import Square from './Square';
import ResetButton from './ResetButton';
import { gameIsCantLosable, gameIsUnwinnable, calculateWinner } from '../utils';

interface BoardProps {

}

interface BoardState {
	squares: string[];
	xIsNext: boolean;
	winner: string;
	winningLine: number[];
	isDraw: boolean;
	isUnwinnable: boolean;
	isCantLosable: boolean;
}

function getDefaultBoardState(): BoardState {
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

export default class Board extends React.Component<BoardProps, BoardState> {
	constructor(props: BoardProps) {
		super(props);
		this.state = getDefaultBoardState();
	}

	renderSquare(i: number) {
		let style = {
			backgroundColor: 'white',
			color: 'black',
		};

		if (
			this.state.winner &&
			this.state.winningLine.includes(i) &&
			this.state.winner === this.state.squares[i]
		) {
			style = {
				backgroundColor: 'green',
				color: 'white',
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

	handleClick(squareIndex: number): void {
		if (this.state.isUnwinnable) {
			alert('Why even try?');
			return;
		}

		if (this.state.squares[squareIndex] !== null) {
			alert('Whoops. Can\'t go there!');
			return;
		}

		const squaresCopy: string[] = this.state.squares.slice();
		squaresCopy[squareIndex] = this.state.xIsNext ? 'X' : 'O';
		const xIsNext: boolean = !this.state.xIsNext;

		const winner = calculateWinner(squaresCopy); // @TODO export the WinnerResult interface?
		const chosenLine: number[] = winner ? winner.line : [];
		const chosenWinner: string = winner ? winner.winner : '';
		const isDraw: boolean = (!winner && squaresCopy.every((squareVal: string) => squareVal !== null));
		const isUnwinnable: boolean = (!winner && !isDraw && gameIsUnwinnable(squaresCopy, xIsNext));
		const isCantLosable: boolean = (!winner && !isDraw && !isUnwinnable && gameIsCantLosable(squaresCopy, xIsNext));

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

	resetGame(): void {
		this.setState(getDefaultBoardState());
	}

	render() {
		let status: string = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'),
			resetButton: any = '';

		if (this.state.winner ||
			this.state.isDraw ||
			this.state.isUnwinnable ||
			this.state.isCantLosable
		) {
			if (this.state.isUnwinnable) {
				status = 'Well, it looks like no one is going to win this one. Better luck next time.';
			} else if (this.state.isDraw) {
				status = 'Game over. No one wins :-(';
			} else if (this.state.isCantLosable) {
				status = 'Somebody \'bout to win!';
			} else {
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