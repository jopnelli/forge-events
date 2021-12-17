import React, {ReactElement} from "react";
import Select, {AsyncSelect, ValueType} from '@atlaskit/select';
import {VALID_LANGUAGES} from "../../types/valid-languages";
import {SkeletonItem} from "@atlaskit/menu";

interface Props {
    defaultValue?: string | null
    onChange?: (languageCode: string) => unknown
    disabledLanguageCodes?: string[]
    disabled?: boolean
    busy?: boolean
}

export function LanguageSelect({onChange, defaultValue, disabled, disabledLanguageCodes = [], busy}: Props) {
    if (busy) {
        return <>
            <Select
                key="disabled-page-select"
                placeholder={<SkeletonItem isShimmering cssFn={css => ({padding: 0, width: "70px"})}/>}
                isLoading
                isDisabled
                spacing="compact"
            />
        </>
    }
    return <Select
        options={LANGUAGE_OPTIONS.filter(language => !disabledLanguageCodes.filter(language => defaultValue !== language).includes(language.value))}
        placeholder="Language..."
        spacing="compact"
        isDisabled={disabled}
        defaultValue={defaultValue && {value: defaultValue, label: VALID_LANGUAGES[defaultValue]}}
        onChange={change => onChange && onChange((change as { value: string, label: string }).value)}
    />
}

const LANGUAGE_OPTIONS = Object.keys(VALID_LANGUAGES).map(languageCode => ({
    value: languageCode,
    label: VALID_LANGUAGES[languageCode]
}));
