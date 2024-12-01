import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Profile from './components/Profile';
import PostList from './components/PostList';
import CreatePost from './components/PostForm';
import Comments from './components/Comments';
import HomePage from './HomePage';
import Header from './components/Header';
import Chat from './components/Chat';
import Task from './components/Task';


function App() {
    return (
        <Router>
            <Header />

            {/*<Chat />*/}
            {/*<Task />*/}

            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/post/:postId/comments" element={<Comments />} />
            </Routes>
        </Router>
    );
}

export default App;
