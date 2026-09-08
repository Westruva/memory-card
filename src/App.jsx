import { useEffect, useState } from "react";
import "./App.css";

const shuffleCards = (items) => [...items].sort(() => Math.random() - 0.5);

const buildDeck = (rawCards) =>
	shuffleCards(
		rawCards.slice(0, 12).map((photo, index) => ({
			id: `card-${photo.id ?? index}`,
			image: photo.image || photo.download_url,
			alt: photo.name || `Memory card ${index + 1}`,
		})),
	);

function App() {
	const [cards, setCards] = useState([]);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(() => {
		const saved = Number(
			window.localStorage.getItem("memory-card-high-score"),
		);
		return Number.isFinite(saved) ? saved : 0;
	});

	const [clickedCardIds, setClickedCardIds] = useState([]);
	const [loading, setLoading] = useState(true);

	// Modal State
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState({
		title: "",
		message: "",
	});

	useEffect(() => {
		window.localStorage.setItem(
			"memory-card-high-score",
			String(highScore),
		);
	}, [highScore]);

	useEffect(() => {
		const loadCards = async () => {
			try {
				const response = await fetch(
					"https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10,11,12",
				);
				const data = await response.json();
				setCards(buildDeck(data));
			} catch {
				const fallbackPhotos = Array.from(
					{ length: 12 },
					(_, index) => ({
						id: index + 1,
						download_url: `https://picsum.photos/seed/memory-${index + 1}/300/300`,
					}),
				);
				setCards(buildDeck(fallbackPhotos));
			} finally {
				setLoading(false);
			}
		};

		loadCards();
	}, []);

	const handleReset = () => {
		setCards((current) => shuffleCards(current));
		setScore(0);
		setClickedCardIds([]);
		setIsModalOpen(false);
	};

	const handleCardClick = (card) => {
		if (loading || isModalOpen) return;

		// Check Loss Condition (Clicked an already picked card)
		if (clickedCardIds.includes(card.id)) {
			setModalContent({
				title: "Game Over! 💥",
				message: `You clicked the same card twice. Final Score: ${score}`,
			});
			setIsModalOpen(true);
			return;
		}

		// Update Score
		const newScore = score + 1;
		const updatedClicked = [...clickedCardIds, card.id];
		setScore(newScore);
		setClickedCardIds(updatedClicked);

		// Update High Score
		setHighScore((prev) => Math.max(prev, newScore));

		// Check Win Condition (All cards clicked)
		if (newScore === cards.length && cards.length > 0) {
			setModalContent({
				title: "Victory! 🎉",
				message: `You remembered all ${cards.length} cards without a single mistake!`,
			});
			setIsModalOpen(true);
			return;
		}

		// Shuffle board for next round
		setCards((current) => shuffleCards(current));
	};

	return (
		<main className="game-shell">
			<header className="topbar">
				<div>
					<p className="eyebrow">Memory Board</p>
					<h1>Rick and Morty</h1>
					<p className="instructions">
						Click on each card only once. Clicking the same card
						twice will end the game. Try to remember all cards!
					</p>
				</div>
				<button
					type="button"
					className="restart-button"
					onClick={handleReset}>
					Restart
				</button>
			</header>

			<section className="status-panel" aria-live="polite">
				<div>
					<span className="label">Current Score</span>
					<strong>{score}</strong>
				</div>
				<div>
					<span className="label">High Score</span>
					<strong>{highScore}</strong>
				</div>
				<div>
					<span className="label">Total Cards</span>
					<strong>{cards.length}</strong>
				</div>
			</section>

			<section className="board" aria-label="Memory card game board">
				{loading ? (
					<p>Loading characters...</p>
				) : (
					cards.map((card) => (
						<button
							key={card.id}
							type="button"
							className="memory-card"
							onClick={() => handleCardClick(card)}
							aria-label={`Card ${card.alt}`}>
							<img src={card.image} alt={card.alt} />
						</button>
					))
				)}
			</section>

			{/* Game Over / Win Modal */}
			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-card">
						<h2>{modalContent.title}</h2>
						<p>{modalContent.message}</p>
						<button
							type="button"
							className="primary-button"
							onClick={handleReset}>
							Play Again
						</button>
					</div>
				</div>
			)}
		</main>
	);
}

export default App;
