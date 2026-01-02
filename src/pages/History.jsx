import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function History() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGameId, setOpenGameId] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/games");
        setGames(res.data);
      } catch (err) {
        console.error("Failed to fetch games", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const toggleGame = (id) => {
    setOpenGameId(openGameId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <p className="text-white text-xl animate-pulse">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🎮 Game History
          </h1>
          <Link
            to="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            New Game
          </Link>
        </div>

        {games.length === 0 && (
          <p className="text-center text-gray-500">
            No games played yet.
          </p>
        )}

        {/* Games List */}
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game._id}
              className="border rounded-xl bg-gray-50 shadow-sm"
            >
              {/* Summary Row */}
              <div
                onClick={() => toggleGame(game._id)}
                className="cursor-pointer flex justify-between items-center p-5 hover:bg-gray-100 transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {game.player1} <span className="text-gray-500">vs</span>{" "}
                    {game.player2}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(game.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      game.winner === "Tie"
                        ? "bg-gray-300 text-gray-700"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    Winner: {game.winner}
                  </span>

                  {/* Arrow */}
                  <span
                    className={`text-xl transition-transform ${
                      openGameId === game._id ? "rotate-180" : ""
                    }`}
                  >
                    ⬇️
                  </span>
                </div>
              </div>

              {/* Expanded Rounds */}
              {openGameId === game._id && (
                <div className="border-t bg-white p-5 space-y-3 animate-slideDown">
                  {game.rounds.map((r, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-lg border"
                    >
                      <span className="font-medium">
                        Round {i + 1}
                      </span>
                      <span className="text-gray-600">
                        {r.playerMove} vs {r.systemMove}
                      </span>
                      <span
                        className={`font-semibold ${
                          r.winner === "Tie"
                            ? "text-gray-500"
                            : "text-indigo-600"
                        }`}
                      >
                        {r.winner}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
