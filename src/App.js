import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
/* import Header from './components.js/Header';
import Footer from './components.js/Footer';
import SideNav from './components.js/SideNav'; */
import Register from './Pages/Register';
import Login from './Pages/Login'
import QuestionPaper from './Pages/QuestionPaper';
import Result from './Pages/Result';
import Home from './Pages/Home';
import AdminManagement from './Pages/AdminManagement';
import SetQuestions from './Pages/SetQuestions';
import Error from './Pages/Error';
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';

function App() {
  const [cookies, setCookie] = useCookies(['token', 'name', 'email', 'type', 'applied']);
  const handleLogin = (isLog) => {
    console.log("had: ", isLog)
    setCookie('token', isLog.token, { path: '/' })
    setCookie('name', isLog.user.fullname, { path: '/' })
    setCookie('email', isLog.user.email, { path: '/' })
    setCookie('type', isLog.user.usertype, { path: '/' })
    setCookie('applied', isLog.user.applied, { path: '/' })
  }
  const getToken = () => {
    const tokenString = cookies.token;
    return tokenString
  }

  const token = getToken();
  if (!token) {
    <Login isLogin={handleLogin} />
  }
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/" element={<Login isLogin={handleLogin} />} />
          <Route exact path="/questionPaper" element={<QuestionPaper />} />
          <Route exact path="/result" element={<Result />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/adminManagement" element={<AdminManagement />} />
          <Route exact path="/setQuestions" element={<SetQuestions />} />
          <Route exact path="/error" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
