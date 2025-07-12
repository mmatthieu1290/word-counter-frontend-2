import React, { useState, useEffect } from 'react';

const translations = {
  fr: {
    title: 'Compteur de mots',
    placeholder: 'Écris ton texte ici...',
    count: 'Nombre de mots',
    chars_all: 'Nombre de caractères incluant les espaces et les sauts à la ligne',
    chars_clean: 'Nombre de caractères excluant les espaces et les sauts à la ligne',
    loading: 'Analyse en cours…',
    error: 'Erreur lors de l’appel à l’API',
  },
  en: {
    title: 'Word Counter',
    placeholder: 'Type your text here...',
    count: 'Word count',
    chars_all: 'Character count including spaces and line breaks',
    chars_clean: 'Character count excluding spaces and line breaks',
    loading: 'Analyzing...',
    error: 'Error while calling the API',
  },
  es: {
    title: 'Contador de palabras',
    placeholder: 'Escribe tu texto aquí...',
    count: 'Número de palabras',
    chars_all: 'Número de caracteres incluyendo espacios y saltos de línea',
    chars_clean: 'Número de caracteres sin espacios ni saltos de línea',
    loading: 'Analizando...',
    error: 'Error al llamar a la API',
  },
};

export default function WordCounter() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(null);
  const [charactersall, setAllCharacters] = useState(null);
  const [charactersclean, setCleanCharacters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const userLang = navigator.language.slice(0, 2);
    setLang(['fr', 'en', 'es'].includes(userLang) ? userLang : 'en');
  }, []);

  const t = translations[lang];

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
      setError(t.error);
      setWordCount(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <textarea
        className="w-full p-4 border rounded-md shadow-sm"
        rows={6}
        placeholder={t.placeholder}
        value={text}
        onChange={handleChange}
      />
      {loading && <p className="mt-2 text-blue-600">{t.loading}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {wordCount !== null && !loading && (
        <div>
          <p className="mt-2 text-green-700 font-medium">
            {t.count} : {wordCount}
          </p>
          <p className="mt-2 text-green-700 font-medium">
            {t.chars_all} : {charactersall}
          </p>
          <p className="mt-2 text-green-700 font-medium">
            {t.chars_clean} : {charactersclean}
          </p>
        </div>
      )}
    </div>
  );
}