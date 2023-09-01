import React, { useState } from 'react'
import I18nLoader from './I18nLoader'
import Main from './main'

function App() {
    const [languageKey, setLanguageKey] = useState('en')
    const handleSelect = (e) => setLanguageKey(e.target.value)

    return (
        <I18nLoader languageKey={languageKey}>
            <div
                style={{
                    maxWidth: '1024px',
                    margin: '2rem auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <div style={{ display: 'flex', gap: '4rem' }}>
                    <select value={languageKey} onChange={handleSelect}>
                        <option value="en">Default English language</option>
                        <option value="en-someId">Custom English language</option>
                        <option value="es">Default Spanish language</option>
                        <option value="es-someId">Custom Spanish language</option>
                        <option value="fr">Default French language</option>
                        <option value="fr-someId">Custom French language</option>
                        <option value="ar">Default Arabic language</option>
                        <option value="ar-someId">Custom Arabic language</option>
                        {/* <option value="az">Default Az language</option>
                        <option value="az-someId">Custom Az language</option> */}
                    </select>
                </div>
                <Main />
            </div>
        </I18nLoader>
    )
}

export default App
