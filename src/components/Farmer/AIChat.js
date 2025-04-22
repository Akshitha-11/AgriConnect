import React, { useState } from 'react';

function AIChat() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: query }),
      });

      const result = await res.json();

      if (result.error) {
        setResponse(`Error: ${result.error}`);
      } else {
        setResponse(result[0]?.generated_text || 'No response received');
      }

    } catch (error) {
      console.error('Error:', error);
      setResponse('Error getting response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Assistant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Ask your question</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Type your question here..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Getting Response...' : 'Ask Question'}
          </button>
        </form>

        {loading && (
          <p className="text-sm text-gray-500 mt-4">Thinking... ✨</p>
        )}

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Response:</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">{response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIChat;
