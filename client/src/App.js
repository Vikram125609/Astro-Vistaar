import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Signup from './components/Signup/Signup';
import Course from './components/Course/Course';
import User from './components/User/User';
import CourseEnrolled from './components/CourseEnrolled/CourseEnrolled';
import './App.css';
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Course' element={<Course />} />
        <Route path='Admin/User' element={<User />} />
        <Route path='Course/Enrolled' element={<CourseEnrolled />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
      </Routes>
    </div>
  );
}
export default App;
