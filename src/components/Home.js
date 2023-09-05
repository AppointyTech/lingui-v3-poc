import React, { useState } from 'react'

import { Trans, Plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Home() {
    const [count, setCount] = useState(1)
    const { i18n } = useLingui()

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
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
                {i18n._(t`It was popularised in the 1960s with the release of Letraset sheets containing
                    Lorem Ipsum passages, and more recently with desktop publishing software like
                    Aldus PageMaker including versions of Lorem Ipsum.`)}
            </div>
            <div className="flex items-center gap-8">
                <Plural
                    value={count}
                    zero="There're no messages"
                    one="There's # message in your inbox"
                    other="There're # messages in your inbox"
                />
                <div>
                    <button
                        className="px-4 py-1 border border-slate-500 rounded-lg hover:opacity-70"
                        onClick={handleDecrement}
                    >
                        -
                    </button>{' '}
                    <Trans>Count- {count}</Trans>{' '}
                    <button
                        className="px-4 py-1 border border-slate-500 rounded-lg hover:opacity-70"
                        onClick={handleIncrement}
                    >
                        +
                    </button>
                </div>
            </div>
        </>
    )
}
