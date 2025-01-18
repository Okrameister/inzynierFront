import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Auth from './components/Auth';
import Profile from './components/Profile';
import CreatePost from './components/PostForm';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Chat from './components/Chat';
import Task from './components/Task';
import ScheduleGrid from "./components/ScheduleGrid";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import FacultyList from './components/FacultyList';
import FacultyDetails from './components/FacultyDetails';
import NewsList from './components/NewsList';
import NewsForm from './components/NewsForm';
import './App.css';

const isLogged = localStorage.getItem('isLogged');


function App() {
    return (
        <Router>
            <Header />
            <div className="routerView">
                {isLogged && <div className={"sidebar"}>  <Sidebar /> </div>}
                <div className={"main-content"}>
                    <Routes>
                        <Route path="/" element={<HomePage/>} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/schedule" element={<ScheduleGrid />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/task" element={<Task />} />
                        <Route path="/adminPanel" element={<AdminPanel />} />
                        <Route path="/faculties" element={<FacultyList />} />
                        <Route path="/faculty/:id" element={<FacultyDetails />} />
                        <Route path="/news" element={<NewsList />} />
                        <Route path="/create-news" element={<NewsForm />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
