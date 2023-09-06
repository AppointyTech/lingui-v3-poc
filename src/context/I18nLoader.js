import { useEffect, useState, createContext, useContext } from 'react'

import * as Plurals from 'make-plural/plurals'
import { I18nProvider } from '@lingui/react'
import { i18n, setupI18n } from '@lingui/core'
import { remoteLoader } from '@lingui/remote-loader'
import { isEmpty, omit, omitBy, transform } from 'lodash'
import { languages } from '../utils/utils'

export const I18nContext = createContext({
    i18n: setupI18n(),
    handleLoad: undefined,
    languageKey: 'en',
    defaultMessages: {},
    defaultLanguage: 'en',
})

export function useI18n() {
    return useContext(I18nContext)
}

// i18n.loadLocaleData('en', { plurals: Plurals['en'] })
// i18n.load('en', {})
// i18n.activate('en')

export default function I18nLoader({ children, languageKey, defaultLanguage }) {
    const [loading, setLoading] = useState(false)
    const [defaultMessages, setDefaultMessages] = useState({})

    useEffect(() => {
        const allMessages = {}
        languages.forEach(async (key) => {
            if (!allMessages[key]) {
                try {
                    const messages = await import(`../locales/${key}/messages.json`)
                    allMessages[key] = {
                        ...omit(
                            omitBy(messages, (v) => !v),
                            'default'
                        ),
                    }
                    if (isEmpty(defaultMessages) && !isEmpty(allMessages[defaultLanguage])) {
                        setDefaultMessages(allMessages[defaultLanguage])
                        allMessages['template'] = transform(
                            allMessages[defaultLanguage],
                            (result, value, key) => (result[key] = '')
                        )
                    }
                    if (Object.keys(allMessages).length === languages.length + 1) {
                        postMessages(allMessages)
                    }
                } catch (error) {
                    console.error('Error:', error)
                }
            }
        })
    }, [])

    useEffect(() => {
        if (languageKey !== undefined) {
            dynamicActivate(languageKey)
        }
    }, [languageKey])

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
            console.time('Fetch-data')
            const allMessages = await fetch('http://localhost:3000/posts').then((res) => res.json())
            console.timeEnd('Fetch-data')
            const messages = allMessages[languageKey]
            handleLoad(locale, messages, allMessages[locale])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLoad = (locale, messages = defaultMessages, fallbackMessages = defaultMessages) => {
        console.time('Remote-loader-compile-time')
        const catalog = remoteLoader({
            messages,
            fallbackMessages: fallbackMessages,
        })
        console.timeEnd('Remote-loader-compile-time')
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
        <I18nContext.Provider value={{ i18n, languageKey, handleLoad, defaultMessages }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </I18nContext.Provider>
    )
}
