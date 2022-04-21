import { Fragment } from 'react';
import './App.css';
import './components/timer';
import Board from './components/board';

function App() {
  return (
    <Fragment>
      <h1>~MineSweeper~</h1>
      <div id="timer">0</div>
      <br></br>
      <Board />
    </Fragment>
  );
}

export default App;


// QUESTIONS
// Should we avoid over-using fragments? 
//how can we differentiate between left/right click
//do we need to display a photo?