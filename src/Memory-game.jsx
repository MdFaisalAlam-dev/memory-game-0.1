import React, { useEffect, useState } from 'react';

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [timerActive, setTimerActive] = useState(false);

    const handelGridSize = (e) => {
        const size = parseInt(e.target.value);
        if (size >= 2 && size <= 10) setGridSize(size);
    };
    const getTimeForGrid = (size) => {
        const blocks = size * size;
        switch (blocks) {
            case 4: return 10;
            case 9: return 20;
            case 16: return 50;
            case 25: return 90;
            case 36: return 170;
            case 49: return 230;
            case 64: return 290;
            case 81: return 370;
            case 100: return 450;
            default: return 60;
        }
    };


    const intializeGame = () => {
        const totalCards = gridSize * gridSize;
        const pairCount = Math.floor(totalCards / 2);
        const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
        const shuffledCards = [...numbers, ...numbers]
            .sort(() => Math.random() - 0.5)
            .slice(0, totalCards)
            .map((number, index) => ({ id: index, number }));

        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        setWon(false);
        const newTime = getTimeForGrid(gridSize);
        setTimeLeft(newTime);
        setTimerActive(true);
        setDisabled(false);
    };

    useEffect(() => {
        intializeGame();
    }, [gridSize]);

    useEffect(() => {
        if (!timerActive || won) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimerActive(false);
                    setDisabled(true); // Stop interactions
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timerActive, won]);

    const checkLogic = (sId) => {
        const [fId] = flipped;

        if (cards[fId].number === cards[sId].number) {
            setSolved([...solved, fId, sId]);
            setFlipped([]);
            setDisabled(false);
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 1000);
        }
    };

    const handleClick = (id) => {
        if (disabled || won || flipped.includes(id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            if (id !== flipped[0]) {
                setFlipped([...flipped, id]);
                checkLogic(id);
            } else {
                setFlipped([]);
                setDisabled(false);
            }
        }
    };

    const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
    const isSolved = (id) => solved.includes(id);

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);
            setTimerActive(false); // Stop timer
        }
    }, [solved, cards]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 z-10 relative'>
            <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

            <div className='mb-2 text-lg font-medium text-red-600'>
                Time Left: {timeLeft} sec
            </div>

            <div className='mb-4'>
                <label htmlFor="gridSize" className='mr-2 text-lg'>
                    Grid Size: (max 10)
                </label>
                <input
                    type="number"
                    id='gridSize'
                    min="2"
                    max="10"
                    value={gridSize}
                    onChange={handelGridSize}
                    className='border-2 border-blue-300 rounded px-2 py-1'
                />
            </div>
            <div className="text-sm text-gray-500 mb-2">
                Timer for {gridSize}x{gridSize}: {getTimeForGrid(gridSize)} sec
            </div>


            <div
                className={`grid gap-2 mb-4`}
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
                    width: `min(100%, ${gridSize * 5.5}rem)`,
                }}
            >
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleClick(card.id)}
                        className={`aspect-square cursor-pointer perspective-[1000px]`}
                    >
                        <div className={`card-inner ${isFlipped(card.id) ? 'flipped' : ''} ${isSolved(card.id) ? 'solved' : ''}`}>
                            <div className="card-front">?</div>
                            <div className="card-back">{card.number}</div>
                        </div>
                    </div>
                ))}
            </div>

            {won && (
                <div className='mt-4 text-4xl font-bold text-blue-700 animate-bounce'>
                    You Won!
                </div>
            )}

            {timeLeft === 0 && !won && (
                <div className='mt-4 text-3xl font-bold text-red-600 animate-pulse'>
                    Time’s up! Try Again.
                </div>
            )}

            <button
                onClick={intializeGame}
                className='mt-4 px-4 py-2 bg-green-600 text-white text-xl rounded hover:bg-red-500 transition-colors'
            >
                {won || timeLeft === 0 ? "Play Again" : "Reset"}
            </button>
        </div>
    );
};

export default MemoryGame;
