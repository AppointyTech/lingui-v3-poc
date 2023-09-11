import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import loadable from '@loadable/component'

import I18nLoader from './context/I18nLoader'
const Header = loadable(() => import('./components/Header'))
const Home = loadable(() => import('./components/Home'))
const Page1 = loadable(() => import('./components/Page-1'))
const Page2 = loadable(() => import('./components/Page-2'))
const Page3 = loadable(() => import('./components/Page-3'))
const AppointyData = loadable(() => import('./components/AppointyData'))
const ReplaceLocales = loadable(() => import('./components/ReplaceLocales'))

function App() {
    const [languageKey, setLanguageKey] = useState('en-EN')
    const changeLanguage = (e) => setLanguageKey(e.target.value)

    return (
        <I18nLoader languageKey={languageKey}>
            <BrowserRouter>
                <Header languageKey={languageKey} changeLanguage={changeLanguage} />
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
