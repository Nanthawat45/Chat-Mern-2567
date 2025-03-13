import './App.css'
import Navbar from './components/Navbar';
import Signup from"./pages/Signup"
import Login from"./pages/Login"
import Home from"./pages/Home"
import Setting from"./pages/Setting"
import  Profile  from "./pages/Profile";
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthstore';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react';

function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const theme = "dark";
  useEffect(() =>{
    checkAuth();
  },[checkAuth]);

  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center-justift-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/"
        element={authUser ? <Home /> : <Navbar to = "/login"/>}
        />
        <Route path="/signup" 
        element={!authUser ? <Signup /> : <Navbar to = "/"/>} 
        />
        <Route path="/login" 
        element={!authUser ? <Login /> : <Navbar to = "/"/>} 
        />
        <Route path="/setting" 
        element={<Setting/>} 
        />
        <Route path="/profile" 
        element={authUser ? <Profile /> : <Navbar to = "/login"/>} 
        />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
