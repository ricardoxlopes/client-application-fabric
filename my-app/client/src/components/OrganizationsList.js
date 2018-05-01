import React from 'react'
import Organization from './Organization'
import { BeatLoader } from 'react-spinners';

const OrganizationsList = ({ orgs, onOrgClick }) => {

    if (orgs.orgsNames) {
        return (orgs.orgsNames.map((orgName, index) => (
            <Organization key={index} onClick={() => onOrgClick(orgs.channels[index])} index={index} name={orgName} />
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