import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // --- STATE ---
  const [articles, setArticles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API Base URL
  const API_URL = 'http://localhost:5000/api';

  // Load User from LocalStorage on mount (persist login)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('diadem_currentUser'));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  // Fetch Initial Data (Public + Protected if logged in)
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = currentUser?.token;

            // Articles are public
            const articlesRes = await fetch(`${API_URL}/articles`);
            if (articlesRes.ok) {
                setArticles(await articlesRes.json());
            } else {
                console.error("Articles Fetch Failed:", articlesRes.status, await articlesRes.text());
            }

            // Protected Data
            if (token) {
                 const headers = { 'Authorization': `Bearer ${token}` };
                 const inquiriesRes = await fetch(`${API_URL}/inquiries`, { headers });
                 const usersRes = await fetch(`${API_URL}/users`, { headers });

                 if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
                 if (usersRes.ok) setUsers(await usersRes.json());
            }

        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [currentUser]); // Re-fetch when user changes

  // --- ACTIONS ---

  const getHeaders = () => {
      const user = JSON.parse(localStorage.getItem('diadem_currentUser'));
      return user?.token ? {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
      } : { 'Content-Type': 'application/json' };
  };

  // Articles
  const addArticle = async (article) => {
    try {
        const res = await fetch(`${API_URL}/articles`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(article)
        });
        if (res.ok) {
            const newArticle = await res.json();
            setArticles(prev => [newArticle, ...prev]);
        }
    } catch (error) {
        console.error("Error adding article:", error);
    }
  };

  const deleteArticle = async (id) => {
      try {
          await fetch(`${API_URL}/articles/${id}`, {
              method: 'DELETE',
              headers: getHeaders()
          });
          setArticles(prev => prev.filter(a => a.id !== id));
      } catch (error) {
          console.error("Error deleting article:", error);
      }
  };

  // Inquiries
  const addInquiry = async (inquiry) => {
    try {
        const res = await fetch(`${API_URL}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Public endpoint
            body: JSON.stringify(inquiry)
        });
        if (res.ok) {
            const newInquiry = await res.json();
            // Only update local state if we are admin/can see it, otherwise it's just sent
            if(currentUser) setInquiries(prev => [newInquiry, ...prev]);
        }
    } catch (error) {
        console.error("Error sending inquiry:", error);
    }
  };

  // Users
  const addUser = async (user) => {
    try {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(user)
        });
        if (res.ok) {
            const newUser = await res.json();
            setUsers(prev => [...prev, newUser]);
        }
    } catch (error) {
         console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (id) => {
      try {
          await fetch(`${API_URL}/users/${id}`, {
              method: 'DELETE',
              headers: getHeaders()
          });
          setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
          console.error("Error deleting user:", error);
      }
  }

  // Auth
  const login = async (username, password) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json(); // { id, username, role, token }
            setCurrentUser(data);
            localStorage.setItem('diadem_currentUser', JSON.stringify(data));
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Login error:", error);
        return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('diadem_currentUser');
  };

  return (
    <DataContext.Provider value={{
      articles,
      inquiries,
      users,
      currentUser,
      loading,
      addArticle,
      deleteArticle,
      addInquiry,
      addUser,
      deleteUser,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};
