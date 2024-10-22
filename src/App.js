import React from 'react';
import './App.css'; 
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/signin-page';
import LogoutButton from './components/logout-button';
import UserProfile from './components/UserProfile';
import Loading from './components/Loading';
import ShowAlertButton from './components/ShowAudit';
import DataTable from './components/DataTable';
import { Routes, Route } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import ListRules from './components/ListRules';
import { Link } from 'react-router-dom';

function App() {
  const headerLine = "Analytic-Dash";
  const auditLine = "Audit Data";
  const mainPoints = [
    "Send audit data,",
    "generate alerts,", 
    "download reports,", 
    "and more - all in one place."
  ];
  const tagLine = "Simplify audit data and generate actionable insights.";
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <header className="App-header">
          <Link to="/" className="App-title-link">
            <h1 className="App-title">{headerLine}</h1>
          </Link>
        
        {isAuthenticated ? (
          <div className="App-header-right">
            <UserProfile />
            <LogoutButton />
          </div>
        ) : (
          <LoginButton />
        )}
      </header>
      
      <main>
        <Routes>
            <Route path="/createuser" element={<CreateUser />} />
            <Route path="/list-rules" element={<ListRules />} />
            <Route path="/" element={
              <>
                {isAuthenticated && (
                  <><DataTable />
                  {/* <h1 className="App-title">{auditLine}</h1>
                  <ShowAlertButton/> */}
                  </>
  )}
                <h2 className="App-tagline"><i>{tagLine}</i></h2>
                {isAuthenticated && (<><h1 className="App-title">{auditLine}</h1><ShowAlertButton/></>)}
                <ul className="App-points">
                  {mainPoints.map((point) => (
                    <li key={point} className="App-point">{point}</li>
                  ))}
                </ul>
              </>
            } />
          </Routes>
      </main>
    </div>
  );
}

export default App;
