# Memory Card Game

An interactive, responsive React memory game built to test short-term recall. Players must click unique character cards without selecting the same card twice, while the board shuffles after every pick.

## Features

- **Dynamic Character Cards:** Fetches character images dynamically from the Rick & Morty API, featuring a seamless fallback image mechanism.
- **Randomized Board Shuffling:** Automatically shuffles the card grid after every click to continuously increase difficulty.
- **Score & High Score Persistence:** Tracks current streak scores in real time and persists all-time high scores across browser refreshes via `localStorage`.
- **Game Over & Victory Modals:** Custom popups notify players when a duplicate card is selected or when a perfect score is achieved.
- **Responsive UI:** Built with clean CSS and flexbox/grid layouts designed for modern desktop and mobile screens.

## Tech Stack

- **Frontend:** React (`useState`, `useEffect`)
- **API:** Rick and Morty API / Picsum Photos
- **Storage:** Browser `localStorage`
- **Styling:** CSS3
