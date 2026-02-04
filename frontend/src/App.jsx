import react from 'react';
import Registration from './page/Registration';
import Login from './page/login';
import Home from './page/home';
import { Route, Routes} from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
