import React, { useState, useEffect } from 'react'

import { remoteLoader } from '@lingui/remote-loader'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

import { useI18n } from '../context/I18nLoader'

export function ReplaceLocales() {
    const [messages, setMessages] = useState()
    const [formData, setFormData] = useState()
    const { handleLoad, defaultMessages, languageKey, changeLanguage } = useI18n()
    const { i18n } = useLingui()

    useEffect(() => {
        fetch('http://localhost:3000/posts')
            .then((res) => res.json())
            .then((data) => {
                const defaultTemplate = data['template']
                const messages = { ...defaultTemplate, ...data[languageKey] }
                setMessages(messages)
                setFormData(messages)
            })
            .catch((error) => {
                setMessages(defaultMessages)
                setFormData(defaultMessages)
                console.error('Error:', error)
            })
    }, [languageKey])

    const handleInputChange = (key) => (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: e.target.value,
        }))
    }

    const handleAdd = () => {
        fetch('http://localhost:3000/posts')
            .then((res) => res.json())
            .then((data) => {
                const modifiedData = {
                    ...data,
                    [languageKey.includes('-') ? languageKey : `${languageKey}-someId`]: {
                        ...formData,
                    },
                }
                remoteLoader({ messages: formData })
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
                        const locale = languageKey.includes('-')
                            ? languageKey.split('-')[0]
                            : languageKey
                        handleLoad(locale, data[languageKey], data[locale])
                    })
                    .catch((error) => {
                        console.error('Error:', error)
                    })
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    return (
        <>
            <div className="mb-4">
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
            </div>
            <button
                className="border border-slate-400 rounded-lg px-2 py-1 mx-auto"
                onClick={handleAdd}
            >
                {languageKey.includes('-')
                    ? i18n._(t`Change translation`)
                    : i18n._(t`Add custom translation`)}
            </button>
            <div className="my-2">
                <h2 className="flex justify-center font-bold">Edit Value</h2>
                <ul
                    style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        padding: 0,
                    }}
                >
                    {messages &&
                        Object.keys(messages)?.map((key) => (
                            <li
                                key={key}
                                style={{ display: 'flex', justifyContent: 'space-between' }}
                                className="border border-gray-500 p-2 flex items-center"
                            >
                                <span>{key}</span>
                                <input
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
    )
}
