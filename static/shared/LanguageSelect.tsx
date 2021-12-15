import React, {ReactElement} from "react";
import Select, {ValueType} from '@atlaskit/select';
import {VALID_LANGUAGES} from "../../types/valid-languages";

interface Props {
    defaultValue?: string | null
    onChange?: (languageCode: string) => unknown
    disabledLanguageCodes?: string[]
}

export function LanguageSelect({onChange, defaultValue, disabledLanguageCodes = []}: Props) {
    return <Select
        options={LANGUAGE_OPTIONS.filter(language => !disabledLanguageCodes.filter(language => defaultValue !== language).includes(language.value))}
        placeholder="Choose a language"
        defaultValue={defaultValue && {value: defaultValue, label: VALID_LANGUAGES[defaultValue]}}
        onChange={change => onChange && onChange((change as { value: string, label: string }).value)}
    />
}

const LANGUAGE_OPTIONS = Object.keys(VALID_LANGUAGES).map(languageCode => ({
    value: languageCode,
    label: VALID_LANGUAGES[languageCode]
}));
