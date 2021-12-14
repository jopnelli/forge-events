import React, {ReactElement} from "react";
import Select, {ValueType} from '@atlaskit/select';
import {VALID_LANGUAGES} from "../../types/valid-languages";

interface Props {
    defaultValue?: string
    onChange?: (languageCode: string) => unknown
}

export function LanguageSelect({onChange, defaultValue}: Props) {
    return <Select
        options={LANGUAGE_OPTIONS}
        placeholder="Choose a language"
        defaultValue={defaultValue && {value: defaultValue, label: VALID_LANGUAGES[defaultValue]}}
        onChange={change => onChange && onChange((change as { value: string, label: string }).value)}
    />
}

const LANGUAGE_OPTIONS = Object.keys(VALID_LANGUAGES).map(languageCode => ({
    value: languageCode,
    label: VALID_LANGUAGES[languageCode]
}));
