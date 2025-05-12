import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import TranscriptionComponent from './components/TranscriptionComponent';
import SummaryComponent from './components/SummaryComponent';
import KeywordList from './components/KeywordList';
import TopicTags from './components/TopicTags';

const TABS = [
  { label: 'Transcription', component: <TranscriptionComponent /> },
  { label: 'Summary', component: <SummaryComponent /> },
  { label: 'Keywords', component: <KeywordList /> },
  { label: 'Topics', component: <TopicTags /> },
];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('jwt_token'));
  const [activeTab, setActiveTab] = useState(0);

  if (!loggedIn) {
    return <LoginForm onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">AI Note Assistant</h1>
      <div className="flex space-x-2 mb-6">
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-4 py-2 rounded ${activeTab === idx ? 'bg-blue-600 text-white' : 'bg-white border'}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded shadow p-4">
        {TABS[activeTab].component}
      </div>
    </div>
  );
}
