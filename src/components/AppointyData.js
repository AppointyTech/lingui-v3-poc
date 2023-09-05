import React from 'react'

import { useLingui } from '@lingui/react'

import { sampleData } from '../data/sampleData'

export default function AppointyData() {
    const { i18n } = useLingui()

    const data = [...sampleData]
    return (
        <>
            {data.map((value, index) => (
                <div key={`${value}-${index}`}>{i18n._(value)}</div>
            ))}
        </>
    )
}
