import React from "react";
import "./dado.scss";

function DiceRoller() {
  return (
    <div className="container">
      {/* Inputs setA */}
      {Array.from({ length: 36 }, (_, i) => (
        <input
          key={`rollA${i + 1}`}
          className={`setA rollA${i + 1}`}
          type="radio"
          name="die"
          id={`rollA${i + 1}`}
        />
      ))}

      {/* Inputs setB */}
      {Array.from({ length: 36 }, (_, i) => (
        <input
          key={`rollB${i + 1}`}
          className={`setB rollB${i + 1}`}
          type="radio"
          name="die"
          id={`rollB${i + 1}`}
        />
      ))}

      {/* Roll Button */}
      <div className="rollBtn">
        <div className="rollBtn-inner">
          <div className="rollBtn-blocker"></div>

          <div className="labels-set labels-setA">
            {Array.from({ length: 36 }, (_, i) => (
              <label key={`labelA${i + 1}`} htmlFor={`rollA${i + 1}`}></label>
            ))}
          </div>

          <div className="labels-set labels-setB">
            {Array.from({ length: 36 }, (_, i) => (
              <label key={`labelB${i + 1}`} htmlFor={`rollB${i + 1}`}></label>
            ))}
          </div>

          <div className="rollBtn-text">Roll the Dice</div>
        </div>
      </div>

      {/* Result */}
      <div className="result">
        <div className="result-bg-wrapper result-bg-wrapperA">
          <div className="result-bg result-bgA"></div>
        </div>
        <div className="result-bg-wrapper result-bg-wrapperB">
          <div className="result-bg result-bgB"></div>
        </div>

        <div className="result-content">
          {[...Array(11)].map((_, i) => (
            <React.Fragment key={i}>
              <div className={`result-A${i + 2}`}>
                <span>{i + 2}</span>
              </div>
              <div className={`result-B${i + 2}`}>
                <span>{i + 2}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dice */}
      <div className="dice">
        {[1, 2].map((dieNum) => (
          <div key={dieNum} className={`die-wrapper die${dieNum}`}>
            <div className="die">
              <div className="die-inner">
                {/* Face 1 */}
                <div className="face face1">
                  <span className="pips-md"></span>
                </div>

                {/* Face 2 */}
                <div className="face face2">
                  <span className="pips-tl"></span>
                  <span className="pips-br"></span>
                </div>

                {/* Face 3 */}
                <div className="face face3">
                  <span className="pips-tl"></span>
                  <span className="pips-md"></span>
                  <span className="pips-br"></span>
                </div>

                {/* Face 4 */}
                <div className="face face4">
                  <span className="pips-tl"></span>
                  <span className="pips-tr"></span>
                  <span className="pips-bl"></span>
                  <span className="pips-br"></span>
                </div>

                {/* Face 5 */}
                <div className="face face5">
                  <span className="pips-tl"></span>
                  <span className="pips-tr"></span>
                  <span className="pips-md"></span>
                  <span className="pips-bl"></span>
                  <span className="pips-br"></span>
                </div>

                {/* Face 6 */}
                <div className="face face6">
                  <span className="pips-tl"></span>
                  <span className="pips-tr"></span>
                  <span className="pips-mdl"></span>
                  <span className="pips-mdr"></span>
                  <span className="pips-bl"></span>
                  <span className="pips-br"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiceRoller;
