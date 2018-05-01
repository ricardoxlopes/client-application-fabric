import React from 'react'
import Record from './Record'
import { BeatLoader } from 'react-spinners';

const RecordsList = ({ records, onRecordClick }) => {

    if (records.records) {
        return (
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Record</th>
                        <th>Source</th>
                        <th>Sharing</th>
                    </tr>
                </thead>
                <tbody>
                    {records.records.map((record, index) => (
                        <Record key={index} onClick={onRecordClick} index={index} record={record} selectedChannel={records.selectedChannel} channels={records.channels} orgsNames={records.orgsNames} />
                    ))}
                </tbody>
            </table>
        )
    }
    else return (
        <BeatLoader
            color={'#123abc'}
            loading={records.isFetching}
        />
    )
}

export default RecordsList