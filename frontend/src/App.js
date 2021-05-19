import logo from './logo.svg';
import './App.css';
import QueryPage from './Containers/QueryPage';

const App = () => {
  return (
    <div className="App">
      <div className='App-Bar'>
        <img src={ logo } alt="Logo" className='App-Bar-Logo' />
        <h1>
          SQL Editor
        </h1>
      </div>
      <QueryPage />
    </div>
  );
}

export default App;
