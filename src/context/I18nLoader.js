import { useEffect, useState, createContext, useContext, useRef } from 'react'

import * as Plurals from 'make-plural/plurals'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'

export const I18nContext = createContext({
    i18n: undefined,
    handleLoad: undefined,
    languageKey: 'en',
})

export function useI18n() {
    return useContext(I18nContext)
}

// i18n.loadLocaleData('en', { plurals: Plurals['en'] })
// i18n.load('en', {})
// i18n.activate('en')

export default function I18nLoader({ children, languageKey }) {
    const [loading, setLoading] = useState(false)
    const selectedLanguageDefaultCompliedMessageRef = useRef({})

    useEffect(() => {
        if (languageKey !== undefined) {
            dynamicActivate(languageKey)
        }
    }, [languageKey])

    const dynamicActivate = async (languageKey) => {
        const isDefaultLanguage = !languageKey.includes('/')
        const locale = languageKey.includes('/') ? languageKey.split('/')[0] : languageKey
        setLoading(true)
        try {
            selectedLanguageDefaultCompliedMessageRef.current = {
                ...(await import(`../locales/${locale}/messages.js`)).messages,
            }
            if (isDefaultLanguage) {
                handleLoad(languageKey)
            } else {
                const allMessages = await fetch('http://localhost:8000/posts').then((res) =>
                    res.json()
                )
                const compliedMessages = allMessages[languageKey]?.compliedMessages
                handleLoad(locale, compliedMessages)
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLoad = (locale, compliedMessages) => {
        let catalog = {}
        if (compliedMessages !== undefined) {
            catalog = {
                ...selectedLanguageDefaultCompliedMessageRef.current,
                ...compliedMessages,
            }
        } else {
            catalog = selectedLanguageDefaultCompliedMessageRef.current
        }
        console.log({ catalog })
        console.time('Lingui-load')
        i18n.loadLocaleData(locale, { plurals: Plurals[locale.split('-')[0]] })
        i18n.load(locale, catalog)
        i18n.activate(locale)
        console.timeEnd('Lingui-load')
    }
    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">loading...</div>
    }
    return (
        <I18nContext.Provider
            value={{
                i18n,
                languageKey,
                handleLoad,
            }}
        >
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </I18nContext.Provider>
    )
}
