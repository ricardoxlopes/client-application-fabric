import React from 'react'
import { SplitButton, MenuItem } from 'react-bootstrap';

const Record = ({ onClick, record, channels, index, selectedChannel,orgsNames }) => {

    return (<tr key={index}>
        <td style={{ 'verticalAlign': 'middle' }} >{index + 1}</td>
        <td style={{ 'verticalAlign': 'middle' }} >{JSON.stringify(record["Record"])}</td>
        <td style={{ 'verticalAlign': 'middle' }} >{index + 1}</td>
        <td style={{ 'verticalAlign': 'middle' }} >
            <SplitButton
                bsStyle="default"
                title="Share with"
                key={index}
                id={`split-button-basic-${index}`}
                pullRight
                dropup
            >
                {channels.map((channel, index) => {
                    if (channel !== selectedChannel)
                        return (
                            <MenuItem key={index} onSelect={() => onClick({record},channels[index])}>{orgsNames[index]}</MenuItem>
                        )})
                }
            </SplitButton>
        </td>
    </tr>
    )
}

export default Record

