import React, { useEffect, useState } from 'react'
import { useI18n } from './I18nLoader'
import { Trans, Plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Main() {
    const [messages, setMessages] = useState()
    const [formData, setFormData] = useState()
    const [count, setCount] = useState(1)
    const { languageKey, handleLoad, defaultMessages } = useI18n()
    const { i18n } = useLingui()

    useEffect(() => {
        fetch('http://localhost:3000/posts')
            .then((res) => res.json())
            .then((data) => {
                const messages = data[languageKey]
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

    const handleIncrement = () => setCount((prevCount) => prevCount + 1)
    const handleDecrement = () => setCount((prevCount) => prevCount - 1)

    return (
        <>
            <div>
                <Trans>
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                </Trans>
            </div>
            <div>
                <Trans>
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type
                    specimen book.
                </Trans>
            </div>
            <div>
                <Trans>
                    It has survived not only five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged.
                </Trans>
            </div>
            <div>
                <Trans>
                    It was popularised in the 1960s with the release of Letraset sheets containing
                    Lorem Ipsum passages, and more recently with desktop publishing software like
                    Aldus PageMaker including versions of Lorem Ipsum.
                </Trans>
            </div>
            <div></div>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Plural
                    value={count}
                    zero="There're no messages"
                    one="There's # message in your inbox"
                    other="There're # messages in your inbox"
                />
                <div>
                    <button onClick={handleDecrement}>-</button> <Trans>Count- {count}</Trans>{' '}
                    <button onClick={handleIncrement}>+</button>
                </div>
            </div>
            <button onClick={handleAdd}>
                {languageKey.includes('-')
                    ? i18n._(t`Change translation`)
                    : i18n._(t`Add custom translation`)}
            </button>
            <div>
                <h2>Edit Value</h2>
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
                            >
                                <span>{key}</span>
                                <input
                                    type="text"
                                    value={formData?.[key]}
                                    onChange={handleInputChange(key)}
                                />
                            </li>
                        ))}
                </ul>
            </div>
        </>
    )
}
