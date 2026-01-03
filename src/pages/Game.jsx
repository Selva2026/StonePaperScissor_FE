import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const moves = ["Stone", "Paper", "Scissors"];

export default function Game() {
  const navigate = useNavigate();

  const [player, setPlayer] = useState("");
  const [round, setRound] = useState(1);
  const [rounds, setRounds] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const getRandomMove = () =>
    moves[Math.floor(Math.random() * moves.length)];

  const decideWinner = (p, cpu) => {
    if (p === cpu) return "Tie";
    if (
      (p === "Stone" && cpu === "Scissors") ||
      (p === "Scissors" && cpu === "Paper") ||
      (p === "Paper" && cpu === "Stone")
    )
      return player;
    return "System";
  };

  const playRound = (playerMove) => {
    if (round > 6) return;

    const systemMove = getRandomMove();
    const winner = decideWinner(playerMove, systemMove);

    setRounds((prev) => [
      ...prev,
      { round, playerMove, systemMove, winner },
    ]);

    if (round === 6) setGameOver(true);
    setRound(round + 1);
  };

  const finalScore = rounds.reduce(
    (a, r) => {
      if (r.winner === player) a.player++;
      if (r.winner === "System") a.system++;
      return a;
    },
    { player: 0, system: 0 }
  );

  const finalWinner =
    finalScore.player === finalScore.system
      ? "Tie"
      : finalScore.player > finalScore.system
      ? player
      : "System";

  const saveGame = async () => {
    await axios.post("http://localhost:5001/api/games", {
      player1: player,
      player2: "System",
      rounds,
      winner: finalWinner,
    });
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-black text-white px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6">
          🪨 Stone Paper Scissors
        </h1>

        {/* Player Name */}
        {round === 1 && (
          <div className="flex justify-center mb-6">
            <input
              className="w-full max-w-xs sm:max-w-sm md:max-w-md p-3 text-center border-2 border-pink-500 rounded bg-slate-800"
              placeholder="Enter Player Name"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
            />
          </div>
        )}

        {/* Round Indicator */}
        <p className="text-center text-lg sm:text-xl font-semibold mb-4">
          Round {round <= 6 ? round : 6} / 6
        </p>

        {/* Player Controls */}
        {!gameOver && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8">
            {moves.map((m) => (
              <button
                key={m}
                onClick={() => playRound(m)}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 rounded-xl text-base sm:text-lg font-bold hover:bg-indigo-700 transition"
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Rounds Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:text-center sm:text-center lg:grid-cols-3 gap-4">
          {rounds.map((r) => (
            <div
              key={r.round}
              className="bg-white text-gray-800 text-center rounded-xl p-4 shadow-xl"
            >
              <h3 className="font-bold mb-2">Round {r.round}</h3>
              <p className="text-sm sm:text-base">{player}: {r.playerMove}</p>
              <p className="text-sm sm:text-base">System: {r.systemMove}</p>
              <p className="mt-2 font-semibold text-indigo-600">
                Winner: {r.winner}
              </p>
            </div>
          ))}
        </div>

        {/* Game Over Section */}
        {gameOver && (
          <div className="text-center mt-10 space-y-4">

            <div className="text-xl sm:text-2xl font-extrabold text-yellow-400 animate-pulse">
              {finalWinner === "Tie"
                ? "🤝 Match Tied!"
                : `🏆 Winner is ${finalWinner}`}
            </div>

            <button
              onClick={saveGame}
              className="w-full sm:w-auto px-8 py-3 bg-green-500 rounded-xl text-black text-base sm:text-lg font-bold hover:bg-green-600 transition"
            >
              Save & View History
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
