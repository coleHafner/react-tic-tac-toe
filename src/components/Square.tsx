import * as React from 'react';

interface SquareProps {
	style: Object;
	onClick: any;
	value: String;
}

const Square: React.SFC<SquareProps> = (props: SquareProps) => (
	<button
		style={props.style}
		className="square"
		onClick={props.onClick}>
		{props.value}
	</button>
);

export default Square;