import { useRef, useState } from 'react'
import './App.css'

function App() {
  const inputValue = useRef(null);
  const [teamName, setTeamName] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState("");
  
  //read nd-json
  const readStream = processLine => response => {
    const stream = response.body.getReader();
    const matcher = /\r?\n/;
    const decoder = new TextDecoder();
    let buf = '';
  
    const loop = () =>
      stream.read().then(({ done, value }) => {
        if (done) {
          if (buf.length > 0) processLine(JSON.parse(buf));
        } else {
          const chunk = decoder.decode(value, {
            stream: true
          });
          buf += chunk;
  
          const parts = buf.split(matcher);
          buf = parts.pop();
          for (const i of parts.filter(p => p)) processLine(JSON.parse(i));
          return loop();
        }
      });
  
    return loop();
  }

  const onMessage = obj => console.log(obj);
  const onComplete = () => console.log('The stream has completed');
  
  return (
    <>
      <h1 className='underline'>Lichess team tournament notifier 🏆</h1>
      <label htmlFor="team">Team id</label>
      <input type="text" name="team" id="team" ref={inputValue} />
      <button onClick={async function getTeam(teamId) {
        teamId = inputValue.current.value;
        console.log(teamId);
        try {
          const response = await fetch(`https://lichess.org/api/team/${teamId}`, {mode: 'cors'})
          .then(response => response.json().then(function(response) {
            console.log(response);
            setTeamName(response.name);
            setNumberOfMembers(response.nbMembers);
          }));

          const stream = fetch(`https://lichess.org/api/team/${teamId}/arena`, {headers: {Accept: 'application/x-ndjson'}});
          stream
          .then(readStream(onMessage))
          .then(onComplete);        
        }
        catch(err) {
          console.log(err.message);
        }
      }}>Search</button>
      <h2>{`Team: ${teamName}`}</h2>
      <h2>{`Live members: ${numberOfMembers}`}</h2>
      <h2>Next tournament in: </h2>
    </>
  )
}

export default App
