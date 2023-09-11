import { Link } from 'react-router-dom'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Header({ languageKey, changeLanguage }) {
    const { i18n } = useLingui()
    return (
        <header className="bg-slate-100">
            <nav className="max-w-[1440px] mx-auto px-4">
                <ul className="flex gap-8 py-4">
                    <li className="hover:underline uppercase">
                        <Link to="/">{i18n._(t`Home`)}</Link>
                    </li>
                    <li className="hover:underline uppercase">
                        <Link to="page-1">
                            <Trans>Page 1</Trans>
                        </Link>
                    </li>
                    <li className="hover:underline uppercase">
                        <Link to="page-2">
                            <Trans>Page 2</Trans>
                        </Link>
                    </li>
                    <li className="hover:underline uppercase">
                        <Link to="page-3">
                            <Trans>Page 3</Trans>
                        </Link>
                    </li>
                    <li className="hover:underline uppercase">
                        <Link to="appointy-data">
                            <Trans>Appointy Data</Trans>
                        </Link>
                    </li>
                    <li className="ml-auto hover:underline uppercase">
                        <Link to="replace-locales">
                            <Trans>Replace Locales</Trans>
                        </Link>
                    </li>
                    <li className="hover:underline uppercase">
                        <select value={languageKey} onChange={changeLanguage}>
                            <option value="en-EN">Default English language</option>
                            <option value="en-EN/someId">Custom English language</option>
                            <option value="es-ES">Default Spanish language</option>
                            <option value="es-ES/someId">Custom Spanish language</option>
                            <option value="fr-FR">Default French language</option>
                            <option value="fr-FR/someId">Custom French language</option>
                            <option value="ar-AR">Default Arabic language</option>
                            <option value="ar-AR/someId">Custom Arabic language</option>
                        </select>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
