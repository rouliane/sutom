import React from 'react';

type Props = {
    content: string | null;
    isCorrect?: boolean;
    isMisplaced?: boolean;
}

const Cell = ({content, isCorrect, isMisplaced}: Props) => {
    return <td className={content === null ? "no-content" : isMisplaced ? "misplaced" : isCorrect ? "correct" : ""}>
        {content === null ? "." : content}
    </td>;
}

export default Cell;
