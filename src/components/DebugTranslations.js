import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const DebugTranslations = () => {
  const { translations, language } = useLanguage();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>Debug Info</h4>
      <p><strong>Language:</strong> {language}</p>
      <p><strong>Translations loaded:</strong> {Object.keys(translations).length > 0 ? 'Yes' : 'No'}</p>
      <p><strong>Available keys:</strong> {Object.keys(translations).join(', ')}</p>
      <p><strong>Gallery2024 exists:</strong> {translations.gallery2024 ? 'Yes' : 'No'}</p>
      {translations.gallery2024 && (
        <p><strong>2024 Paintings count:</strong> {translations.gallery2024.paintings?.length || 0}</p>
      )}
    </div>
  );
};

export default DebugTranslations;


