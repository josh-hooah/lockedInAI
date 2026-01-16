import HomePage from './pages/homepage/homepage';
import { Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/login/login';
import Header from './pages/homepage/homepage_components/header';
import Footer from './pages/homepage/homepage_components/footer/footer';
import SignUp from './pages/signUpPage/SignUp';
import Dashboard from "./pages/dashboard/dashboard";
import Pricing from './pages/pricing/Pricing';
import About from './pages/about/About';
import EventsPage from './pages/events/events_Components/eventsPage';
import Contact from './pages/contact/Contact';  

function App() {
  return (
    <div className="App">
      
    <Header />


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/signin' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/events' element={<EventsPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
