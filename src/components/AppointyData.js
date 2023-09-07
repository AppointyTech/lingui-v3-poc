import React from 'react'

import { sampleData } from '../data/sampleData'
import { useI18n } from '../context/I18nLoader'

export default function AppointyData() {
    const { i18n } = useI18n()

    const data = [...sampleData]
    return (
        <>
            {/* {data.map((value, index) => (
                <div key={`${value}-${index}`}>{i18n._(value)}</div>
            ))} */}
        </>
    )
}
