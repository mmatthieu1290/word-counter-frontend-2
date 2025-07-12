import React, { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(null);
  const [charactersall, setAllCharacters] = useState(null);
  const [charactersclean, setCleanCharacters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    const value = e.target.value;
    setText(value);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://word-counter-7uwc.onrender.com/count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: value }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      setWordCount(data.word_count);
      setAllCharacters(data.characters);
      setCleanCharacters(data.characters_without_spaces);
    } catch (err) {
      setError('Erreur lors de l’appel à l’API');
      setWordCount(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Compteur de mots</h1>
      <textarea
        className="w-full p-4 border rounded-md shadow-sm"
        rows={6}
        placeholder="Écris ton texte ici..."
        value={text}
        onChange={handleChange}
      />
      {loading && <p className="mt-2 text-blue-600">Analyse en cours…</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {wordCount !== null && !loading && (
        <div>
        <p className="mt-2 text-green-700 font-medium">
          Nombre de mots : {wordCount}
        </p>
        <p className="mt-2 text-green-700 font-medium">
          Nombre de caractères incluant les espaces et les sauts à la ligne : {charactersall}
        </p>
        <p className="mt-2 text-green-700 font-medium">
          Nombre de caractères excluant les espaces et les sauts à la ligne : {charactersclean}
        </p>
        </div>
      )}
    </div>
  );
}