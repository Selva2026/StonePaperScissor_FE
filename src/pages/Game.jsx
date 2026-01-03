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
      {
        round,
        playerMove,
        systemMove,
        winner,
      },
    ]);

    if (round === 6) {
      setGameOver(true);
    }

    setRound(round + 1);
  };

  // 🔥 Final score calculation (for UI + save)
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
    await axios.post("https://stonepaperscissor-e7yq.onrender.com/api/games", {
      player1: player,
      player2: "System",
      rounds,
      winner: finalWinner,
    });

    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-center mb-8">
          🪨 Stone Paper Scissors
        </h1>

        {/* Player Name */}
        {round === 1 && (
          <div className="flex justify-center">
            <input
              className="w-80 p-3 mb-8 text-center border-2 border-pink-500 rounded bg-slate-800"
              placeholder="Enter Player Name"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
            />
          </div>
        )}

        {/* Round Indicator */}
        <p className="text-center text-xl font-semibold mb-6">
          Round {round <= 6 ? round : 6} / 6
        </p>

        {/* Player Controls */}
        {!gameOver && (
          <div className="flex justify-center gap-6 mb-10">
            {moves.map((m) => (
              <button
                key={m}
                onClick={() => playRound(m)}
                className="px-6 py-3 bg-indigo-600 rounded-xl text-lg font-bold hover:bg-indigo-700 transition"
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Rounds Result Cards */}
        <div className="flex gap-6 pb-4">
          {rounds.map((r) => (
            <div
              key={r.round}
              className="min-w-[160px] bg-white text-gray-800 rounded-xl p-4 shadow-xl animate-slideUp "
            >
              <h3 className="font-bold mb-2">Round {r.round}</h3>
              <p>{player}: {r.playerMove}</p>
              <p>System: {r.systemMove}</p>
              <p className="mt-2 font-semibold text-indigo-600">
                Winner: {r.winner}
              </p>
            </div>
          ))}
        </div>

        {/* Game Over Section */}
        {gameOver && (
          <div className="text-center mt-10 space-y-4">

            {/* Final Winner */}
            <div className="text-2xl font-extrabold text-yellow-400 animate-pulse">
              {finalWinner === "Tie"
                ? "🤝 Match Tied!"
                : `🏆 Winner is ${finalWinner}`}
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={saveGame}
              className="px-8 py-3 bg-green-500 rounded-xl text-black text-lg font-bold hover:bg-green-600 transition"
            >
              Save & View History
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

