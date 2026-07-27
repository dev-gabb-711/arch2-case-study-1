import { useState } from "react";
import { convertDecimal } from "./algorithms/conversion/conversion";

function App() {
  const [decimalInput, setDecimalInput] = useState("");
    const [bitSize, setBitSize] = useState("8");
    const [result, setResult] = useState<ReturnType<typeof convertDecimal> | null>(null);
    const [error, setError] = useState("");

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
        </div>
    );
}

export default App;