import React, {useMemo, useState} from "react";
import {useAsync} from "react-use";
import {requestConfluence} from "@forge/bridge";
import {SkeletonItem} from "@atlaskit/menu";
import Avatar, {AvatarItem, Skeleton} from "@atlaskit/avatar";
import styled from "styled-components";

interface Props {
    accountId: string
}

/**
 * takes an accountId to fetch further userInformation via confluence rest api, displays name and avatar.
 * @param accountId
 */
export function AsyncUser({accountId}: Props) {
    const state = useAsync(async () => {
        const response = await requestConfluence("/rest/api/user?accountId=" + accountId);
        if (!response.ok) {
            throw new Error("Request to Confluence API failed.");
        }
        return await response.json() as AtlassianUser;
    }, []);

    const avatarUrl = useMemo(() => {
        if (!state.value) {
            return "";
        }
        return state.value?._links.base.replace("/wiki", "") + state.value?.profilePicture.path
    }, [state.value])

    if (state.error) {
        return <span>Error occurred while fetching user.</span>
    }

    if (state.loading || !state.value) {
        return (
            <NoBorder>
                <SkeletonWrapper>
                    <AvatarSkeleton>
                        <NoBorder>
                            <Skeleton appearance="circle" size="small"/>
                        </NoBorder>
                    </AvatarSkeleton>
                    <SkeletonItemWrapper>
                        <SkeletonItem isShimmering
                                      width="150px"
                                      cssFn={css => ({"border-radius": "0", "padding": "0 0 0 0.5rem"})}/>
                    </SkeletonItemWrapper>
                </SkeletonWrapper>
            </NoBorder>
        )
    }

    return <div>
        <AvatarItemWrapper>
            <AvatarItem
                avatar={!!avatarUrl && <Avatar size="small" src={avatarUrl}/>}
                primaryText={state.value.displayName}
            />
        </AvatarItemWrapper>
    </div>
}

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SkeletonItemWrapper = styled.div`
  width: 180px;
`

const AvatarSkeleton = styled.div`
  height: 24px;
`

const NoBorder = styled.div`
  > * {
    border: none !important;
  }
`;

const AvatarItemWrapper = styled.div`
  padding-top: 6px;
  padding-bottom: 6px;
  > * {
    padding: 0 !important;
    border: 0 !important;;
  }
`;

export interface AtlassianUser {
    type: string;
    accountId: string;
    accountType: string;
    email: string;
    publicName: string;
    profilePicture: ProfilePicture;
    displayName: string;
    isExternalCollaborator: boolean;
    _expandable: Expandable;
    _links: Links;
}

export interface Expandable {
    operations: string;
    personalSpace: string;
}

export interface Links {
    self: string;
    base: string;
    context: string;
}

export interface ProfilePicture {
    path: string;
    width: number;
    height: number;
    isDefault: boolean;
}
