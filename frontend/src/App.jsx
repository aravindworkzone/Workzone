import react from 'react';
import Registration from './page/Registration';
import EmailVerified from "./page/EmailVerified";
import Login from './page/login';
import Home from './page/home';
import { Route, Routes} from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<Login />} />
        <Route path="/verifyemail" element={<EmailVerified />} />
      </Routes>
    </>
  )
}

export default App
