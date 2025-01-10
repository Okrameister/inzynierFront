import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Auth from './components/Auth';
import Profile from './components/Profile';
import PostList from './components/PostList';
import CreatePost from './components/PostForm';
import Comments from './components/Comments';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Chat from './components/Chat';
import Task from './components/Task';
import ScheduleGrid from "./components/ScheduleGrid";
import Sidebar from "./components/Sidebar";
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
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/post/:postId/comments" element={<Comments />} />
                        <Route path="/schedule" element={<ScheduleGrid />} />
                        <Route path="/chat/:conversationId" element={<Chat />} />
                        <Route path="/task" element={<Task />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
