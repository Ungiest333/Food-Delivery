import React from 'react'
import {BrowserRouter as Router ,Route,Routes} from 'react-router-dom' 
import UserRegister from '../page/UserRegister';
import UserLogin from '../page/UserLogin';
import PartnerRegister from '../page/PartnerRegister';
import PartnerLogin from '../page/PartnerLogin';
import Home from '../page/general/Home';
import CreateFood from '../page/food-partner/CreateFood';
import Profile from '../page/food-partner/profile';
import Saved from '../page/general/Saved';
import Comment from '../page/general/commentReel';
const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/food-partner/register" element={<PartnerRegister />} />
            <Route path="/food-partner/login" element={<PartnerLogin />} />
            <Route path="/" element= {<Home/>}/> 
            <Route path ="/create-food" element ={<CreateFood/>}/>
         <Route path="/food-partner/:id" element={<Profile />} />
         <Route path="/saved" element={<Saved />} />
          <Route path="/comments/:foodId" element={<Comment />} />


            </Routes>
    </Router>
  )
}

export default AppRouter