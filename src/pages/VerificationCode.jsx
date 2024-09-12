import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerificationForm = () => {
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only single digit input
    if (/^\d?$/.test(value)) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      // Move focus to the next input if value is entered
      if (value && index < 5) {
        document.getElementById(`input-${index + 1}`).focus();
      } else if (!value && index > 0) {
        document.getElementById(`input-${index - 1}`).focus();
      }

      // Clear error if user starts fixing the input
      if (error) {
        setError("");
      }
    }
  };

  // Handle key down events
  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case "Backspace":
        if (inputs[index] === "") {
          if (index > 0) {
            document.getElementById(`input-${index - 1}`).focus();
          }
        }
        break;
      case "ArrowLeft":
        if (index > 0) {
          document.getElementById(`input-${index - 1}`).focus();
        }
        break;
      case "ArrowRight":
        if (index < 5) {
          document.getElementById(`input-${index + 1}`).focus();
        }
        break;
      default:
        break;
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault(); // Prevent default paste action
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const newInputs = pasteData
      .split("")
      .concat(Array(6 - pasteData.length).fill(""));
    setInputs(newInputs);
    document.getElementById("input-0").focus(); // Reset focus to the first input
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = inputs.join("");

    // Validate code length
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/verify", {
        code,
      });
      if (response.status === 200) {
        navigate("/success");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-2xl mb-4">Verification code:</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center p-4">
        <div className="flex space-x-3 mb-4" onPaste={handlePaste}>
          {inputs.map((input, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              value={input}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-10 h-10 text-center font-semibold text-lg border-[2px] shadow-md rounded-lg focus:outline-none mb-4 ${
                input
                  ? "border-gray-700 focus:border-blue-500"
                  : "border-red-500 focus:border-red-600"
              }`}
              maxLength="1"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="px-16 py-[10px] text-xl font-semibold uppercase bg-[#110647] text-white rounded-lg hover:bg-[#0a0429]"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default VerificationForm;
