import { useState } from "react";
import { convertDecimal } from "./algorithms/conversion/conversion";
import { division } from "./algorithms/division/division";

function App() {
  const [decimalInput, setDecimalInput] = useState("");
    const [bitSize, setBitSize] = useState("8");
    const [result, setResult] = useState<ReturnType<typeof convertDecimal> | null>(null);
    const [error, setError] = useState("");

    // For Division
    const [dividendInput, setDividendInput] = useState("");
    const [divisorInput, setDivisorInput] = useState("");
    const [divisionBitSize, setDivisionBitSize] = useState("8");
    const [inputMode, setInputMode] = useState<"decimal" | "binary">("decimal");
    const [divisionResult, setDivisionResult] = useState<ReturnType<typeof division> | null>(null);
    const [divisionError, setDivisionError] = useState("");

    function handleConvert() {
        setError("");
        setResult(null);

        try {
            const conversionResult = convertDecimal(
                decimalInput,
                Number(bitSize)
            );

            setResult(conversionResult);
        } 
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } 
            else {
                setError("An unexpected error occurred.");
            }
        }
    }

    // For Division
    function handleDivide() {
        setDivisionError("");
        setDivisionResult(null);

        if (
            dividendInput.trim() === "" ||
            divisorInput.trim() === ""
        ) {
            setDivisionError("Dividend and divisor are required");
            return;
        }

        try {
            const dividend =
                inputMode === "decimal"
                    ? Number(dividendInput)
                    : dividendInput.trim();

            const divisor =
                inputMode === "decimal"
                    ? Number(divisorInput)
                    : divisorInput.trim();

            const computedDivisionResult = division(
                dividend,
                divisor,
                Number(divisionBitSize)
            );

            if (computedDivisionResult.error) {
                setDivisionError(computedDivisionResult.error);
            } else {
                setDivisionResult(computedDivisionResult);
            }
        } catch (error) {
            if (error instanceof Error) {
                setDivisionError(error.message);
            } else {
                setDivisionError("An unexpected error occurred.");
            }
        }
    }


    return (
        <div>
            <h1>Integer Machine</h1>

            <h2>Decimal to Binary Conversion</h2>

            <div>
                <label>
                    Decimal Number:
                    <input
                        type="text"
                        value={decimalInput}
                        onChange={(event) => setDecimalInput(event.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    Data Size:
                    <input
                        type="number"
                        min="2"
                        value={bitSize}
                        onChange={(event) => setBitSize(event.target.value)}
                    />
                </label>
            </div>

            <button onClick={handleConvert}>
                Convert
            </button>

            {error && (
                <div>
                    <p>Error: {error}</p>
                </div>
            )}

            {result && (
                <div>
                    <h3>Result</h3>

                    <p>
                        Input: {result.input}
                    </p>

                    <p>
                        Bit Size: {result.bitSize}
                    </p>

                    <h4>Unsigned</h4>

                    {result.unsigned.valid ? (
                        <p>{result.unsigned.binary}</p>
                    ) : (
                        <p>Error: {result.unsigned.error}</p>
                    )}

                    <h4>Signed (Two's Complement)</h4>

                    {result.signed.valid ? (
                        <p>{result.signed.binary}</p>
                    ) : (
                        <p>Error: {result.signed.error}</p>
                    )}
                </div>
            )}

            <hr />

            
            <h2>Non-Restoring Division</h2>

            <div>
                <label>
                    Input Type:
                    <select
                        value={inputMode}
                        onChange={(event) => {
                            setInputMode(
                                event.target.value as "decimal" | "binary"
                            );
                            setDivisionResult(null);
                            setDivisionError("");
                        }}
                    >
                        <option value="decimal">Decimal</option>
                        <option value="binary">Binary</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Dividend:
                    <input
                        type="text"
                        value={dividendInput}
                        onChange={(event) =>
                            setDividendInput(event.target.value)
                        }
                    />
                </label>
            </div>

            <div>
                <label>
                    Divisor:
                    <input
                        type="text"
                        value={divisorInput}
                        onChange={(event) =>
                            setDivisorInput(event.target.value)
                        }
                    />
                </label>
            </div>

            <div>
                <label>
                    Data Size:
                    <input
                        type="number"
                        min="2"
                        value={divisionBitSize}
                        onChange={(event) =>
                            setDivisionBitSize(event.target.value)
                        }
                    />
                </label>
            </div>

            <button onClick={handleDivide}>
                Divide
            </button>

            {divisionError && (
                <div>
                    <p>Error: {divisionError}</p>
                </div>
            )}

            {divisionResult && (
                <div>
                    <h3>Non-Restoring Division Solution</h3>

                    <h4>Initial States</h4>

                    <p>
                        A: {divisionResult.initialStates?.A}
                    </p>

                    <p>
                        Q: {divisionResult.initialStates?.Q}
                    </p>

                    <p>
                        M: {divisionResult.initialStates?.M}
                    </p>

                    <p>
                        M₂: {divisionResult.initialStates?.M_2}
                    </p>

                    <h4>Step-by-Step Process</h4>

                    {divisionResult.steps?.map((step) => (
                        <div key={step.iteration}>
                            <h5>Iteration {step.iteration}</h5>

                            <p>
                                Before shift: A = {step.A_before},
                                {" "}Q = {step.Q_before}
                            </p>

                            <p>
                                After left shift: A = {step.A_after_shift},
                                {" "}Q = {step.Q_after_shift}
                            </p>

                            <p>
                                Operation: {step.operation}
                            </p>

                            <p>
                                A after operation: {step.A_after_operation}
                            </p>

                            <p>
                                Q₀: {step.Q0}
                            </p>

                            <p>
                                End of iteration: A = {step.A_final},
                                {" "}Q = {step.Q_final}
                            </p>
                        </div>
                    ))}

                    <h4>Final Restoration</h4>

                    {divisionResult.restorationPerformed ? (
                        <div>
                            <p>
                                The final A register was negative, so restoration was
                                performed.
                            </p>

                            <p>
                                A before restoration:
                                {" "}{divisionResult.A_before_restoration}
                            </p>

                            <p>
                                A = A + M
                            </p>

                            <p>
                                Restored A: {divisionResult.R}
                            </p>
                        </div>
                    ) : (
                        <p>
                            No final restoration was required.
                        </p>
                    )}

                    <h4>Final Result</h4>

                    <p>
                        Quotient (binary): {divisionResult.Q}
                    </p>

                    <p>
                        Quotient (decimal): {divisionResult.quotientDecimal}
                    </p>

                    <p>
                        Remainder register A (binary): {divisionResult.R}
                    </p>

                    <p>
                        Remainder (decimal): {divisionResult.remainderDecimal}
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;