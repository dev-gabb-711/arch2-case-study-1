import { useState } from "react";
import { convertDecimal } from "./algorithms/conversion/conversion";
import { division } from "./algorithms/division/division";
import { multiplication } from "./algorithms/multiplication/multiplication";
import "./App.css";

type ActivePage =
    | "home"
    | "conversion"
    | "multiplication"
    | "division";

function App() {
    // PAGE NAVIGATION
    const [activePage, setActivePage] = useState<ActivePage>("home");

    // CONVERSION STATES
    const [decimalInput, setDecimalInput] = useState("");
    const [bitSize, setBitSize] = useState("8");
    const [result, setResult] = useState<ReturnType<typeof convertDecimal> | null>(null);
    const [error, setError] = useState("");

    // DIVISION STATES
    const [dividendInput, setDividendInput] = useState("");
    const [divisorInput, setDivisorInput] = useState("");
    const [divisionBitSize, setDivisionBitSize] = useState("8");
    const [inputMode, setInputMode] = useState<"decimal" | "binary">("decimal");
    const [divisionResult, setDivisionResult] = useState<ReturnType<typeof division> | null>(null);
    const [divisionError, setDivisionError] = useState("");

    //  MULTIPLICATION STATES
    const [multiplicandInput, setMultiplicandInput] = useState("");
    const [multiplierInput, setMultiplierInput] = useState("");
    const [multiplicationBitSize, setMultiplicationBitSize] = useState(8);
    const [multiplicationInputMode, setMultiplicationInputMode] = useState<"decimal" | "binary">("decimal");
    const [multiplicationResult, setMultiplicationResult] = useState<ReturnType<typeof multiplication> | null>(null);
    const [multiplicationError, setMultiplicationError] = useState("");

    // NAVIGATION
    function changePage(page: ActivePage) {
        setActivePage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // CONVERSION FUNCTIONS
    function handleConvert() {
        setError("");
        setResult(null);

        if (decimalInput.trim() === "") {
            setError("A decimal number is required.");
            return;
        }

        if (bitSize.trim() === "") {
            setError("A data size is required.");
            return;
        }

        try {
            const conversionResult = convertDecimal(
                decimalInput,
                Number(bitSize)
            );

            setResult(conversionResult);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }

    function clearConversion() {
        setDecimalInput("");
        setBitSize("8");
        setResult(null);
        setError("");
    }


    // DIVISION FUNCTIONS
    function handleDivide() {
        setDivisionError("");
        setDivisionResult(null);

        if (
            dividendInput.trim() === "" ||
            divisorInput.trim() === ""
        ) {
            setDivisionError(
                "Dividend and divisor are required."
            );

            return;
        }

        if (divisionBitSize.trim() === "") {
            setDivisionError("A data size is required.");
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
                setDivisionError(
                    computedDivisionResult.error
                );
            } else {
                setDivisionResult(
                    computedDivisionResult
                );
            }
        } catch (error) {
            if (error instanceof Error) {
                setDivisionError(error.message);
            } else {
                setDivisionError(
                    "An unexpected error occurred."
                );
            }
        }
    }

    function clearDivision() {
        setDividendInput("");
        setDivisorInput("");
        setDivisionBitSize("8");
        setInputMode("decimal");
        setDivisionResult(null);
        setDivisionError("");
    }

     // MULTIPLICATION FUNCTIONS
    function handleMultiply() {
        setMultiplicationError("");
        setMultiplicationResult(null);

        if (
            multiplicandInput.trim() === "" ||
            multiplierInput.trim() === ""
        ) {
            setMultiplicationError("Multiplicand and multiplier are required");
            return;
        }

        try {
            const multiplicand =
                multiplicationInputMode === "decimal"
                    ? Number(multiplicandInput)
                    : multiplicandInput.trim();

            const multiplier =
                multiplicationInputMode === "decimal"
                    ? Number(multiplierInput)
                    : multiplierInput.trim();

            const computedMultiplicationResult = multiplication(
                multiplicand,
                multiplier,
                Number(multiplicationBitSize)
            );

            if (computedMultiplicationResult.error) {
                setMultiplicationError(computedMultiplicationResult.error);
            } else {
                setMultiplicationResult(computedMultiplicationResult);
            }
        } catch (error) {
            if (error instanceof Error) {
                setMultiplicationError(error.message);
            } else {
                setMultiplicationError("An unexpected error occurred.");
            }
        }
    }

    function clearMultiplication() {
    setMultiplicandInput("");
    setMultiplierInput("");
    setMultiplicationBitSize(8);
    setMultiplicationInputMode("decimal");
    setMultiplicationResult(null);
    setMultiplicationError("");
    }

    // HOME PAGE
    function renderHome() {
        return (
            <main className="machine-page home-page">
                <section className="machine-hero">
                    <div className="hero-corner hero-corner-top-left" />
                    <div className="hero-corner hero-corner-top-right" />
                    <div className="hero-corner hero-corner-bottom-left" />
                    <div className="hero-corner hero-corner-bottom-right" />

                    <div className="hero-title-area">

                        
                        <h1>Integer Machine</h1>

                        <p className="hero-subtitle">
                            Computer Organization and Architecture
                        </p>
                    </div>

                    <div className="container-fluid home-module-container">
                        <div className="row g-4 justify-content-center">
                            <div className="col-12 col-md-6 col-xl-4">
                                <article className="module-card">
                                    <div className="module-card-stripes" />

                                    <div className="module-number">
                                        01
                                    </div>

                                    <div className="module-card-content">
                                        <div className="module-icon">
                                            <i className="bi bi-arrow-left-right" />
                                        </div>

                                        <div>
                                            <span className="module-status ready">
                                                Integer Operation
                                            </span>

                                            <h2>Conversion</h2>

                                            <p>
                                                Convert decimal
                                                numbers into unsigned
                                                and signed binary
                                                representations.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="machine-button module-button"
                                        onClick={() =>
                                            changePage("conversion")
                                        }
                                    >
                                        <span>Execute</span>

                                        <i className="bi bi-chevron-right" />
                                    </button>
                                </article>
                            </div>

                            <div className="col-12 col-md-6 col-xl-4">
                                <article className="module-card multiplication-home-card">
                                    <div className="module-card-stripes" />

                                    <div className="module-number">
                                        02
                                    </div>

                                    <div className="module-card-content">
                                        <div className="module-icon">
                                            <i className="bi bi-x-lg" />
                                        </div>

                                        <div>
                                            <span className="module-status ready">
                                                Integer Operation
                                            </span>

                                            <h2>Multiplication</h2>

                                            <p>
                                                Simulate binary
                                                multiplication and
                                                inspect every register
                                                operation.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="machine-button module-button"
                                        onClick={() =>
                                            changePage(
                                                "multiplication"
                                            )
                                        }
                                    >
                                        <span>Execute</span>

                                        <i className="bi bi-chevron-right" />
                                    </button>
                                </article>
                            </div>

                            <div className="col-12 col-md-6 col-xl-4">
                                <article className="module-card">
                                    <div className="module-card-stripes" />

                                    <div className="module-number">
                                        03
                                    </div>

                                    <div className="module-card-content">
                                        <div className="module-icon">
                                            <i className="bi bi-percent" />
                                        </div>

                                        <div>
                                            <span className="module-status ready">
                                                Integer Operation
                                            </span>

                                            <h2>Division</h2>

                                            <p>
                                                Perform non-restoring
                                                division and inspect
                                                every register state.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="machine-button module-button"
                                        onClick={() =>
                                            changePage("division")
                                        }
                                    >
                                        <span>Execute</span>

                                        <i className="bi bi-chevron-right" />
                                    </button>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // CONVERSION PAGE
    function renderConversion() {
        return (
            <main className="machine-page module-page">
                <section className="module-page-heading">
                    <h1>Decimal to Binary Conversion</h1>
                </section>

                <section className="container-fluid workspace-container">
                    <div className="row g-4">
                        <div className="col-12 col-lg-5">
                            <article className="hud-panel h-100">
                                <div className="hud-panel-accent" />

                                <header className="hud-panel-header">
                                    <div>
                                        <span className="panel-label">
                                            Input Panel
                                        </span>

                                        <h2>
                                            Conversion Parameters
                                        </h2>
                                    </div>

                                    <span className="panel-state">
                                        Ready
                                    </span>
                                </header>

                                <div className="hud-panel-body">
                                    <div className="machine-form-group">
                                        <label htmlFor="decimalInput">
                                            Decimal Number
                                        </label>

                                        <input
                                            id="decimalInput"
                                            className="form-control machine-form-control"
                                            type="text"
                                            value={decimalInput}
                                            placeholder="Enter a decimal integer"
                                            onChange={(event) =>
                                                setDecimalInput(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {
                                                    handleConvert();
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="machine-form-group">
                                        <label htmlFor="conversionBitSize">
                                            Data Size
                                        </label>

                                        <div className="input-group">
                                            <input
                                                id="conversionBitSize"
                                                className="form-control machine-form-control"
                                                type="number"
                                                min="2"
                                                value={bitSize}
                                                onChange={(event) =>
                                                    setBitSize(
                                                        event.target
                                                            .value
                                                    )
                                                }
                                            />

                                            <span className="input-group-text machine-addon">
                                                Bits
                                            </span>
                                        </div>
                                    </div>

                                    <div className="machine-button-group">
                                        <button
                                            type="button"
                                            className="machine-button machine-button-primary"
                                            onClick={handleConvert}
                                        >
                                            <span>Convert</span>

                                            <i className="bi bi-chevron-right" />
                                        </button>

                                        <button
                                            type="button"
                                            className="machine-button machine-button-secondary"
                                            onClick={clearConversion}
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    {error && (
                                        <div
                                            className="machine-alert"
                                            role="alert"
                                        >
                                            <i className="bi bi-exclamation-triangle" />

                                            <div>
                                                <strong>
                                                    Input Error
                                                </strong>

                                                <span>
                                                    {error}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <footer className="hud-panel-footer">
                                    <span>
                                        Module: Conversion
                                    </span>

                                    <span>
                                        Data Size:{" "}
                                        {bitSize || "—"} Bit
                                    </span>
                                </footer>
                            </article>
                        </div>

                        <div className="col-12 col-lg-7">
                            <article className="hud-panel h-100">
                                <div className="hud-panel-accent" />

                                <header className="hud-panel-header">
                                    <div>
                                        <span className="panel-label">
                                            Result Panel
                                        </span>

                                        <h2>
                                            Conversion Output
                                        </h2>
                                    </div>

                                    <span
                                        className={`panel-state ${
                                            result
                                                ? "panel-state-complete"
                                                : ""
                                        }`}
                                    >
                                        {result
                                            ? "Complete"
                                            : "Awaiting"}
                                    </span>
                                </header>

                                <div className="hud-panel-body">
                                    {!result ? (
                                        <div className="empty-result">
                                            <div className="empty-result-icon">
                                                <i className="bi bi-arrow-left-right" />
                                            </div>

                                            <h3>
                                                Awaiting Input
                                            </h3>

                                            <p>
                                                Enter a decimal
                                                value and execute
                                                the conversion to
                                                display its binary
                                                representations.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="conversion-result">
                                            <div className="row g-3 result-summary-row">
                                                <div className="col-12 col-sm-6">
                                                    <div className="summary-box">
                                                        <span>
                                                            Input Value
                                                        </span>

                                                        <strong>
                                                            {
                                                                result.input
                                                            }
                                                        </strong>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6">
                                                    <div className="summary-box">
                                                        <span>
                                                            Data Size
                                                        </span>

                                                        <strong>
                                                            {
                                                                result.bitSize
                                                            }{" "}
                                                            Bit
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="binary-output-box">
                                                <div className="binary-output-heading">
                                                    <span>
                                                        Unsigned
                                                        Binary
                                                    </span>

                                                    <span
                                                        className={
                                                            result
                                                                .unsigned
                                                                .valid
                                                                ? "valid-status"
                                                                : "invalid-status"
                                                        }
                                                    >
                                                        {result
                                                            .unsigned
                                                            .valid
                                                            ? "Valid"
                                                            : "Invalid"}
                                                    </span>
                                                </div>

                                                {result.unsigned
                                                    .valid ? (
                                                    <code className="binary-value">
                                                        {
                                                            result
                                                                .unsigned
                                                                .binary
                                                        }
                                                    </code>
                                                ) : (
                                                    <p className="result-error-message">
                                                        {
                                                            result
                                                                .unsigned
                                                                .error
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="binary-output-box">
                                                <div className="binary-output-heading">
                                                    <span>
                                                        Signed
                                                        Two&apos;s
                                                        Complement
                                                    </span>

                                                    <span
                                                        className={
                                                            result
                                                                .signed
                                                                .valid
                                                                ? "valid-status"
                                                                : "invalid-status"
                                                        }
                                                    >
                                                        {result.signed
                                                            .valid
                                                            ? "Valid"
                                                            : "Invalid"}
                                                    </span>
                                                </div>

                                                {result.signed
                                                    .valid ? (
                                                    <code className="binary-value">
                                                        {
                                                            result
                                                                .signed
                                                                .binary
                                                        }
                                                    </code>
                                                ) : (
                                                    <p className="result-error-message">
                                                        {
                                                            result
                                                                .signed
                                                                .error
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <footer className="hud-panel-footer">
                                    <span>Format: Binary</span>

                                    <span>
                                        Status:{" "}
                                        {result
                                            ? "Completed"
                                            : "Idle"}
                                    </span>
                                </footer>
                            </article>
                        </div>
                    </div>
                </section>
            </main>
        );
    }


    // MULTIPLICATION PAGE
    function renderMultiplication() {
        return (
            <main className="machine-page module-page">
                <section className="module-page-heading">
                    <h1>Binary Multiplication</h1>
                </section>

                <section className="container-fluid workspace-container">
                    <div className="row g-4">
                        {/* INPUT PANEL */}
                        <div className="col-12 col-lg-5">
                            <article className="hud-panel h-100">
                                <div className="hud-panel-accent" />

                                <header className="hud-panel-header">
                                    <div>
                                        <span className="panel-label">
                                            Input Panel
                                        </span>

                                        <h2>
                                            Multiplication Parameters
                                        </h2>
                                    </div>

                                    <span className="panel-state">
                                        Ready
                                    </span>
                                </header>

                                <div className="hud-panel-body">
                                    <div className="machine-form-group">
                                        <label htmlFor="multiplicationInputMode">
                                            Input Type
                                        </label>

                                        <select
                                            id="multiplicationInputMode"
                                            className="form-select machine-form-control"
                                            value={multiplicationInputMode}
                                            onChange={(event) => {
                                                setMultiplicationInputMode(
                                                    event.target.value as
                                                        | "decimal"
                                                        | "binary"
                                                );

                                                setMultiplicationResult(null);
                                                setMultiplicationError("");
                                            }}
                                        >
                                            <option value="decimal">
                                                Decimal
                                            </option>

                                            <option value="binary">
                                                Binary
                                            </option>
                                        </select>
                                    </div>

                                    <div className="machine-form-group">
                                        <label htmlFor="multiplicandInput">
                                            Multiplicand
                                        </label>

                                        <input
                                            id="multiplicandInput"
                                            className="form-control machine-form-control"
                                            type="text"
                                            value={multiplicandInput}
                                            placeholder={
                                                multiplicationInputMode ===
                                                "decimal"
                                                    ? "Enter multiplicand"
                                                    : "Enter signed binary multiplicand"
                                            }
                                            onChange={(event) =>
                                                setMultiplicandInput(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="machine-form-group">
                                        <label htmlFor="multiplierInput">
                                            Multiplier
                                        </label>

                                        <input
                                            id="multiplierInput"
                                            className="form-control machine-form-control"
                                            type="text"
                                            value={multiplierInput}
                                            placeholder={
                                                multiplicationInputMode ===
                                                "decimal"
                                                    ? "Enter multiplier"
                                                    : "Enter signed binary multiplier"
                                            }
                                            onChange={(event) =>
                                                setMultiplierInput(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    handleMultiply();
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="machine-form-group">
                                        <label htmlFor="multiplicationBitSize">
                                            Data Size
                                        </label>

                                        <div className="input-group">
                                            <input
                                                id="multiplicationBitSize"
                                                className="form-control machine-form-control"
                                                type="number"
                                                min="2"
                                                value={multiplicationBitSize}
                                                onChange={(event) =>
                                                    setMultiplicationBitSize(
                                                        Number(
                                                            event.target.value
                                                        )
                                                    )
                                                }
                                            />

                                            <span className="input-group-text machine-addon">
                                                Bits
                                            </span>
                                        </div>
                                    </div>

                                    <div className="machine-button-group">
                                        <button
                                            type="button"
                                            className="machine-button machine-button-primary"
                                            onClick={handleMultiply}
                                        >
                                            <span>
                                                Execute Multiplication
                                            </span>

                                            <i className="bi bi-chevron-right" />
                                        </button>

                                        <button
                                            type="button"
                                            className="machine-button machine-button-secondary"
                                            onClick={clearMultiplication}
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    {multiplicationError && (
                                        <div
                                            className="machine-alert"
                                            role="alert"
                                        >
                                            <i className="bi bi-exclamation-triangle" />

                                            <div>
                                                <strong>
                                                    Multiplication Error
                                                </strong>

                                                <span>
                                                    {multiplicationError}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <footer className="hud-panel-footer">
                                    <span>
                                        Input:{" "}
                                        {multiplicationInputMode.toUpperCase()}
                                    </span>

                                    <span>
                                        Data Size:{" "}
                                        {multiplicationBitSize || "—"} Bit
                                    </span>
                                </footer>
                            </article>
                        </div>

                        {/* RESULT PANEL */}
                        <div className="col-12 col-lg-7">
                            <article className="hud-panel h-100">
                                <div className="hud-panel-accent" />

                                <header className="hud-panel-header">
                                    <div>
                                        <span className="panel-label">
                                            Result Panel
                                        </span>

                                        <h2>
                                            Multiplication Output
                                        </h2>
                                    </div>

                                    <span
                                        className={`panel-state ${
                                            multiplicationResult
                                                ? "panel-state-complete"
                                                : ""
                                        }`}
                                    >
                                        {multiplicationResult
                                            ? "Complete"
                                            : "Awaiting"}
                                    </span>
                                </header>

                                <div className="hud-panel-body">
                                    {!multiplicationResult ? (
                                        <div className="empty-result">
                                            <div className="empty-result-icon">
                                                <i className="bi bi-x-lg" />
                                            </div>

                                            <h3>
                                                Awaiting Input
                                            </h3>

                                            <p>
                                                Enter the multiplicand,
                                                multiplier, input type, and
                                                data size to begin Booth&apos;s
                                                multiplication process.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="multiplication-result">
                                            <div className="primary-result multiplication-product">
                                                <span>
                                                    Decimal Product
                                                </span>

                                                <strong>
                                                    {
                                                        multiplicationResult.productDecimal
                                                    }
                                                </strong>

                                                <code>
                                                    {
                                                        multiplicationResult.Product
                                                    }
                                                </code>
                                            </div>

                                            <div className="initial-registers multiplication-registers">
                                                <div className="register-box">
                                                    <span>
                                                        Initial A
                                                    </span>

                                                    <code>
                                                        {
                                                            multiplicationResult
                                                                .initialStates?.A
                                                        }
                                                    </code>
                                                </div>

                                                <div className="register-box">
                                                    <span>
                                                        Initial Q
                                                    </span>

                                                    <code>
                                                        {
                                                            multiplicationResult
                                                                .initialStates?.Q
                                                        }
                                                    </code>
                                                </div>

                                                <div className="register-box">
                                                    <span>
                                                        Initial Q₋₁
                                                    </span>

                                                    <code>
                                                        {
                                                            multiplicationResult
                                                                .initialStates
                                                                ?.Q_1
                                                        }
                                                    </code>
                                                </div>

                                                <div className="register-box">
                                                    <span>
                                                        M Register
                                                    </span>

                                                    <code>
                                                        {
                                                            multiplicationResult
                                                                .initialStates?.M
                                                        }
                                                    </code>
                                                </div>

                                                <div className="register-box">
                                                    <span>
                                                        M₂ Register
                                                    </span>

                                                    <code>
                                                        {
                                                            multiplicationResult
                                                                .initialStates
                                                                ?.M_2
                                                        }
                                                    </code>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <footer className="hud-panel-footer">
                                    <span>
                                        Algorithm: Booth&apos;s
                                    </span>

                                    <span>
                                        Status:{" "}
                                        {multiplicationResult
                                            ? "Completed"
                                            : "Idle"}
                                    </span>
                                </footer>
                            </article>
                        </div>
                    </div>

                    {/* EXECUTION TRACE */}
                    {multiplicationResult && (
                        <article className="hud-panel execution-panel mt-4">
                            <div className="hud-panel-accent" />

                            <header className="hud-panel-header">
                                <div>
                                    <span className="panel-label">
                                        Execution Trace
                                    </span>

                                    <h2>
                                        Step-by-Step Process
                                    </h2>
                                </div>

                                <span className="panel-state panel-state-complete">
                                    {multiplicationResult.steps?.length ?? 0}{" "}
                                    Cycles
                                </span>
                            </header>

                            <div className="hud-panel-body">
                                <div className="table-responsive execution-table-container">
                                    <table className="table execution-table multiplication-table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Cycle</th>
                                                <th>Before Operation</th>
                                                <th>Pair</th>
                                                <th>Operation</th>
                                                <th>A After Operation</th>
                                                <th>After Shift Right</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {multiplicationResult.steps?.map(
                                                (step) => (
                                                    <tr key={step.iteration}>
                                                        <td>
                                                            <span className="cycle-badge">
                                                                {step.iteration}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="table-register">
                                                                <span>A</span>

                                                                <code>
                                                                    {
                                                                        step.A_before
                                                                    }
                                                                </code>
                                                            </div>

                                                            <div className="table-register">
                                                                <span>Q</span>

                                                                <code>
                                                                    {
                                                                        step.Q_before
                                                                    }
                                                                </code>
                                                            </div>

                                                            <div className="table-register">
                                                                <span>
                                                                    Q₋₁
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.Q_1_before
                                                                    }
                                                                </code>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span className="pair-badge">
                                                                {step.pair}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className="operation-badge">
                                                                {step.operation}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <code className="table-binary-value">
                                                                {
                                                                    step.A_after_operation
                                                                }
                                                            </code>
                                                        </td>

                                                        <td>
                                                            <div className="table-register">
                                                                <span>A</span>

                                                                <code>
                                                                    {
                                                                        step.A_final
                                                                    }
                                                                </code>
                                                            </div>

                                                            <div className="table-register">
                                                                <span>Q</span>

                                                                <code>
                                                                    {
                                                                        step.Q_final
                                                                    }
                                                                </code>
                                                            </div>

                                                            <div className="table-register">
                                                                <span>
                                                                    Q₋₁
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.Q_1_final
                                                                    }
                                                                </code>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="final-restoration multiplication-summary">
                                    <div>
                                        <span>
                                            Final Product
                                        </span>

                                        <h3>
                                            Multiplication Complete
                                        </h3>

                                        <p>
                                            The final product is formed by
                                            concatenating the final A and Q
                                            registers after all Booth cycles
                                            are completed.
                                        </p>
                                    </div>

                                    <div className="restoration-registers">
                                        <div>
                                            <span>
                                                Binary Product
                                            </span>

                                            <code>
                                                {
                                                    multiplicationResult.Product
                                                }
                                            </code>
                                        </div>

                                        <div>
                                            <span>
                                                Decimal Product
                                            </span>

                                            <code>
                                                {
                                                    multiplicationResult.productDecimal
                                                }
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    )}
                </section>
            </main>
        );
    }

    // DIVISION PAGE
    function renderDivision() {
        return (
            <main className="machine-page module-page">
                <section className="module-page-heading">
                    <h1>Non-Restoring Division</h1>
                </section>

                <section className="container-fluid workspace-container">
                    <div className="row g-4">
                        <div className="col-12 col-lg-5">
                            <article className="hud-panel h-100">
                                <div className="hud-panel-accent" />

                                <header className="hud-panel-header">
                                    <div>
                                        <span className="panel-label">
                                            Input Panel
                                        </span>

                                        <h2>
                                            Division Parameters
                                        </h2>
                                    </div>

                                    <span className="panel-state">
                                        Ready
                                    </span>
                                </header>

                                <div className="hud-panel-body">
                                    <div className="machine-form-group">
                                        <label htmlFor="inputMode">
                                            Input Type
                                        </label>

                                        <select
                                            id="inputMode"
                                            className="form-select machine-form-control"
                                            value={inputMode}
                                            onChange={(event) => {
                                                setInputMode(
                                                    event.target
                                                        .value as
                                                        | "decimal"
                                                        | "binary"
                                                );

                                                setDivisionResult(
                                                    null
                                                );

                                                setDivisionError(
                                                    ""
                                                );
                                            }}
                                        >
                                            <option value="decimal">
                                                Decimal
                                            </option>

                                            <option value="binary">
                                                Binary
                                            </option>
                                        </select>
                                    </div>

                                    <div className="machine-form-group">
                                        <label htmlFor="dividendInput">
                                            Dividend
                                        </label>

                                        <input
                                            id="dividendInput"
                                            className="form-control machine-form-control"
                                            type="text"
                                            value={dividendInput}
                                            placeholder={
                                                inputMode ===
                                                "decimal"
                                                    ? "Enter dividend"
                                                    : "Enter binary dividend"
                                            }
                                            onChange={(event) =>
                                                setDividendInput(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="machine-form-group">
                                        <label htmlFor="divisorInput">
                                            Divisor
                                        </label>

                                        <input
                                            id="divisorInput"
                                            className="form-control machine-form-control"
                                            type="text"
                                            value={divisorInput}
                                            placeholder={
                                                inputMode ===
                                                "decimal"
                                                    ? "Enter divisor"
                                                    : "Enter binary divisor"
                                            }
                                            onChange={(event) =>
                                                setDivisorInput(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {
                                                    handleDivide();
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="machine-form-group">
                                        <label htmlFor="divisionBitSize">
                                            Data Size
                                        </label>

                                        <div className="input-group">
                                            <input
                                                id="divisionBitSize"
                                                className="form-control machine-form-control"
                                                type="number"
                                                min="2"
                                                value={divisionBitSize}
                                                onChange={(event) =>
                                                    setDivisionBitSize(
                                                        event.target
                                                            .value
                                                    )
                                                }
                                            />

                                            <span className="input-group-text machine-addon">
                                                Bits
                                            </span>
                                        </div>
                                    </div>

                                    <div className="machine-button-group">
                                        <button
                                            type="button"
                                            className="machine-button machine-button-primary"
                                            onClick={handleDivide}
                                        >
                                            <span>
                                                Execute Division
                                            </span>

                                            <i className="bi bi-chevron-right" />
                                        </button>

                                        <button
                                            type="button"
                                            className="machine-button machine-button-secondary"
                                            onClick={clearDivision}
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    {divisionError && (
                                        <div
                                            className="machine-alert"
                                            role="alert"
                                        >
                                            <i className="bi bi-exclamation-triangle" />

                                            <div>
                                                <strong>
                                                    Division Error
                                                </strong>

                                                <span>
                                                    {
                                                        divisionError
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <footer className="hud-panel-footer">
                                    <span>
                                        Input:{" "}
                                        {inputMode.toUpperCase()}
                                    </span>

                                    <span>
                                        Data Size:{" "}
                                        {divisionBitSize ||
                                            "—"}{" "}
                                        Bit
                                    </span>
                                </footer>
                            </article>
                        </div>

                        <div className="col-12 col-lg-7">
                            <article className="hud-panel h-100">
                                <div className="hud-panel-accent" />

                                <header className="hud-panel-header">
                                    <div>
                                        <span className="panel-label">
                                            Result Panel
                                        </span>

                                        <h2>
                                            Division Output
                                        </h2>
                                    </div>

                                    <span
                                        className={`panel-state ${
                                            divisionResult
                                                ? "panel-state-complete"
                                                : ""
                                        }`}
                                    >
                                        {divisionResult
                                            ? "Complete"
                                            : "Awaiting"}
                                    </span>
                                </header>

                                <div className="hud-panel-body">
                                    {!divisionResult ? (
                                        <div className="empty-result">
                                            <div className="empty-result-icon">
                                                <i className="bi bi-percent" />
                                            </div>

                                            <h3>
                                                Awaiting Input
                                            </h3>

                                            <p>
                                                Enter the dividend,
                                                divisor, and data
                                                size to begin the
                                                non-restoring
                                                division process.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="division-result">
                                            <div className="row g-3">
                                                <div className="col-12 col-sm-6">
                                                    <div className="primary-result">
                                                        <span>
                                                            Quotient
                                                        </span>

                                                        <strong>
                                                            {
                                                                divisionResult.quotientDecimal
                                                            }
                                                        </strong>

                                                        <code>
                                                            {
                                                                divisionResult.Q
                                                            }
                                                        </code>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6">
                                                    <div className="primary-result">
                                                        <span>
                                                            Remainder
                                                        </span>

                                                        <strong>
                                                            {
                                                                divisionResult.remainderDecimal
                                                            }
                                                        </strong>

                                                        <code>
                                                            {
                                                                divisionResult.R
                                                            }
                                                        </code>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="initial-registers">
                                                <div className="register-box">
                                                    <span>
                                                        Initial A
                                                    </span>

                                                    <code>
                                                        {
                                                            divisionResult
                                                                .initialStates
                                                                ?.A
                                                        }
                                                    </code>
                                                </div>

                                                <div className="register-box">
                                                    <span>
                                                        Initial Q
                                                    </span>

                                                    <code>
                                                        {
                                                            divisionResult
                                                                .initialStates
                                                                ?.Q
                                                        }
                                                    </code>
                                                </div>

                                                <div className="register-box">
                                                    <span>
                                                        M Register
                                                    </span>

                                                    <code>
                                                        {
                                                            divisionResult
                                                                .initialStates
                                                                ?.M
                                                        }
                                                    </code>
                                                </div>

                                                <div className="register-box">
                                                    <span>
                                                        M₂ Register
                                                    </span>

                                                    <code>
                                                        {
                                                            divisionResult
                                                                .initialStates
                                                                ?.M_2
                                                        }
                                                    </code>
                                                </div>
                                            </div>

                                            <div className="restoration-summary">
                                                <span>
                                                    Final
                                                    Restoration
                                                </span>

                                                <strong>
                                                    {divisionResult.restorationPerformed
                                                        ? "Performed"
                                                        : "Not Required"}
                                                </strong>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <footer className="hud-panel-footer">
                                    <span>
                                        Algorithm:
                                        Non-Restoring
                                    </span>

                                    <span>
                                        Status:{" "}
                                        {divisionResult
                                            ? "Completed"
                                            : "Idle"}
                                    </span>
                                </footer>
                            </article>
                        </div>
                    </div>

                    {divisionResult && (
                        <article className="hud-panel execution-panel mt-4">
                            <div className="hud-panel-accent" />

                            <header className="hud-panel-header">
                                <div>
                                    <span className="panel-label">
                                        Execution Trace
                                    </span>

                                    <h2>
                                        Step-by-Step Process
                                    </h2>
                                </div>

                                <span className="panel-state panel-state-complete">
                                    {divisionResult.steps
                                        ?.length ?? 0}{" "}
                                    Cycles
                                </span>
                            </header>

                            <div className="hud-panel-body">
                                <div className="table-responsive execution-table-container">
                                    <table className="table execution-table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Cycle</th>
                                                <th>
                                                    Before Shift Left
                                                </th>
                                                <th>
                                                    After Shift Left
                                                </th>
                                                <th>Operation</th>
                                                <th>
                                                    A After
                                                    Operation
                                                </th>
                                                <th>Q₀</th>
                                                <th>
                                                    Final
                                                    Registers
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {divisionResult.steps?.map(
                                                (step) => (
                                                    <tr
                                                        key={
                                                            step.iteration
                                                        }
                                                    >
                                                        <td>
                                                            <span className="cycle-badge">
                                                                {
                                                                    step.iteration
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="table-register">
                                                                <span>
                                                                    A
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.A_before
                                                                    }
                                                                </code>
                                                            </div>

                                                            <div className="table-register">
                                                                <span>
                                                                    Q
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.Q_before
                                                                    }
                                                                </code>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <div className="table-register">
                                                                <span>
                                                                    A
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.A_after_shift
                                                                    }
                                                                </code>
                                                            </div>

                                                            <div className="table-register">
                                                                <span>
                                                                    Q
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.Q_after_shift
                                                                    }
                                                                </code>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span className="operation-badge">
                                                                {
                                                                    step.operation
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <code className="table-binary-value">
                                                                {
                                                                    step.A_after_operation
                                                                }
                                                            </code>
                                                        </td>

                                                        <td>
                                                            <span className="q-zero">
                                                                {
                                                                    step.Q0
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="table-register">
                                                                <span>
                                                                    A
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.A_final
                                                                    }
                                                                </code>
                                                            </div>

                                                            <div className="table-register">
                                                                <span>
                                                                    Q
                                                                </span>

                                                                <code>
                                                                    {
                                                                        step.Q_final
                                                                    }
                                                                </code>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="final-restoration">
                                    <div>
                                        <span>
                                            Final Restoration
                                        </span>

                                        <h3>
                                            {divisionResult.restorationPerformed
                                                ? "Restoration Performed"
                                                : "No Restoration Required"}
                                        </h3>

                                        <p>
                                            {divisionResult.restorationPerformed
                                                ? "The final A register was negative, so M was added to restore the remainder."
                                                : "The final A register was non-negative, so no final restoration was necessary."}
                                        </p>
                                    </div>

                                    {divisionResult.restorationPerformed && (
                                        <div className="restoration-registers">
                                            <div>
                                                <span>
                                                    A Before
                                                </span>

                                                <code>
                                                    {
                                                        divisionResult.A_before_restoration
                                                    }
                                                </code>
                                            </div>

                                            <div>
                                                <span>
                                                    Restored A
                                                </span>

                                                <code>
                                                    {
                                                        divisionResult.R
                                                    }
                                                </code>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    )}
                </section>
            </main>
        );
    }

    // MAIN APPLICATION
    return (
        <div className={`integer-machine ${activePage === "home" ? "home-active" : ""}`}>
            <nav className="navbar navbar-expand-lg machine-navbar sticky-top">
                <div className="container-fluid">
                    <button
                        type="button"
                        className="navbar-brand machine-brand"
                        onClick={() => changePage("home")}
                    >
                        <span className="brand-icon">
                            <i className="bi bi-cpu" />
                        </span>

                        <span>Integer Machine</span>
                    </button>

                    <button
                        className="navbar-toggler machine-navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#machineNavbar"
                        aria-controls="machineNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list" />
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="machineNavbar"
                    >
                        <ul className="navbar-nav mx-auto machine-nav-links">
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${
                                        activePage === "home"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        changePage("home")
                                    }
                                >
                                    Home
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${
                                        activePage ===
                                        "conversion"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        changePage(
                                            "conversion"
                                        )
                                    }
                                >
                                    Conversion
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${
                                        activePage ===
                                        "multiplication"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        changePage(
                                            "multiplication"
                                        )
                                    }
                                >
                                    Multiplication
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${
                                        activePage ===
                                        "division"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        changePage(
                                            "division"
                                        )
                                    }
                                >
                                    Division
                                </button>
                            </li>
                        </ul>

                        <div className="system-status">
                            <span className="system-status-light" />

                            <span>System Online</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="machine-content">
                {activePage === "home" && renderHome()}

                {activePage === "conversion" &&
                    renderConversion()}

                {activePage === "multiplication" &&
                    renderMultiplication()}

                {activePage === "division" &&
                    renderDivision()}
            </div>
        </div>
    );
}

export default App;