import { useEffect, useRef, useState } from "react";
import "./Wordle.css";

const BLANK_TEXT = "     ";

const WORD = "RAPID";

function Wordle() {
  const [guesses, setGuesses] = useState(Array(6).fill(BLANK_TEXT));
  const [letters, setLetters] = useState({
    first: {
      Q: "",
      W: "",
      E: "",
      R: "",
      T: "",
      Y: "",
      U: "",
      I: "",
      O: "",
      P: "",
    },
    second: {
      A: "",
      S: "",
      D: "",
      F: "",
      G: "",
      H: "",
      J: "",
      K: "",
      L: "",
    },
    third: {
      Z: "",
      X: "",
      C: "",
      V: "",
      B: "",
      N: "",
      M: "",
    },
  });

  const currentRow = useRef(0);
  const currentLetter = useRef(0);

  useEffect(() => {
    const handleKeyup = (e) => {
      if (e.keyCode === 8) {
        deleteLetter();
      } else if (e.keyCode === 13) {
        submitGuess();
      } else if (e.keyCode >= 65 && e.keyCode <= 90) {
        addLetter(e.key.toUpperCase());
      }
    };
    if (handleKeyup) {
      window.addEventListener("keyup", handleKeyup);
    }

    return () => {
      if (handleKeyup) {
        window.removeEventListener("keyup", handleKeyup);
      }
    };
  }, [guesses]);

  function changeLetter(type, l) {
    setGuesses((guesses) => {
      let letterEntered = false;
      return guesses.map((guess, guessIdx) => {
        if (guessIdx === currentRow.current) {
          return [...guess]
            .map((letter, letterIdx) => {
              if (
                !letterEntered &&
                letterIdx ===
                  (type === "add"
                    ? currentLetter.current
                    : currentLetter.current - 1)
              ) {
                letterEntered = true;
                if (type === "add") {
                  currentLetter.current++;
                  return l;
                } else if (type === "remove") {
                  currentLetter.current--;
                  return " ";
                }
              } else {
                return letter;
              }
            })
            .join("");
        } else {
          return guess;
        }
      });
    });
  }

  function addLetter(l) {
    changeLetter("add", l);
  }

  function deleteLetter() {
    changeLetter("remove");
  }

  function changeLetterColor(letter, color) {
    setLetters((letters) => {
      if (letters.first[letter] !== undefined) {
        return {
          ...letters,
          first: { ...letters.first, [letter]: color },
        };
      } else if (letters.second[letter] !== undefined) {
        return {
          ...letters,
          second: { ...letters.second, [letter]: color },
        };
      } else if (letters.third[letter] !== undefined) {
        return {
          ...letters,
          third: { ...letters.third, [letter]: color },
        };
      }
    });
  }

  function checkGuess() {
    let result = Array(5).fill("gray");
    let wordCopy = WORD;
    let guessCopy = guesses[currentRow.current];
    let remainingLetters = guesses[currentRow.current];
    for (let i = 0; i < guessCopy.length; i++) {
      const indexResult = wordCopy.indexOf(guessCopy[i]);
      if (i === indexResult) {
        result[i] = "green";
        wordCopy = wordCopy.replace(wordCopy[indexResult], " ");
        remainingLetters = remainingLetters.replaceAll(
          remainingLetters[i],
          " ",
        );
        changeLetterColor(guessCopy[i], "green");
      }
    }

    for (let i = 0; i < guessCopy.length; i++) {
      const indexResult = wordCopy.indexOf(guessCopy[i]);
      if (indexResult > -1) {
        result[i] = "yellow";
        remainingLetters = remainingLetters.replace(remainingLetters[i], " ");
        changeLetterColor(guessCopy[i], "yellow");
      }
    }

    for (let i = 0; i < remainingLetters.length; i++) {
      if (remainingLetters[i] !== " ") {
        changeLetterColor(remainingLetters[i], "gray");
      }
    }
  }

  function submitGuess() {
    if (currentLetter.current === 5) {
      currentLetter.current = 0;
      if (currentRow.current < 5) {
        // check guess, if not increase row
        checkGuess();
        currentRow.current++;
      } else {
        // you lose
      }
    }
  }

  function handleLetterClick(e) {
    e.preventDefault();
    addLetter(e.currentTarget.value);
  }

  function handleDeleteClick(e) {
    deleteLetter();
  }

  function handleEnterClick(e) {
    e.preventDefault();
    submitGuess();
  }

  return (
    <>
      {guesses.map((guess, guessIdx) => {
        return (
          <div className="row" key={"row-" + guessIdx}>
            {[...guess].map((letter, letterIdx) => {
              const letterColor =
                letters.first[letter] ||
                letters.second[letter] ||
                letters.third[letter] ||
                "";
              return (
                <div
                  className={`box ${letter === " " ? "box-empty" : ""} ${guessIdx < currentRow.current ? "letter-" + letterColor : ""}`}
                  key={"box-" + guessIdx + "-" + letterIdx}
                >
                  {letter.toUpperCase()}
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="keyboard">
        {Object.entries(letters).map(([key, letterObj]) => (
          <div className="keyboard-row" key={"keyboard-" + key + "-row"}>
            {key === "third" && (
              <button
                type="button"
                className="letter letter-special"
                onClick={handleEnterClick}
                value={"Enter"}
                key="keyboard-enter"
              >
                ENTER
              </button>
            )}
            {Object.entries(letterObj).map(([letter, color]) => {
              return (
                <button
                  type="button"
                  className={`letter ${color !== "" ? `letter-${color}` : ""}`}
                  onClick={handleLetterClick}
                  value={letter}
                  key={"keyboard-" + letter}
                >
                  {letter}
                </button>
              );
            })}
            {key === "third" && (
              <button
                type="button"
                className="letter letter-special"
                onClick={handleDeleteClick}
                value={"Delete"}
                key="keyboard-delete"
              >
                <img src="/src/assets/backspace.png" alt="Delete" />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Wordle;
