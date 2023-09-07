import React, { useState, useEffect, useRef } from 'react'

import { remoteLoader } from '@lingui/remote-loader'
import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { omitBy, omit, pickBy } from 'lodash'

import { useI18n } from '../context/I18nLoader'

export function ReplaceLocales() {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState()
    const [formData, setFormData] = useState()
    const selectedLanguageDefaultMessagesRef = useRef({})
    const { handleLoad, languageKey } = useI18n()
    const { i18n } = useLingui()
    const isDefaultLanguage = !languageKey.includes('-')

    useEffect(() => {
        if (!isDefaultLanguage) {
            const locale = languageKey.split('-')[0]
            setLoading(true)
            ;(async () => {
                try {
                    selectedLanguageDefaultMessagesRef.current = omit(
                        {
                            ...(await import(`../locales/${locale}/messages.json`)),
                        },
                        'default'
                    )
                    const data = await fetch('http://localhost:3000/posts').then((res) =>
                        res.json()
                    )
                    const messages = {
                        ...selectedLanguageDefaultMessagesRef.current,
                        ...data[languageKey]?.messages,
                    }
                    setMessages(messages)
                    setFormData(messages)
                } catch (error) {
                    console.error('Error:', error)
                } finally {
                    setLoading(false)
                }
            })()
        }
    }, [languageKey])

    const handleInputChange = (key) => (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: e.target.value,
        }))
    }

    const handleAddCustomLanguage = () => {
        if (!isDefaultLanguage) {
            fetch('http://localhost:3000/posts')
                .then((res) => res.json())
                .then((data) => {
                    const messages = pickBy(
                        omitBy(formData, (value) => !value),
                        (value, key) => selectedLanguageDefaultMessagesRef.current[key] !== value
                    )

                    console.time('Remote-loader-compile-time')
                    const compliedMessages = remoteLoader({ messages })
                    console.timeEnd('Remote-loader-compile-time')

                    const modifiedData = {
                        ...data,
                        [languageKey]: {
                            messages,
                            compliedMessages,
                        },
                    }
                    fetch('http://localhost:3000/posts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(modifiedData),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log('POST Request Response:', data)
                            const locale = languageKey.split('-')[0]
                            const compliedMessages = data[languageKey].compliedMessages
                            handleLoad(isDefaultLanguage, locale, compliedMessages)
                        })
                        .catch((error) => {
                            console.error('Error:', error)
                        })
                })
                .catch((error) => {
                    console.error('Error:', error)
                })
        }
    }

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">loading...</div>
    }

    return (
        <>
            {isDefaultLanguage ? (
                <p className="text-center">
                    <Trans>Default Language is not editable</Trans>
                </p>
            ) : (
                <>
                    <button
                        className="border border-slate-400 rounded-lg px-2 py-1 mx-auto"
                        onClick={handleAddCustomLanguage}
                    >
                        {i18n._(t`Add custom translation`)}
                    </button>
                    <div className="my-2">
                        <h2 className="flex justify-center font-bold">Edit Value</h2>
                        <ul className="flex flex-col gap-8">
                            {messages &&
                                Object.keys(messages)?.map((key) => (
                                    <li
                                        key={key}
                                        style={{ display: 'flex', justifyContent: 'space-between' }}
                                        className="border border-gray-500 p-2 flex items-center"
                                    >
                                        <label htmlFor={`form-${key}`}>{key}</label>
                                        <input
                                            id={`form-${key}`}
                                            type="text"
                                            value={formData?.[key]}
                                            onChange={handleInputChange(key)}
                                            className="border border-blue-700 p-1"
                                        />
                                    </li>
                                ))}
                        </ul>
                    </div>
                </>
            )}
        </>
    )
}
