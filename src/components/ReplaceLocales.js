import React, { useState, useEffect } from 'react'

import { remoteLoader } from '@lingui/remote-loader'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

import { useI18n } from '../context/I18nLoader'

export function ReplaceLocales() {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState()
    const [formData, setFormData] = useState()
    const [isDeveloper, setIsDeveloper] = useState(false)
    const { handleLoad, defaultMessages, languageKey } = useI18n()
    const { i18n } = useLingui()

    useEffect(() => {
        setLoading(true)
        fetch('http://localhost:3000/posts')
            .then((res) => res.json())
            .then((data) => {
                const messages = { ...data['template'], ...data[languageKey] }
                setMessages(messages)
                setFormData(messages)
            })
            .catch((error) => {
                setMessages(defaultMessages)
                setFormData(defaultMessages)
                console.error('Error:', error)
            })
            .finally(() => setLoading(false))
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

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">loading...</div>
    }

    return (
        <>
            <div className="flex justify-center items-center gap-4">
                <label htmlFor="is-developer-checkbox">Are you a developer</label>
                <input
                    className="hover:cursor-pointer"
                    id="is-developer-checkbox"
                    type="checkbox"
                    value={isDeveloper}
                    onChange={() => setIsDeveloper((prev) => !prev)}
                />
            </div>
            <button
                className="border border-slate-400 rounded-lg px-2 py-1 mx-auto"
                onClick={handleAdd}
            >
                {languageKey.includes('-')
                    ? i18n._(t`Change custom translation`)
                    : isDeveloper
                    ? i18n._(t`Change default translation`)
                    : i18n._(t`Add custom translation`)}
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
