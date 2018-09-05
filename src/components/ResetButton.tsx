import * as React from 'react';

interface ResetButtonProps {
	onClick: any;
}

const ResetButton: React.SFC<ResetButtonProps> = (props: ResetButtonProps) => (
	<button onClick={props.onClick}>Reset Game</button>
);

export default ResetButton;