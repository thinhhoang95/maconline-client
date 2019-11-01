import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import moment from 'moment';

import { host } from '../Host';

import ModeratorRow from './ModeratorRow';

class Moderator extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {lastUpdated: new Date(), data: null}
    }

    async componentDidMount()
    {
        await this.refreshData();
        
    }
    
    async refreshData()
    {
        let response = await fetch(host + '/',
        {
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200)
        {
            throw new Error('Cannot get team data from server! Press Refresh to try again!');
        }
        let jResp = await response.json();
        await this.setState({data: jResp});
        console.log('State set: ');
        console.log(this.state);
        await this.setState({lastUpdated: new Date()});
        setTimeout(async () => await this.refreshData(),3000);
    }

    render()
    {
        let teams = <></>;
        let lastUpdated = moment(this.state.lastUpdated).format('HH:mm:ss');
        if (this.state.data)
        {
            teams = this.state.data.map((team) => {
                return(<ModeratorRow {...team}/>);
            });
        }
        return(
            <Container>
                <h1 className='mt-4 mb-4'>Aeroday MAC'19 Live Results</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Team name</th>
                            <th>Team members</th>
                            <th>Registered aircraft</th>
                            <th>FW Completion Time</th>
                            <th>FW Drop Error</th>
                            <th>RW Mission Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams}
                    </tbody>
                </Table>
                <div>
                    <span>Last updated: {lastUpdated}</span>
                </div>
                <div>
                    <span>Department of Aerospace Engineering, HCMUT</span>
                </div>
            </Container>
        );
    }
}

export default Moderator;