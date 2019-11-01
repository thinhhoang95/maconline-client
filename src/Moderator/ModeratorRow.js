import React from 'react';
import moment from 'moment';

class ModeratorRow extends React.Component
{
    pad(num) {
        return ("0"+num).slice(-2);
    }

    hhmmss(secs) {
      secs = Number(secs);
      secs = Math.floor(secs);
      var minutes = Math.floor(secs / 60);
      secs = secs%60;
      var hours = Math.floor(minutes/60)
      minutes = minutes%60;
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
      // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
    }

    render()
    {
        let registeredAC = '?';
        switch (this.props.acType)
        {
            case 0:
                registeredAC = 'Fixed Wing';
                break;
            case 1:
                registeredAC = 'Rotary Wing';
                break;
            default:
                registeredAC = '?';
        }
        return(
            <tr>
                <td>{this.props.teamName}</td>
                <td>{this.props.teamMembers}</td>
                <td>{registeredAC}</td>
                <td>{this.props.fCompletionTime ? this.hhmmss(this.props.fCompletionTime) : 'Yet to start'} ({this.props.rfCompletionTime ? this.props.rfCompletionTime.length : ''}) </td>
                <td>{this.props.dropDistance ? this.props.dropDistance : 'Yet to start'} ({this.props.rdropDistance ? this.props.rdropDistance.length : ''}) </td>
                <td>{this.props.dCompletionTime ? this.hhmmss(this.props.dCompletionTime) : 'Yet to start'} ({this.props.rdCompletionTime ? this.props.rdCompletionTime.length : ''}) </td>
            </tr>
        );
    }
}

export default ModeratorRow;