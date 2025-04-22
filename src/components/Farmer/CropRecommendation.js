import React, { useState } from 'react';

function CropRecommendation() {
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const recommendCrops = (soil_type, season) => {
    // Simulated AI knowledge base
    const recommendations = {
      'black_kharif': ["Cotton", "Soybean", "Maize"],
      'loamy_rabi': ["Wheat", "Mustard", "Barley"],
      'clay_summer': ["Paddy", "Sugarcane", "Jute"],
      'sandy_kharif': ["Millets", "Groundnut"],
      'alluvial_rabi': ["Chickpea", "Lentil", "Pea"],
    };

    const key = `${soil_type.toLowerCase()}_${season.toLowerCase()}`;
    return recommendations[key] || ["No specific recommendation. Try another combination."];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!soilType || !season) {
      setError('Please select both soil type and season');
      return;
    }

    const crops = recommendCrops(soilType, season);
    setRecommendations(crops);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crop Recommendation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Soil Type</option>
              <option value="black">Black Soil</option>
              <option value="loamy">Loamy Soil</option>
              <option value="clay">Clay Soil</option>
              <option value="sandy">Sandy Soil</option>
              <option value="alluvial">Alluvial Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Season</option>
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="summer">Summer</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Get Recommendations
          </button>
        </form>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended Crops:</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <ul className="space-y-2">
                {recommendations.map((crop, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2">🌾</span>
                    {crop}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropRecommendation; 