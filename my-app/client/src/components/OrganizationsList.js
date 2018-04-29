import React from 'react'
import Organization from './Organization'
import { BeatLoader } from 'react-spinners';

const OrganizationsList = ({ orgs, onOrgClick }) => {

    if (orgs.orgs) {
        return (orgs.orgs.map((org, index) => (
            <Organization key={index} onClick={() => onOrgClick(orgs.channels[index])} index={index} data={JSON.parse(org)} />
        ))
        )
    }
    else return (
        <BeatLoader
            color={'#123abc'}
            loading={orgs.isFetching}
        />
    )
}

export default OrganizationsList