import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider } from "./ThemeContext";


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
import EventDashboard from './components/EventDashboard';
import EventDetails from './components/EventDetails';

import './App.css';

const isLogged = localStorage.getItem('isLogged');


function App() {
    return (
        <ThemeProvider>
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
                            <Route path="/events" element={<EventDashboard />} />
                            <Route path="/event/:id" element={<EventDetails />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
