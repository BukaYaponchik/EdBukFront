import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm/RegistrationForm';
import Timetable from './pages/Timetable/Timetable';
import LoginForm from './pages/LoginForm/LoginForm';
import ConfirmationNumber from './pages/ConfirmationNumber/ConfirmationNumber';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/confirmationnumber" element={<ConfirmationNumber />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </Router>
  );
};

export default App;