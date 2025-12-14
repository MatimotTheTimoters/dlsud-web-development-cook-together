import React, { useState } from 'react';
import api from '../api/axiosConfig';

function RecipeForm() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        prep_time: 0,
        cook_time: 0,
        servings: 1,
        difficulty: 'Medium',
        category: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Basic validation
        if (!form.title.trim()) {
            setMessage('❌ Recipe title is required');
            setLoading(false);
            return;
        }

        if (!form.ingredients.trim()) {
            setMessage('❌ Ingredients are required');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/recipe/create.php', {
                ...form,
                user_id: 1
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                setMessage(`✅ Recipe created! ID: ${response.data.recipe_id}`);
                // Reset form
                setForm({
                    title: '',
                    description: '',
                    ingredients: '',
                    steps: '',
                    prep_time: 0,
                    cook_time: 0,
                    servings: 1,
                    difficulty: 'Medium',
                    category: ''
                });
            } else {
                setMessage(`❌ ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage('❌ Failed to create recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="recipe-form" onSubmit={handleSubmit}>
            <h2>🍳 Create New Recipe</h2>

            <div className="form-group">
                <label>Recipe Title *</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Chocolate Chip Cookies"
                    required
                />
            </div>

            <div className="form-group">
                <label>Ingredients *</label>
                <textarea
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                    placeholder="Flour, Sugar, Eggs, Butter"
                    rows="3"
                    required
                />
            </div>

            <div className="form-group">
                <label>Steps</label>
                <textarea
                    name="steps"
                    value={form.steps}
                    onChange={handleChange}
                    placeholder="1. Mix dry ingredients. 2. Add wet ingredients. 3. Bake at 350°F for 20 minutes."
                    rows="3"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Prep Time (minutes)</label>
                    <input
                        type="number"
                        name="prep_time"
                        value={form.prep_time}
                        onChange={handleChange}
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Cook Time (minutes)</label>
                    <input
                        type="number"
                        name="cook_time"
                        value={form.cook_time}
                        onChange={handleChange}
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Servings</label>
                    <input
                        type="number"
                        name="servings"
                        value={form.servings}
                        onChange={handleChange}
                        min="1"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="A delicious recipe that everyone will love!"
                    rows="2"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Difficulty</label>
                    <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Dessert, Main Course, etc."
                    />
                </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Recipe'}
            </button>

            {message && (
                <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
        </form>
    );
}

export default RecipeForm;