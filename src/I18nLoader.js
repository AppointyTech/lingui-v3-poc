import { useEffect, useState, createContext, useContext } from 'react'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import * as Plurals from 'make-plural/plurals'
import { isEmpty, omit } from 'lodash'
import { remoteLoader } from '@lingui/remote-loader'

export const I18nContext = createContext({
    handleLoad: undefined,
    languageKey: 'en',
    defaultMessages: {},
})

export function useI18n() {
    return useContext(I18nContext)
}
// i18n.loadLocaleData('en', { plurals: Plurals['en'] })
// i18n.load('en', {})
// i18n.activate('en')

export default function I18nLoader({ children, languageKey }) {
    const [loading, setLoading] = useState(false)
    const [defaultMessages, setDefaultMessages] = useState({})

    useEffect(() => {
        if (languageKey !== undefined) {
            dynamicActivate(languageKey)
        }
    }, [languageKey])

    useEffect(() => {
        const allMessages = {}
        Array.from(['ar', 'en', 'es', 'fr']).forEach(async (key) => {
            if (!allMessages[key]) {
                try {
                    const messages = await import(`./locales/${key}/messages.json`)
                    allMessages[key] = { ...omit(messages, 'default') }
                    if (isEmpty(defaultMessages) && !isEmpty(allMessages['en'])) {
                        setDefaultMessages(allMessages['en'])
                    }
                    if (Object.keys(allMessages).length === 4) {
                        postMessages(allMessages)
                    }
                } catch (error) {
                    console.error('Error:', error)
                }
            }
        })
    }, [])

    const postMessages = (allMessages) => {
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allMessages),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('POST Request Response:-1', data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    const dynamicActivate = async (languageKey) => {
        const locale = languageKey.includes('-') ? languageKey.split('-')[0] : languageKey
        setLoading(true)
        try {
            const allMessages = await fetch('http://localhost:3000/posts').then((res) => res.json())
            const messages = allMessages[languageKey]
            if (messages !== undefined) {
                handleLoad(locale, messages)
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLoad = (locale, messages) => {
        const catalog = remoteLoader({ messages, fallbackMessages: defaultMessages })
        i18n.loadLocaleData(locale, { plurals: Plurals[locale] })
        i18n.load(locale, catalog)
        i18n.activate(locale)
    }

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                loading...
            </div>
        )
    }
    return (
        <I18nContext.Provider value={{ languageKey, handleLoad, defaultMessages }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </I18nContext.Provider>
    )
}
