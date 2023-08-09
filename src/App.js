import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import Button from "./components/Button";
import Square from "./components/Square";
import gameMusic from "./components/tic.mp3";

function App() {
    const [squares, setSquares] = useState(Array(9).fill(""));
    const [turn, setTurn] = useState("x");
    const [winner, setWinner] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerXWins, setPlayerXWins] = useState(0);
    const [playerOWins, setPlayerOWins] = useState(0);
    const [draws, setDraws] = useState(0);

    const checkEndTheGame = useCallback(() => {
        for (let square of squares) {
            if (!square) return false;
        }
        return true;
    }, [squares]);

    useEffect(() => {
        if (winner || checkEndTheGame()) {
            if (isPlaying) {
                setIsPlaying(false); // Pause music when there's a winner or draw
            }
        } else if (!isPlaying) {
            setIsPlaying(true); // Play music if game ongoing and not already playing
        }
    }, [winner, isPlaying, checkEndTheGame]);

    const checkWinner = () => {
        const combos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let combo of combos) {
            const [a, b, c] = combo;
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }
        return null;
    };

const updateSquares = (ind) => {
    if (squares[ind] || winner) {
        return;
    }
    const s = squares;
    s[ind] = turn;
    setSquares(s);
    setTurn(turn === "x" ? "o" : "x");
    const W = checkWinner();
    if (W) {
        setWinner(W);
        if (W === "x") {
            setPlayerXWins(playerXWins + 1);
        } else if (W === "o") {
            setPlayerOWins(playerOWins + 1);
        }
        if (audioRef.current) {
            audioRef.current.pause();
        }
    } else if (checkEndTheGame()) {
        setWinner("x | o");
        setDraws(draws + 1);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }
};

    const resetGame = () => {
        setSquares(Array(9).fill(""));
        setTurn("x");
        setWinner(null);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    
    const audioRef = useRef(null);    

    return (
        <div className="tic-tac-toe">
            <h1> IAN-TAC-TOE </h1>
            <audio ref={audioRef} src={gameMusic} loop autoPlay={isPlaying} />
            <Button resetGame={resetGame} />
            <div className="game">
                {Array.from("012345678").map((ind) => (
                    <Square
                        key={ind}
                        ind={ind}
                        updateSquares={updateSquares}
                        clsName={squares[ind]}
                    />
                ))}
            </div>
            <div className={`turn ${turn === "x" ? "left" : "right"}`}>
                <Square clsName="x" />
                <Square clsName="o" />
            </div>
            <div className="scoreboard">
                <div className="score">
                    <p>X Wins:</p>
                    <p>{playerXWins}</p>
                </div>
                <div className="score">
                    <p>Draws:</p>
                    <p>{draws}</p>
                </div>
                <div className="score">
                    <p>O Wins:</p>
                    <p>{playerOWins}</p>
                </div>
            </div>
            <AnimatePresence>
                {winner && (
                    <motion.div
                        key={"parent-box"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="winner"
                    >
                        <motion.div
                            key={"child-box"}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="text"
                        >
                            <motion.h2
                                initial={{ scale: 0, y: 100 }}
                                animate={{
                                    scale: 1,
                                    y: 0,
                                    transition: {
                                        y: { delay: 0.7 },
                                        duration: 0.7,
                                    },
                                }}
                            >
                                {winner === "x | o" ? "Draw :/" : "Winner :)"}
                                {winner === "x | o" && audioRef.current && audioRef.current.pause()}
                            </motion.h2>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: 1,
                                    transition: { delay: 1.3, duration: 0.2 },
                                }}
                                className="win"
                            >
                                {winner === "x | o" ? (
                                    <>
                                        <Square clsName="x" />
                                        <Square clsName="o" />
                                    </>
                                ) : (
                                    <>
                                        <Square clsName={winner} />
                                    </>
                                )}
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: 1,
                                    transition: { delay: 1.5, duration: 0.3 },
                                }}
                            >
                                <Button resetGame={resetGame} />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
