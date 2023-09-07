import { useEffect, useState, createContext, useContext, useRef } from 'react'

import * as Plurals from 'make-plural/plurals'
import { I18nProvider } from '@lingui/react'
import { i18n, setupI18n } from '@lingui/core'
import { remoteLoader } from '@lingui/remote-loader'

export const I18nContext = createContext({
    i18n: setupI18n(),
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
        const isDefaultLanguage = !languageKey.includes('-')
        const locale = languageKey.includes('-') ? languageKey.split('-')[0] : languageKey
        setLoading(true)
        try {
            const languageDefaultCompliedMessage = {
                ...(await import(`../locales/${locale}/messages.js`)).messages,
            }
            selectedLanguageDefaultCompliedMessageRef.current = languageDefaultCompliedMessage
            if (isDefaultLanguage) {
                handleLoad(isDefaultLanguage, languageKey, languageDefaultCompliedMessage)
            } else {
                // console.time('Fetch-data')
                const allMessages = await fetch('http://localhost:3000/posts').then((res) =>
                    res.json()
                )
                // console.timeEnd('Fetch-data')
                const messages = allMessages[languageKey]
                handleLoad(isDefaultLanguage, locale, messages)
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLoad = (isComplied, locale, messages) => {
        let catalog = {}
        if (isComplied) {
            catalog = messages
        } else {
            console.time('Remote-loader-compile-time')
            if (messages) {
                const compliedMessages = remoteLoader({
                    messages,
                })
                catalog = {
                    ...selectedLanguageDefaultCompliedMessageRef.current,
                    ...compliedMessages,
                }
            } else {
                catalog = selectedLanguageDefaultCompliedMessageRef.current
            }
            console.timeEnd('Remote-loader-compile-time')
        }
        console.log({ catalog })
        console.time('Lingui-load')
        i18n.loadLocaleData(locale, { plurals: Plurals[locale] })
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
