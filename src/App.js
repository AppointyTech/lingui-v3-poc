import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import I18nLoader from './context/I18nLoader'
import { ReplaceLocales } from './components/ReplaceLocales'
import loadable from '@loadable/component'
const Home = loadable(() => import('./components/Home'))
const Page1 = loadable(() => import('./components/Page-1'))
const Page2 = loadable(() => import('./components/Page-2'))
const Page3 = loadable(() => import('./components/Page-3'))

function App() {
    return (
        <I18nLoader languageKey={'en'}>
            <BrowserRouter>
                <header className="bg-slate-100">
                    <nav className="max-w-[1024px] mx-auto">
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
                            <li className="ml-auto hover:underline uppercase">
                                <Link to="replace-locales">Replace Locales</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main className="max-w-[1024px] mx-auto my-8">
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
