import { useEffect, useState, createContext, useContext } from 'react'

import * as Plurals from 'make-plural/plurals'
import { I18nProvider } from '@lingui/react'
import { i18n, setupI18n } from '@lingui/core'
import { remoteLoader } from '@lingui/remote-loader'
import { omit } from 'lodash'

export const I18nContext = createContext({
    i18n: setupI18n(),
    handleLoad: undefined,
    languageKey: 'en',
    selectedLanguageDefaultJsonMessages: {},
})

export function useI18n() {
    return useContext(I18nContext)
}

// i18n.loadLocaleData('en', { plurals: Plurals['en'] })
// i18n.load('en', {})
// i18n.activate('en')

export default function I18nLoader({ children, languageKey }) {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState({
        selectedLanguageDefaultJsonMessages: {},
        fallbackJsonMessages: {},
    })

    useEffect(() => {
        ;(async () => {
            try {
                const fallbackJsonMessages = omit(
                    {
                        ...(await import(`../locales/en/messages.json`)),
                    },
                    'default'
                )
                setMessages((prevState) => ({
                    ...prevState,
                    fallbackJsonMessages,
                }))
            } catch (error) {
                console.error('Error:', error)
            }
        })()
    }, [])

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
            const selectedLanguageDefaultCompliedMessage = {
                ...(await import(`../locales/${locale}/messages.js`)).messages,
            }
            const selectedLanguageDefaultJsonMessages = omit(
                {
                    ...(await import(`../locales/${locale}/messages.json`)),
                },
                'default'
            )
            console.log({
                selectedLanguageDefaultCompliedMessage,
                selectedLanguageDefaultJsonMessages,
            })
            setMessages((prevState) => ({
                ...prevState,
                selectedLanguageDefaultJsonMessages,
            }))
            if (isDefaultLanguage) {
                handleLoad(isDefaultLanguage, languageKey, selectedLanguageDefaultCompliedMessage)
                setLoading(false)
            } else {
                // console.time('Fetch-data')
                const allMessages = await fetch('http://localhost:3000/posts').then((res) =>
                    res.json()
                )
                // console.timeEnd('Fetch-data')
                console.log({ allMessages })
                const messages = allMessages[languageKey]
                handleLoad(isDefaultLanguage, locale, messages)
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLoad = (isComplied, locale, _messages) => {
        let catalog = {}
        if (isComplied) {
            catalog = _messages
        } else {
            console.time('Remote-loader-compile-time')
            catalog = remoteLoader({
                messages: {
                    ...messages.selectedLanguageDefaultJsonMessages,
                    ..._messages,
                },
                fallbackMessages: messages.fallbackJsonMessages,
            })
            console.timeEnd('Remote-loader-compile-time')
        }
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
                selectedLanguageDefaultJsonMessages: messages.selectedLanguageDefaultJsonMessages,
            }}
        >
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </I18nContext.Provider>
    )
}
