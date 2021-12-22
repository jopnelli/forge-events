import React, {ReactElement} from 'react';
import {requestConfluence} from '@forge/bridge';
import {AsyncSelect} from '@atlaskit/select';
import styled from 'styled-components';
import {useAsync} from 'react-use';
import {SkeletonItem} from '@atlaskit/menu';
import LockIcon from '@atlaskit/icon/glyph/lock';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import {CqlSearchResult, PageFromContentAPI} from '../../types/atlassian-types';

interface Props {
    disabledPageIds?: string[],
    defaultValuePageId?: string,
    onChange?: (pageId: string) => unknown,
    disabled?: boolean
}

/**
 * Searchable singleSelect for confluence pages
 *
 * @param disabledPageIds
 * pageIds to be filter out of the cql search
 * @param defaultValuePageId
 * defaultValue for pre-selected page
 * @param onChange
 * callback to be invoked with newly created pageId
 * @param disabled
 */
export function PageSelect({disabledPageIds = [], defaultValuePageId, onChange, disabled}: Props) {
  const preselectedPage = useAsync(async () => {
    if (!defaultValuePageId) {
      return null;
    }
    const response = await requestConfluence(`/rest/api/content/` + defaultValuePageId);
    console.log(response.status);
    if (!response.ok) {
      if (response.status === 403) {
        return {
          label: <PageSelectLabel title={'Locked page'} locked subtitle={defaultValuePageId} disabled={disabled}/>,
          value: defaultValuePageId,
        };
      }
      return {
        label: <PageSelectLabel title={'Unknown page'} unknown subtitle={defaultValuePageId} disabled={disabled}/>,
        value: defaultValuePageId,
      };
    }
    const page = await response.json() as PageFromContentAPI;
    return {
      label: <PageSelectLabel title={page.title} subtitle={page.space.name} disabled={disabled}/>,
      value: defaultValuePageId,
    };
  }, [defaultValuePageId]);
  const search = async (searchTerm: string) => {
    const response = await requestConfluence(`/rest/api/search?cql=title~"${searchTerm}"`);
    if (!response.ok) {
      return [];
    }
    const searchResult = await response.json() as CqlSearchResult;
    return searchResult.results
        .filter((result) => !disabledPageIds.includes(result.content.id))
        .map((result) => {
          return {
            label: <PageSelectLabel title={result.content.title}
              subtitle={result.resultGlobalContainer.title}
              disabled={disabled}
            />,
            value: result.content.id,
          };
        });
  };

  if (defaultValuePageId && preselectedPage.loading) {
    return <AsyncSelect
      key="disabled-page-select"
      placeholder={<SkeletonItem isShimmering cssFn={(css) => ({padding: 0, width: '250px'})}/>}
      isLoading
      isDisabled
      spacing="compact"
    />;
  }

  return <AsyncSelect
    isLoading={preselectedPage.loading}
    isDisabled={preselectedPage.loading || disabled}
    loadOptions={search}
    defaultValue={defaultValuePageId && preselectedPage.value}
    defaultOptions
    onChange={(change) => onChange && onChange((change as { value: string, label: ReactElement }).value)}
    inputId="page-select"
    spacing="compact"
    placeholder="Select a page..."
  />;
}

const PageSelectLabel = styled(({
  title,
  subtitle,
  className,
  locked,
  unknown,
}: { title: string, subtitle: string, className?: string, locked?: boolean, unknown?: boolean, disabled?: boolean }) => (
  <span className={className}>
    <span className="title">
      {locked && <LockIcon label="lock-icon" size="medium"/>}
      {unknown && <QuestionIcon label="question-icon" size="medium"/>}
      {title} <span className="subtitle">{subtitle}</span>
    </span>
  </span>
))`
      .title {
        display: flex;
        align-items: center;

        [aria-label="lock-icon"] {
          padding-right: 0.25rem;
        }
      }

      .subtitle {
        color: ${(props) => !props.disabled ? 'rgb(107, 119, 140);' : 'unset'}
        padding-left: 0.25rem;
      }
    `;
