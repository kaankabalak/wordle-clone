import Modal from "./Modal"
import "./ModalStyling.css"

function GameOver({ isOpen, onClose, isWon, word, tries, resetGame}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isWon={isWon}>
      {isWon ? (
        <>
          <h1>You win!</h1>
          <p>Congratulations! You have successfully guessed the word in {tries} {tries === 1 ? "try" : "tries"}!</p>
          <div className="row row-game-over">{[...word].map(letter => (
            <div className="box letter-green box-game-over" key={`result-success-letter-${letter}`}>{letter}</div>
          ))}</div>
          <p>Click the button below to guess a new word.</p>
          <div className="new-game-container">
            <button type="button" className="new-game-btn" onClick={resetGame}>New game</button>
          </div>
        </>
      ) : (
        <>
          <h1>You lose!</h1>
          <p>You weren't able to guess the word. The word was:</p>
          <div className="row row-game-over">{[...word].map(letter => (
            <div className="box box-game-over" key={`result-failure-letter-${letter}`}>{letter}</div>
          ))}</div>
          <p>Better luck next time! Click the button below to try again with a new word.</p>
          <div className="new-game-container">
            <button type="button" className="new-game-btn" onClick={resetGame}>New game</button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default GameOver