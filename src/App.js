import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import loadable from '@loadable/component'

import I18nLoader from './context/I18nLoader'
import { ReplaceLocales } from './components/ReplaceLocales'
const Home = loadable(() => import('./components/Home'))
const Page1 = loadable(() => import('./components/Page-1'))
const Page2 = loadable(() => import('./components/Page-2'))
const Page3 = loadable(() => import('./components/Page-3'))
const AppointyData = loadable(() => import('./components/AppointyData'))

function App() {
    const [languageKey, setLanguageKey] = useState('en')
    const changeLanguage = (e) => setLanguageKey(e.target.value)

    return (
        <I18nLoader languageKey={languageKey} defaultLanguage={'en'}>
            <BrowserRouter>
                <header className="bg-slate-100">
                    <nav className="max-w-[1440px] mx-auto px-4">
                        <ul className="flex gap-8 py-4">
                            <li className="hover:underline uppercase">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="hover:underline uppercase">
                                <Link to="page-1">Page 1</Link>
                            </li>
                            <li className="hover:underline uppercase">
                                <Link to="page-2">Page 2</Link>
                            </li>
                            <li className="hover:underline uppercase">
                                <Link to="page-3">Page 3</Link>
                            </li>
                            <li className="hover:underline uppercase">
                                <Link to="appointy-data">Appointy Data</Link>
                            </li>
                            <li className="ml-auto hover:underline uppercase">
                                <Link to="replace-locales">Replace Locales</Link>
                            </li>
                            <li className="hover:underline uppercase">
                                <select value={languageKey} onChange={changeLanguage}>
                                    <option value="en">Default English language</option>
                                    <option value="en-someId">Custom English language</option>
                                    <option value="es">Default Spanish language</option>
                                    <option value="es-someId">Custom Spanish language</option>
                                    <option value="fr">Default French language</option>
                                    <option value="fr-someId">Custom French language</option>
                                    <option value="ar">Default Arabic language</option>
                                    <option value="ar-someId">Custom Arabic language</option>
                                </select>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main className="max-w-[1440px] mx-auto my-8 px-4">
                    <div className="flex flex-col gap-4">
                        <Routes>
                            <Route path="/">
                                <Home />
                            </Route>
                            <Route path="/page-1">
                                <Page1 />
                            </Route>
                            <Route path="/page-2">
                                <Page2 />
                            </Route>
                            <Route path="/page-3">
                                <Page3 />
                            </Route>
                            <Route path="/appointy-data">
                                <AppointyData />
                            </Route>
                            <Route path="/replace-locales">
                                <ReplaceLocales />
                            </Route>
                        </Routes>
                    </div>
                </main>
            </BrowserRouter>
        </I18nLoader>
    )
}

export default App
