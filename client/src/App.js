import logo from './logo.svg';
import './App.css';
import Home from './Componenet/Home';
import {Routes,Route} from 'react-router-dom';
import EditorPage from './Componenet/EditorPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/editor/:roomId" element={<EditorPage  />}/>
      </Routes>    
    </>
  );
}

export default App;
