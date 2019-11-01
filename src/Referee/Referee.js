import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import { host } from '../Host';

class Referee extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { teams: null, _teamId: '', _type: '', _value: '', _referee: '' }
    }

    async componentDidMount()
    {
        await this.refreshTeams();
    }

    async refreshTeams()
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
        await this.setState({teams: jResp});
        console.log('State set: ');
        console.log(this.state);
    }

    async handleChange(key, e)
    {
        console.log(e.target.value);
        this.setState({[key]: e.target.value});
    }

    async submitReport()
    {
        if (this.state._referee==='') return;
        if (this.state._teamId==='') return;
        if (this.state._type==='') return;
        if (this.state.value==='') return;

        let letter = {
            id: this.state._teamId,
            referee: this.state._referee,
            data: {
                [this.state._type]: this.state._value
            }
        }

        const jLetter = JSON.stringify(letter);
        let response = await fetch(host + '/score',
        {
            method: 'POST',
            json: true,
            body: jLetter,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200)
        {
            throw new Error('Cannot post data to server! Check your internet connection!');
        }
        alert('Your report has been successfully submitted!');
        await this.setState({_value: ''});
    }

    render()
    {
        let teams = <></>;
        if (this.state.teams)
        {
            teams = this.state.teams.map((teams) => {
                return (<option value={teams._id}>{teams.teamName}</option>);
            });
        }
        return(
            <Container>
            <h1 className='mt-4 mb-4'>Referee Report Form</h1>
            <Form>
                <Form.Group controlId='formValue'>
                    <Form.Label>Referee name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" value={this.state._referee} onChange={(e) => this.handleChange('_referee', e)}/>
                </Form.Group>

                <Form.Group controlId="formTeam">
                    <Form.Label>Team</Form.Label>
                    <Form.Control as="select" value={this.state._teamId} onChange={(e) => this.handleChange('_teamId', e)}>
                        <option value=''>Not selected</option>
                        {teams}
                    </Form.Control>
                    <Form.Text className="text-muted">
                        Please double check the name of the team before submitting the report.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formType">
                    <Form.Label>Report type</Form.Label>
                    <Form.Control as="select" value={this.state._type} onChange={(e) => this.handleChange('_type', e)}>
                        <option value=''>Not selected</option>
                        <option value='fCompletionTime'>FW/RW Flight Time (sec)</option>
                        <option value='dropDistance'>FW Drop distance (m)</option>
                        <option value='dCompletionTime'>RW Mission Time</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='formValue'>
                    <Form.Label>Report value</Form.Label>
                    <Form.Control type="text" placeholder="Enter value here" value={this.state._value} onChange={(e) => this.handleChange('_value', e)}/>
                </Form.Group>

                <div className='mt-4 mb-4'><span style={{color: 'red'}}>Please double check all the fields before submission. Submitted report can not be recalled!</span></div>

                <Button variant="primary" onClick={() => this.submitReport()}>
                    Submit Report
                </Button>
                </Form>
            </Container>
        );
    }
}

export default Referee;