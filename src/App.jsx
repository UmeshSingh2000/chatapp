import React from 'react'
import Login from './components/Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUp from './components/SignUp'
import LandingPage from './components/LandingPage'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/homepage' element={<LandingPage/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
