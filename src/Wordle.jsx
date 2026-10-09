import { useEffect, useRef, useState } from "react";
import "./Wordle.css";

const BLANK_GUESS = Array(5).fill({ letter: " ", color: "" });

const WORD = "RAPID";

function Wordle() {
  const [guesses, setGuesses] = useState(Array(6).fill(BLANK_GUESS));
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
  const [row, setRow] = useState(0);

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
        if (guessIdx === row) {
          return guess
            .map((letterObj, letterIdx) => {
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
                  return {...letterObj, letter: l};
                } else if (type === "remove") {
                  currentLetter.current--;
                  return {...letterObj, letter: " "};
                }
              } else {
                return {...letterObj};
              }
            });
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

  function changeLetterColor(letter, color, index) {
    setGuesses(guesses => {
      return guesses.map((guess, guessIdx) => {
        if (guessIdx === row) {
          return guess.map((guessLetter, letterIdx) => {
            if (letterIdx === index) {
              return {...guessLetter, color: color};
            } else {
              return {...guessLetter};
            }
          });
        } else {
          return guess;
        }
      });
    });

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
    let guessCopy = guesses[row].map(letterObj => letterObj.letter).join("");
    let remainingLetters = guessCopy;
    for (let i = 0; i < guessCopy.length; i++) {
      const indexResult = wordCopy.indexOf(guessCopy[i]);
      if (i === indexResult) {
        result[i] = "green";
        wordCopy = wordCopy.replace(wordCopy[indexResult], " ");

        const multipleIndexArr = [...remainingLetters.matchAll(new RegExp(remainingLetters[i], "g"))].map(match => match.index);

        // loop through multiple index array to mark duplicates of letter as gray
        for (let j = 0; j < multipleIndexArr.length; j++) {
          if (i === multipleIndexArr[j]) {
            remainingLetters = remainingLetters.replace(
              remainingLetters[multipleIndexArr[j]],
              " ",
            );
            changeLetterColor(guessCopy[multipleIndexArr[j]], "green", multipleIndexArr[j]);
          } else {
            remainingLetters = remainingLetters.replace(
              remainingLetters[multipleIndexArr[j]],
              " ",
            );
            changeLetterColor(guessCopy[multipleIndexArr[j]], "gray", multipleIndexArr[j]);
          }
        }
      }
    }

    for (let i = 0; i < guessCopy.length; i++) {
      const indexResult = wordCopy.indexOf(guessCopy[i]);
      if (indexResult > -1) {
        result[i] = "yellow";
        remainingLetters = remainingLetters.replace(remainingLetters[i], " ");
        changeLetterColor(guessCopy[i], "yellow", i);
      }
    }

    for (let i = 0; i < remainingLetters.length; i++) {
      if (remainingLetters[i] !== " ") {
        changeLetterColor(remainingLetters[i], "gray", i);
      }
    }

    if (remainingLetters === "     ") {
      return true;
    } else {
      return false;
    }
  }

  function submitGuess() {
    if (currentLetter.current === 5) {
      currentLetter.current = 0;
      if (row < 5) {
        // check guess, if not increase row
        const result = checkGuess();
        setRow(row => row + 1);
        if (result) {
          alert("You win!");
        }
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
            {[...guess].map((letterObj, letterIdx) => {
              // only color guessIdx < row
              return (
                <div
                  className={`box ${letterObj.letter === " " ? "box-empty" : ""} ${(guessIdx < row && letterObj.color !== "") ? "letter-" + letterObj.color : ""}`}
                  key={"box-" + guessIdx + "-" + letterIdx}
                >
                  {letterObj.letter.toUpperCase()}
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
