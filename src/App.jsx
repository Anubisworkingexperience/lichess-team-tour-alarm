import { useRef, useState } from 'react'
import './App.css'

function App() {
  const inputValue = useRef(null);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState("");
  
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
            setTeamDescription(response.description);
            setNumberOfMembers(response.nbMembers);
          }));
        }
        catch(err) {
          console.log(err.message);
        }
      }}>Search</button>
      <h2>{`Team: ${teamName}`}</h2>
      {/* <h2>{`Description: ${teamDescription}`}</h2> */}
      <h2>{`Live members: ${numberOfMembers}`}</h2>
      <h2>Next tournament in: </h2>
    </>
  )
}

export default App
