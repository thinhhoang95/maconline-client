import React from 'react';
import { host } from '../Host';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Team extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {timer1: null, timer2: null, timerOn: false, data: null, dataLastUpdated: null, now: null, _teamId: ''}
    }

    async componentDidMount()
    {
        await this.refreshData();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick()
    {
        this.setState({now: new Date});
    }

    async refreshData()
    {
        console.log('Refreshing data...');
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

    startTimer1()
    {
        this.setState({timer1: moment().add(5, 'minutes').toDate(), timerOn: true});
    }

    startTimer2()
    {
        this.setState({timer2: moment().add(10, 'minutes').toDate(), timerOn: true});
    }

    stopTimer()
    {
        this.setState({timerOn: false, timer1: null, timer2: null});
    }

    async handleChange(key, e)
    {
        console.log(e.target.value);
        this.setState({[key]: e.target.value});
    }

    render()
    {
        // Timer
        let timer = 'STANDBY';
        if (this.state.timerOn && this.state.timer2!==null )
        {
            let now = moment(new Date());
            let begin = moment(this.state.timer2);
            let delta = begin.diff(now);
            timer = moment.utc(delta).format('mm:ss');
        }
        if (this.state.timerOn && this.state.timer1!==null)
        {
            console.log('else');
            let now = moment(new Date());
            let begin = moment(this.state.timer1);
            let delta = begin.diff(now);
            timer = moment.utc(delta).format('mm:ss');
        }

        // Teams
        let teams = <></>;
        if (this.state.data)
        {
            teams = this.state.data.map((teams) => {
                return (<option value={teams._id}>{teams.teamName}</option>);
            });
        }

        // Data
        let fCompletionTime = '-';
        let dropDistance = '-';
        let dCompletionTime = '-';
        if (this.state.data)
        {
            let currentTeam = this.state.data.filter((team) => team._id === this.state._teamId);
            currentTeam = currentTeam[0];
            if (currentTeam){
                if (currentTeam.fCompletionTime)
                fCompletionTime = Math.floor(Number(currentTeam.fCompletionTime)) + ' sec';
                if (currentTeam.dropDistance)
                dropDistance = currentTeam.dropDistance + ' m';
                if (currentTeam.dCompletionTime)
                dCompletionTime = Math.floor(Number(currentTeam.dCompletionTime)) + ' sec';
            }
        }
        return(<Container>
        <h1 className='mt-4 mb-4'>Aeroday MAC 2019</h1>
            <div className='controls mt-2 mb-2'>
                <div className='mt-2 mb-2'>
                    <Form.Control as="select" value={this.state._teamId} onChange={(e) => this.handleChange('_teamId', e)}>
                        <option value=''>Not selected</option>
                        {teams}
                    </Form.Control>
                </div>
                <Button className='mr-1' onClick={(e) => this.startTimer1()}>Start 5'</Button>
                <Button className='mr-1' onClick={(e) => this.startTimer2()}>Start 10'</Button>
                <Button className='mr-1' onClick={(e) => this.stopTimer()}>Stop Timer</Button>
            </div>
            <div className='timer' style={{textAlign: 'center', fontSize: '80pt'}}>
                <span style={{}}>{timer}</span>
            </div>
            <div className='info mt-4'>
                <Row>
                    <Col>
                        <h4>FW/RW Completion Time</h4>
                        <h2>{fCompletionTime}</h2>
                    </Col>
                    <Col>
                        <h4>FW Drop Distance</h4>
                        <h2>{dropDistance}</h2>
                    </Col>
                    <Col>
                        <h4>RW Mission Time</h4>
                        <h2>{dCompletionTime}</h2>
                    </Col>
                </Row>
            </div>
        </Container>);
    }
}

export default Team;