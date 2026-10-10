import { useEffect, useRef, useState } from "react";
import "./Wordle.css";
import HowToPlay from "./HowToPlay";
import GameOver from "./GameOver";

const BLANK_GUESS = Array(5).fill({ letter: " ", color: "" });
const LETTERS = {
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
};

const WORDS = [
  "ABACK", "ABATE", "ABBEY", "ABBOT", "ABHOR", "ABLED", "ABOVE", "ABUSE", "ABYSS", "ACTOR",
  "ADAPT", "ADEPT", "ADORE", "ADORN", "AFFIX", "AFIRE", "AFOOT", "AGENT", "AGONY", "AGREE",
  "AHEAD", "ALGAE", "ALIBI", "ALIGN", "ALIVE", "ALLOT", "ALLOW", "ALOFT", "ALONE", "ALPHA",
  "AMASS", "AMONG", "ANGER", "ANGLE", "ANGST", "ANIME", "ANNEX", "ANNOY", "ANNUL", "AORTA",
  "APING", "APNEA", "ARGUE", "ARISE", "ARMOR", "AROMA", "AROSE", "ARROW", "ARSON", "ASHEN",
  "ATOLL", "ATOMS", "ATTIC", "AUDIO", "AUGUR", "AUNTY", "AVAIL", "AVOID", "AWAIT", "AWARD",
  "AWARE", "AWFUL", "BADLY", "BAGEL", "BAGGY", "BAKER", "BALMY", "BANJO", "BASIC", "BASIN",
  "BASIS", "BASTE", "BATHE", "BATON", "BATTY", "BEACH", "BEFIT", "BEGAN", "BEGIN", "BEGUN",
  "BELLE", "BELOW", "BENCH", "BERRY", "BESET", "BIRTH", "BITTY", "BLACK", "BLADE", "BLAME",
  "BLEED", "BLIMP", "BLIND", "BLINK", "BLOAT", "BLOKE", "BLOOD", "BLUFF", "BLURB", "BLURT",
  "BOARD", "BOAST", "BOOZE", "BOSOM", "BOSSY", "BOUGH", "BOULE", "BRACE", "BRAID", "BRAKE",
  "BRAND", "BRASS", "BRAVE", "BRIAR", "BRIDE", "BRIEF", "BRINE", "BRING", "BRINK", "BROKE",
  "BROOD", "BROTH", "BRUNT", "BRUTE", "BUDDY", "BUDGE", "BULKY", "BULLY", "BUSED", "BUTCH",
  "CACHE", "CADET", "CAMEL", "CANAL", "CANOE", "CAPER", "CARGO", "CAROL", "CASTE", "CATCH",
  "CATER", "CAUSE", "CAVIL", "CEASE", "CEDAR", "CHAFE", "CHAFF", "CHAMP", "CHAOS", "CHART",
  "CHASM", "CHEAP", "CHECK", "CHESS", "CHILD", "CHINA", "CHORD", "CHORE", "CHUNK", "CHUTE",
  "CINCH", "CIVIC", "CLANG", "CLASP", "CLEAN", "CLEAT", "CLEFT", "CLIFF", "CLOAK", "CLONE",
  "CLOSE", "CLOUD", "CLOUT", "CLOWN", "CLUCK", "CLUED", "CLUMP", "COACH", "COMET", "CONCH",
  "CONDO", "CONIC", "COUCH", "COUNT", "COURT", "COVEN", "COWER", "CRACK", "CRASH", "CRASS",
  "CRATE", "CRAVE", "CRAWL", "CRAZE", "CRAZY", "CREAK", "CREAM", "CREME", "CREPT", "CRESS",
  "CREST", "CRICK", "CRIED", "CRIME", "CRISP", "CROCK", "CRONE", "CROOK", "CROSS", "CROUP",
  "CROWN", "CRUMB", "CRUMP", "CRYPT", "CURIO", "CURLY", "CURRY", "CYCLE", "CYNIC", "DAISY",
  "DATUM", "DAUNT", "DEATH", "DEBAR", "DEBUG", "DEBUT", "DECAY", "DECOR", "DECOY", "DECRY",
  "DEFER", "DEIGN", "DELAY", "DELVE", "DEMUR", "DENSE", "DEPOT", "DETER", "DETOX", "DEUCE",
  "DEVIL", "DILLY", "DINGO", "DINGY", "DISCO", "DITCH", "DITTY", "DIZZY", "DODGY", "DONOR",
  "DONUT", "DOUBT", "DOWEL", "DOZEN", "DRAMA", "DRANK", "DRAWL", "DRAWN", "DREAD", "DRIED",
  "DRIER", "DRINK", "DRIVE", "DROIT", "DRONE", "DROOL", "DROOP", "DROSS", "DROWN", "DRYER",
  "DUCHY", "DUMMY", "DUMPY", "DUNCE", "DUSKY", "DUSTY", "DUVET", "DWELT", "EASEL", "EATER",
  "EERIE", "EJECT", "ELATE", "ELBOW", "ELDER", "ELFIN", "ELITE", "ELOPE", "ELUDE", "EMAIL",
  "EMBED", "EMCEE", "ENDOW", "ENNUI", "ENSUE", "ENTER", "EPOXY", "EQUIP", "ERECT", "ERODE",
  "ERROR", "ERUPT", "ETHIC", "ETHOS", "EVENT", "EVERY", "EVOKE", "EXERT", "EXILE", "EXIST",
  "EXULT", "EYING", "FABLE", "FAITH", "FALSE", "FARCE", "FATAL", "FATTY", "FAUNA", "FELLA",
  "FELON", "FEMME", "FENCE", "FETAL", "FEVER", "FEWER", "FIBER", "FIELD", "FILER", "FILET",
  "FILMY", "FINAL", "FINER", "FIXER", "FLAIL", "FLAKY", "FLANK", "FLASK", "FLESH", "FLINT",
  "FLOAT", "FLOSS", "FLOUR", "FLUNG", "FLUSH", "FOCUS", "FOGGY", "FORTH", "FORTY", "FOUND",
  "FRIAR", "FROST", "FROZE", "FULLY", "FUNGI", "FUNNY", "FUROR", "FURRY", "GAWKY", "GAYER",
  "GAZER", "GECKO", "GIANT", "GIVER", "GLAND", "GLASS", "GLEAM", "GLIDE", "GLOAT", "GLOBE",
  "GLORY", "GLOSS", "GLYPH", "GNOME", "GOLEM", "GOLLY", "GOODY", "GOOFY", "GRAFT", "GRAIL",
  "GRAPE", "GRAPH", "GRASS", "GRATE", "GREEN", "GRIEF", "GRILL", "GRIMY", "GRIND", "GROAN",
  "GROIN", "GROSS", "GROUP", "GROVE", "GROWN", "GRUFF", "GRUNT", "GUAVA", "GUESS", "GUIDE",
  "GUISE", "GULLY", "GUMMY", "GUPPY", "GUSTO", "HABIT", "HALVE", "HANDY", "HAPPY", "HARDY",
  "HARPY", "HASTE", "HASTY", "HATCH", "HATER", "HEADY", "HEARD", "HEAVE", "HEFTY", "HEIST",
  "HELIX", "HELLO", "HIPPY", "HOARD", "HOBBY", "HOIST", "HOLLY", "HONEY", "HONOR", "HORDE",
  "HOTLY", "HOUND", "HOVER", "HUMAN", "HUMUS", "HUNCH", "HUNKY", "HURRY", "HYDRO", "ICING",
  "IDEAL", "IDIOM", "IMAGE", "IMPLY", "INANE", "INAPT", "INCUR", "INDEX", "INERT", "INGOT",
  "INTER", "INTRO", "ISLET", "ISSUE", "ITCHY", "JAUNT", "JAZZY", "JELLY", "JETTY", "JEWEL",
  "JIFFY", "JOIST", "JOKER", "JOUST", "JUICE", "JUMPY", "JUNTO", "KARMA", "KHAKI", "KNOLL",
  "LABEL", "LADEN", "LADLE", "LANCE", "LAPEL", "LARVA", "LATER", "LATHE", "LEAPT", "LEASH",
  "LEAVE", "LEFTY", "LEMON", "LEMUR", "LEVEL", "LIGHT", "LILAC", "LIMIT", "LITHE", "LIVER",
  "LIVID", "LOAMY", "LOCUS", "LODGE", "LOFTY", "LOOPY", "LOOSE", "LORRY", "LOUSY", "LOVER",
  "LOWLY", "LOYAL", "LUCID", "LUCKY", "LUNAR", "LUNCH", "LUNGE", "LYING", "LYMPH", "MACHO",
  "MAFIA", "MAGIC", "MAIZE", "MAJOR", "MAKER", "MAMMA", "MANGE", "MANGY", "MANIA", "MANIC",
  "MANLY", "MANOR", "MAPLE", "MARRY", "MASON", "MATCH", "MAYBE", "MAYOR", "MEANT", "MECCA",
  "MEDIA", "MERGE", "MERIT", "MERRY", "METAL", "MIMIC", "MINOR", "MINTY", "MINUS", "MIRTH",
  "MODAL", "MODEL", "MODEM", "MOIST", "MOLDY", "MONEY", "MOOSE", "MORAL", "MOTEL", "MOTOR",
  "MOUND", "MOURN", "MOWER", "MUCKY", "MULCH", "MUMMY", "MUNCH", "MURAL", "MURKY", "MUSHY",
  "MUSIC", "NASAL", "NEIGH", "NEVER", "NEWLY", "NICER", "NICHE", "NIECE", "NOBLE", "NOBLY",
  "NOISY", "NOMAD", "NORTH", "NURSE", "NUTTY", "NYLON", "OCEAN", "OCTET", "OFFAL", "OFFER",
  "OLDEN", "OLIVE", "OMEGA", "OPIUM", "OPTIC", "OTHER", "OTTER", "OUTDO", "OVATE", "OVINE",
  "OVOID", "OWNER", "PADDY", "PAGAN", "PAINT", "PAPER", "PARRY", "PASTY", "PATCH", "PAYEE",
  "PAYER", "PEACE", "PECAN", "PEDAL", "PENCE", "PENNE", "PERKY", "PESKY", "PETTY", "PHONY",
  "PICKY", "PIECE", "PIETY", "PILOT", "PINCH", "PINEY", "PINTO", "PIPER", "PIQUE", "PITCH",
  "PITHY", "PIVOT", "PIZZA", "PLAID", "PLAIN", "PLAIT", "PLANE", "PLANK", "PLATE", "PLEAD",
  "PLIED", "PLIER", "PLUMP", "PLUNK", "PLUSH", "POINT", "POISE", "POLAR", "POLKA", "POLYP",
  "POPPY", "POSIT", "PRANK", "PRICK", "PRIDE", "PRIED", "PRIVY", "PRIZE", "PROUD", "PROXY",
  "PRUDE", "PRUNE", "PSALM", "PUNCH", "PUREE", "PURSE", "PUSHY", "QUAIL", "QUALM", "QUART",
  "QUERY", "QUIET", "QUOTE", "RACER", "RADAR", "RADIO", "RAINY", "RAISE", "RALLY", "RANCH",
  "RANDY", "RAVEN", "RAYON", "RAZOR", "READY", "REBUT", "RECUR", "REEDY", "RELAX", "RELIC",
  "REMIT", "RENAL", "RENEW", "REPAY", "REPEL", "RESET", "RESIN", "RETCH", "RETRY", "REUSE",
  "REVEL", "REVUE", "RHINO", "RIDGE", "RIGID", "RIPEN", "RIPER", "RISEN", "RISER", "RIVAL",
  "ROACH", "ROAST", "ROBIN", "ROGER", "ROOST", "ROTOR", "ROUND", "ROUTE", "ROWDY", "ROYAL",
  "RUDER", "RUPEE", "RURAL", "SAINT", "SALTY", "SANDY", "SANER", "SASSY", "SAUCY", "SAVVY",
  "SCALD", "SCAMP", "SCANT", "SCARY", "SCENT", "SCOFF", "SCOLD", "SCOOP", "SCOPE", "SCORE",
  "SCORN", "SCOUR", "SCOUT", "SCOWL", "SCRAP", "SCREW", "SCRUB", "SEEDY", "SEIZE", "SERVE",
  "SEVER", "SEWER", "SHACK", "SHADE", "SHAKE", "SHAKY", "SHALL", "SHALT", "SHARD", "SHARE",
  "SHEEN", "SHEER", "SHEET", "SHEIK", "SHELF", "SHINE", "SHIRE", "SHOOT", "SHOVE", "SHOWN",
  "SHUSH", "SIEGE", "SIEVE", "SIGHT", "SIREN", "SIXTH", "SKIER", "SKIMP", "SKIRT", "SKUNK",
  "SLASH", "SLAVE", "SLEET", "SLIMY", "SLOOP", "SLOSH", "SLUNK", "SLURP", "SLUSH", "SMACK",
  "SMALL", "SMART", "SMASH", "SMELL", "SMELT", "SMILE", "SMOKE", "SNACK", "SNARE", "SNEER",
  "SNIDE", "SNIPE", "SNORE", "SNOUT", "SNUCK", "SOAPY", "SOBER", "SOLVE", "SONAR", "SOOTY",
  "SORRY", "SOWER", "SPADE", "SPANK", "SPASM", "SPEED", "SPELT", "SPEND", "SPENT", "SPICY",
  "SPIED", "SPIKE", "SPIKY", "SPILL", "SPILT", "SPINY", "SPITE", "SPOKE", "SPOOF", "SPOOK",
  "SPOON", "SPRAY", "SPREE", "SPURN", "SQUAD", "SQUAT", "SQUIB", "STAID", "STAIN", "STANK",
  "STARE", "STARK", "STEAM", "STEED", "STEEL", "STICK", "STILL", "STILT", "STING", "STINK",
  "STONE", "STONY", "STRAY", "STRUT", "STUCK", "STUMP", "STUNG", "STUNT", "SUAVE", "SUING",
  "SUITE", "SULKY", "SUNNY", "SURER", "SURLY", "SUSHI", "SWATH", "SWEEP", "SWEET", "SWELL",
  "SWIFT", "SWILL", "SWINE", "SWING", "SWORD", "SWORN", "SYNOD", "SYRUP", "TABBY", "TAKER",
  "TALLY", "TANGO", "TAPER", "TARDY", "TAROT", "TASTE", "TAUNT", "TAWNY", "TEACH", "TEARY",
  "TEDDY", "TENTH", "TEPEE", "THANK", "THEFT", "THIEF", "THIGH", "THIRD", "THONG", "THORN",
  "THREE", "THREW", "THROB", "THUMP", "TIARA", "TILDE", "TIMID", "TITAN", "TITLE", "TODDY",
  "TOOTH", "TORCH", "TOUCH", "TOUGH", "TOWER", "TOXIC", "TOXIN", "TRACE", "TRACK", "TRACT",
  "TRADE", "TRAIL", "TREND", "TRICK", "TRIED", "TRIPE", "TRITE", "TROOP", "TRUCE", "TRUCK",
  "TRUER", "TRUST", "TRUTH", "TRYST", "TUMOR", "TUNIC", "TURBO", "TWANG", "TWEAK", "TWEED",
  "TWICE", "TWIRL", "TWIST", "UNCUT", "UNDID", "UNFED", "UNFIT", "UNION", "UNITE", "UNWED",
  "UNZIP", "UPSET", "USAGE", "USURP", "VAGUE", "VALOR", "VAPOR", "VAULT", "VENUE", "VERVE",
  "VIDEO", "VIGOR", "VIPER", "VISIT", "VIXEN", "VOICE", "VOTER", "VOUCH", "WACKY", "WAGON",
  "WATER", "WAXEN", "WEDGE", "WEEDY", "WEIRD", "WHACK", "WHEEL", "WHELP", "WHERE", "WHINE",
  "WHINY", "WHOLE", "WHOOP", "WIDEN", "WIDTH", "WIELD", "WINCE", "WINCH", "WOMAN", "WOODY",
  "WOOER", "WOOLY", "WOOZY", "WORDY", "WORKS", "WORSE", "WORST", "WORTH", "WRACK", "WRATH",
  "WRITE", "WROTE", "WRYLY", "XENON", "XYLEM", "YIELD", "YOUNG", "YUMMY", "ZESTY", "ZONAL",
];

function Wordle() {
  const [word, setWord] = useState(WORDS[Math.floor(Math.random() * WORDS.length)])
  const [guesses, setGuesses] = useState(Array(6).fill(BLANK_GUESS));
  const [letters, setLetters] = useState(LETTERS);
  const [row, setRow] = useState(0);
  const [isHowToPlayOpen, setHowToPlayOpen] = useState(true);
  const [isGameOverOpen, setGameOverOpen] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const currentLetter = useRef(0);

  useEffect(() => {
    const handleKeyup = (e) => {
      if (!isHowToPlayOpen) {
        if (e.keyCode === 8) {
          deleteLetter();
        } else if (e.keyCode === 13) {
          submitGuess();
        } else if (e.keyCode >= 65 && e.keyCode <= 90) {
          addLetter(e.key.toUpperCase());
        }
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
  }, [guesses, isHowToPlayOpen]);

  function resetGame() {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses(Array(6).fill(BLANK_GUESS));
    setLetters(LETTERS);
    setRow(0);
    setGameOverOpen(false);
    setIsWon(false);
  }

  function changeLetter(type, l) {
    setGuesses((guesses) => {
      let letterEntered = false;
      return guesses.map((guess, guessIdx) => {
        if (guessIdx === row) {
          return guess.map((letterObj, letterIdx) => {
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
                return { ...letterObj, letter: l };
              } else if (type === "remove") {
                currentLetter.current--;
                return { ...letterObj, letter: " " };
              }
            } else {
              return { ...letterObj };
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
    setGuesses((guesses) => {
      return guesses.map((guess, guessIdx) => {
        if (guessIdx === row) {
          return guess.map((guessLetter, letterIdx) => {
            if (letterIdx === index) {
              return { ...guessLetter, color: color };
            } else {
              return { ...guessLetter };
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
    let wordCopy = word;
    let guessCopy = guesses[row].map((letterObj) => letterObj.letter).join("");
    let remainingLetters = guessCopy;
    for (let i = 0; i < guessCopy.length; i++) {
      const indexResult = wordCopy.indexOf(guessCopy[i]);
      if (i === indexResult) {
        result[i] = "green";
        wordCopy = wordCopy.replace(wordCopy[indexResult], " ");

        const multipleIndexArr = [
          ...remainingLetters.matchAll(new RegExp(remainingLetters[i], "g")),
        ].map((match) => match.index);

        // loop through multiple index array to mark duplicates of letter as gray
        for (let j = 0; j < multipleIndexArr.length; j++) {
          if (i === multipleIndexArr[j]) {
            remainingLetters = remainingLetters.replace(
              remainingLetters[multipleIndexArr[j]],
              " ",
            );
            changeLetterColor(
              guessCopy[multipleIndexArr[j]],
              "green",
              multipleIndexArr[j],
            );
          } else {
            remainingLetters = remainingLetters.replace(
              remainingLetters[multipleIndexArr[j]],
              " ",
            );
            changeLetterColor(
              guessCopy[multipleIndexArr[j]],
              "gray",
              multipleIndexArr[j],
            );
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
      // check guess, if not increase row
      const result = checkGuess();
      setRow((row) => row + 1);
      if (result === true) {
        setIsWon(true);
        setGameOverOpen(true);
        setTimeout(() => {
          setIsWon(true);
          setGameOverOpen(true);
        }, 200);
      } else if (result === false && row === 5) {
        setTimeout(() => {
          setIsWon(false);
          setGameOverOpen(true);
        }, 200);
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

  function onModalClose() {
    if (isHowToPlayOpen) {
      setHowToPlayOpen(false);
    }

    if (isGameOverOpen) {
      setGameOverOpen(false);
    }
  }

  return (
    <>
      <HowToPlay isOpen={isHowToPlayOpen} onClose={onModalClose} />
      <GameOver
        isOpen={isGameOverOpen}
        onClose={onModalClose}
        isWon={isWon}
        word={word}
        tries={row}
        resetGame={resetGame}
      />
      {guesses.map((guess, guessIdx) => {
        return (
          <div className="row" key={"row-" + guessIdx}>
            {[...guess].map((letterObj, letterIdx) => {
              // only color guessIdx < row
              return (
                <div
                  className={`box ${letterObj.letter === " " ? "box-empty" : ""} ${guessIdx < row && letterObj.color !== "" ? "letter-" + letterObj.color : ""}`}
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
