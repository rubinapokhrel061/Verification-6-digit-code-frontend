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

    // Allow only  digit input
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
  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");

    // Create a copy of the current inputs
    const newInputs = [...inputs];

    // Insert pasted data into the inputs starting at the specified index
    pasteData.forEach((v, i) => {
      if (index + i < newInputs.length) {
        newInputs[index + i] = v;
      }
    });

    setInputs(newInputs);

    // Focus on the next input after the last pasted one
    const nextIndex = index + pasteData.length;
    if (nextIndex < newInputs.length) {
      document.getElementById(`input-${nextIndex}`).focus();
    }
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
      const response = await axios.post("http://localhost:4000/verify", {
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
    <div className="flex flex-col items-center justify-center h-screen p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <h1 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4">
        Verification Code:
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center p-4 w-full max-w-md"
      >
        <div className="flex space-x-2 sm:space-x-4 md:space-x-6 mb-4">
          {inputs.map((input, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              value={input}
              onPaste={(e) => handlePaste(e, index)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center font-semibold text-lg border-[2px] shadow-md rounded-lg focus:outline-none mb-2 ${
                input
                  ? "border-gray-700 focus:border-blue-500"
                  : "border-red-500 focus:border-red-600"
              }`}
              maxLength="1"
            />
          ))}
        </div>
        {error && (
          <div className="text-red-500 mb-4 text-sm sm:text-base">{error}</div>
        )}
        <button
          type="submit"
          className="px-8 py-3 sm:px-12 sm:py-4 text-lg sm:text-xl font-semibold uppercase bg-[#110647] text-white rounded-lg hover:bg-[#0a0429]"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default VerificationForm;
