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

      const newAnswer = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
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

  function editHistoryItem(index) {
    const item = history[index];
    setQuestion(item.question);
    setAnswer(item.answer);
    setEditIndex(index);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      () => alert("Copied to clipboard!"),
      () => alert("Failed to copy!")
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-6">
        <a href="https://github.com/Vishesh-Pandey/chat-ai" target="_blank" className="block text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Chat Bot
          </h1>
        </a>
        <form onSubmit={generateAnswer} className="space-y-4">
          <textarea
            required
            className="w-full h-32 p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
          ></textarea>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
              disabled={generatingAnswer}
            >
              {generatingAnswer ? (
                <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                editIndex !== null ? "Update Answer" : "Generate Answer"
              )}
            </button>
            <button
              type="button"
              className="w-full py-3 ml-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              onClick={clearAll}
            >
              Clear
            </button>
          </div>
        </form>
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner relative">
          <ReactMarkdown className="prose max-w-full">{answer}</ReactMarkdown>
          {answer && (
            <button
              onClick={() => copyToClipboard(answer)}
              className="absolute top-2 right-2 bg-gray-200 text-gray-600 p-2 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Copy
            </button>
          )}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">History</h2>
            <button
              onClick={clearHistory}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Clear History
            </button>
          </div>
          {history.map((item, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-700 font-semibold">Q: {item.question}</p>
              <p className="text-gray-600">A: {item.answer}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => editHistoryItem(index)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHistoryItem(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
