import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [history, setHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history"));
    if (savedHistory) {
      setHistory(savedHistory);
    }
  }, []);
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents newline insertion
      generateAnswer(event);
    }
  }

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take up to 10 seconds");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const newAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(newAnswer);

      if (editIndex !== null) {
        const updatedHistory = history.map((item, index) =>
          index === editIndex ? { question, answer: newAnswer } : item
        );
        setHistory(updatedHistory);
        localStorage.setItem("history", JSON.stringify(updatedHistory));
        setEditIndex(null);
      } else {
        const newHistory = [...history, { question, answer: newAnswer }];
        setHistory(newHistory);
        localStorage.setItem("history", JSON.stringify(newHistory));
      }
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  function clearAll() {
    setQuestion("");
    setAnswer("");
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("history");
  }

  function deleteHistoryItem(index) {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      () => alert("Copied to clipboard!"),
      () => alert("Failed to copy!")
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white md:flex-row">
      <div className="w-full md:w-64 bg-gray-800 flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-4">Chat Bot</h1>
        <button
          onClick={() => window.open('https://github.com/Prabal-verma/ChatBot', '_blank')}
          className="mb-4 bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          GitHub Repo
        </button>
        <button
          onClick={clearHistory}
          className="bg-red-500 py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Clear History
        </button>
        <div className="mt-4 flex-1 overflow-y-auto">
          {history.map((item, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-700 rounded-lg">
              <p className="text-sm">Q: {item.question}</p>
              <p className="text-sm">A: {item.answer}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => deleteHistoryItem(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 md:p-8">
        <form onSubmit={generateAnswer} className="space-y-4">
          <textarea
            required
            className="w-full h-32 p-4 border rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
          ></textarea>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
              disabled={generatingAnswer}
            >
              {generatingAnswer ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25" cx="12" cy="12"r="10" stroke="currentColor" strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) :  (
                "Generate Answer"
              )}
            </button>
            <button
              type="button"
              className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              onClick={clearAll}
            >
              Clear
            </button>
          </div>
        </form>
        <div className="mt-4 p-6 bg-gray-800 rounded-lg shadow-inner relative">
          <ReactMarkdown className="prose max-w-full">{answer}</ReactMarkdown>
          {answer && (
            <button
              onClick={() => copyToClipboard(answer)}
              className="absolute top-2 right-2 bg-gray-600 text-gray-300 p-2 rounded-lg hover:bg-gray-500 transition duration-300"
            >
              Copy
            </button> 
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
