import React, { useState } from 'react';

function QualityGrading() {
  const [formData, setFormData] = useState({
    productType: '',
    size: '',
    color: '',
    texture: '',
    defects: '',
    moisture: ''
  });
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple ML-based grading function
  const gradeProduct = (data) => {
    // Convert inputs to numerical values
    const sizeScore = parseFloat(data.size) / 10;
    const colorScore = parseFloat(data.color) / 10;
    const textureScore = parseFloat(data.texture) / 10;
    const defectsScore = 1 - (parseFloat(data.defects) / 10);
    const moistureScore = 1 - Math.abs(parseFloat(data.moisture) - 0.7); // Optimal moisture around 70%

    // Weighted scoring system
    const weights = {
      size: 0.2,
      color: 0.2,
      texture: 0.2,
      defects: 0.2,
      moisture: 0.2
    };

    // Calculate final score
    const finalScore = 
      sizeScore * weights.size +
      colorScore * weights.color +
      textureScore * weights.texture +
      defectsScore * weights.defects +
      moistureScore * weights.moisture;

    // Determine grade based on score
    if (finalScore >= 0.9) return 'A+';
    if (finalScore >= 0.8) return 'A';
    if (finalScore >= 0.7) return 'B+';
    if (finalScore >= 0.6) return 'B';
    if (finalScore >= 0.5) return 'C';
    return 'D';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const productGrade = gradeProduct(formData);
      setGrade(productGrade);
      setLoading(false);
    }, 1000);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'text-green-600';
      case 'A': return 'text-green-500';
      case 'B+': return 'text-blue-500';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-500';
      case 'D': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Quality Grading</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Product Type</option>
              <option value="vegetable">Vegetable</option>
              <option value="fruit">Fruit</option>
              <option value="grain">Grain</option>
              <option value="dairy">Dairy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size (1-10)
            </label>
            <input
              type="number"
              name="size"
              min="1"
              max="10"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color (1-10)
            </label>
            <input
              type="number"
              name="color"
              min="1"
              max="10"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texture (1-10)
            </label>
            <input
              type="number"
              name="texture"
              min="1"
              max="10"
              value={formData.texture}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Defects (1-10)
            </label>
            <input
              type="number"
              name="defects"
              min="1"
              max="10"
              value={formData.defects}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moisture Content (%)
            </label>
            <input
              type="number"
              name="moisture"
              min="0"
              max="100"
              step="0.1"
              value={formData.moisture}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Grading...' : 'Grade Product'}
          </button>
        </form>

        {grade && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Grade</h3>
            <div className={`text-6xl font-bold ${getGradeColor(grade)}`}>
              {grade}
            </div>
            <p className="mt-2 text-gray-600">
              {grade === 'A+' && 'Excellent quality - Premium grade'}
              {grade === 'A' && 'Very good quality - High grade'}
              {grade === 'B+' && 'Good quality - Above average'}
              {grade === 'B' && 'Average quality - Standard grade'}
              {grade === 'C' && 'Below average quality - Needs improvement'}
              {grade === 'D' && 'Poor quality - Not recommended'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QualityGrading; 