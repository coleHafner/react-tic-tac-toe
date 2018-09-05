function getLines(): number[][] {
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

interface WinnerResult {
	line: number[];
	winner: string;
}

export function calculateWinner(squares: string[]): WinnerResult | null {
	const lines = getLines();

	for (let i: number = 0, len: number = lines.length; i < len; ++i) {
		const [a, b, c]: number[] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				line: lines[i],
				winner: squares[a],
			};
		}
	}

	return null;
}

export function gameIsUnwinnable(squares: string[], xIsNext: boolean): boolean {
	// see if all squares but one are filled
	const nextUp: string = xIsNext ? 'X' : 'O';

	let filled: number = 0,
		potentialWinners: { line: number[], owner: string }[] = [];

	squares.forEach((squareVal: string | null): void => {
		if (squareVal !== null) {
			filled++;
		}
	});

	if (filled !== (squares.length - 1)) {
		return false;
	}

	// see if there are any potential winners
	const lines = getLines();
	lines.forEach((line: number[], index: number) => {
		const [a, b, c]: number[] = line;
		if (!squares[a] || !squares[b] || !squares[c]) {
			if (
				(!squares[a] && (squares[b] && squares[c]) && (squares[b] === squares[c]) && squares[b] === nextUp) ||
				(!squares[b] && (squares[a] && squares[c]) && (squares[a] === squares[c]) && squares[a] === nextUp) ||
				(!squares[c] && (squares[a] && squares[b]) && (squares[a] === squares[b]) && squares[a] === nextUp)
			) {
				potentialWinners.push({ line: lines[index], owner: squares[a] || squares[b] || squares[c] });
			}
		}
	});

	return potentialWinners.length === 0;
}

export function gameIsCantLosable(squares: string[], xIsNext: boolean): boolean {
	const nextUp: string = xIsNext ? 'X' : 'O';

	let totalPlays: number = 0,
		cantLose: boolean = false,
		potentialWins: { X: number, Y: number } = {
			'X': 0,
			'Y': 0,
		};

	// at least 4 plays
	squares.forEach((squareVal: string | null): void => {
		if (squareVal !== null) {
			totalPlays++;
		}
	});

	if (totalPlays < 4) {
		return false;
	}

	const lines: number[][] = getLines();
	for (let i: number = 0, len: number = lines.length; i < len; ++i) {
		const [a, b, c]: number[] = lines[i];

		if (
			(!squares[a] || !squares[b] || !squares[c]) && ( // at least one free space
				squares[a] === squares[b] ||
				squares[b] === squares[c] ||
				squares[a] === squares[c]
			)
		) {
			const team: string = squares[a] || squares[b] || squares[c];
			if (team === nextUp) {
				cantLose = true;
				break;
			} else {
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