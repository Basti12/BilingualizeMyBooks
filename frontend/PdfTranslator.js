import React, { useState } from 'react';

const PdfTranslator = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSourceLanguageChange = (event) => {
    setSourceLanguage(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('sourceLanguage', sourceLanguage);
    formData.append('targetLanguage', targetLanguage);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('An error occurred while translating the PDF');
      }

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="pdf-file">Upload PDF file:</label>
          <input type="file" id="pdf-file" onChange={handleFileUpload} />
        </div>
        <div>
          <label htmlFor="source-language">Source language:</label>
          <input
            type="text"
            id="source-language"
            value={sourceLanguage}
            onChange={handleSourceLanguageChange}
          />
        </div>
        <div>
          <label htmlFor="target-language">Target language:</label>
          <input
            type="text"
            id="target-language"
            value={targetLanguage}
            onChange={handleTargetLanguageChange}
          />
        </div>
        <div>
          <button type="submit">Translate</button>
        </div>
      </form>
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default PdfTranslator;
