import Modal from "./Modal"
import "./ModalStyling.css"

function HowToPlay({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1>How to play?</h1>
      <p>Guess the 5-letter word in 6 tries.</p>
      <p>The tile color will change to show how close your guess was to the word. The tile color will:</p>
      <ul>
        <li>Turn <span className="bold bold-green">green</span> if the letter is in the word and in the correct spot.</li>
        <li>Turn <span className="bold bold-yellow">yellow</span> if the letter is in the word, but in the wrong spot.</li>
        <li>Turn <span className="bold bold-gray">dark gray</span> if the letter is not in the word at all.</li>
      </ul>
      <p>Good luck!</p>
    </Modal>
  )
}

export default HowToPlay;