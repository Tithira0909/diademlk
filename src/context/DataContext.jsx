import React, { createContext, useContext, useState, useEffect } from 'react';
import { strapiService } from '../services/strapiService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // --- STATE ---
  const [articles, setArticles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [siteViews, setSiteViews] = useState(0);
  const [settings, setSettings] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API Base URL
  const API_URL = '/api';

  // Load User from LocalStorage on mount (persist login)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('diadem_currentUser'));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  // Fetch Initial Data (Public + Protected if logged in)
  useEffect(() => {
    const fetchData = async () => {
        try {
            if (loading) setLoading(true);

            // Fetch Articles from Strapi
            try {
                const strapiPosts = await strapiService.getArticles();
                setArticles(strapiPosts); // These are { id, attributes: {} }
            } catch (err) {
                console.error("Strapi Fetch Failed:", err);
            }

            // Fetch other data from local backend
            const bannersRes = await fetch(`${API_URL}/banners`);
            if (bannersRes.ok) setBanners(await bannersRes.json());

            const settingsRes = await fetch(`${API_URL}/settings`);
            if (settingsRes.ok) setSettings(await settingsRes.json());

            const viewsRes = await fetch(`${API_URL}/views`);
            if (viewsRes.ok) {
                const data = await viewsRes.json();
                setSiteViews(data.views);
            }

            // Protected Data
            const token = currentUser?.token;
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
  }, [currentUser]);

  // --- ACTIONS ---

  const getHeaders = () => {
      const user = JSON.parse(localStorage.getItem('diadem_currentUser'));
      return user?.token ? {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
      } : { 'Content-Type': 'application/json' };
  };

  // Inquiries
  const addInquiry = async (inquiry) => {
    try {
        const res = await fetch(`${API_URL}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiry)
        });
        if (res.ok) {
            const newInquiry = await res.json();
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

  // Banners
  const addBanner = async (banner) => {
    try {
        const res = await fetch(`${API_URL}/banners`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(banner)
        });
        if (res.ok) {
            const newBanner = await res.json();
            setBanners(prev => [...prev, newBanner].sort((a,b) => a.list_order - b.list_order));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error adding banner:", error);
        return false;
    }
  };

  const deleteBanner = async (id) => {
      try {
          await fetch(`${API_URL}/banners/${id}`, {
              method: 'DELETE',
              headers: getHeaders()
          });
          setBanners(prev => prev.filter(b => b.id !== id));
      } catch (error) {
          console.error("Error deleting banner:", error);
      }
  };

  // Settings
  const updateSettings = async (newSettings) => {
      try {
          const res = await fetch(`${API_URL}/settings`, {
              method: 'PUT',
              headers: getHeaders(),
              body: JSON.stringify(newSettings)
          });
          if (res.ok) {
              setSettings(newSettings);
              return true;
          }
          return false;
      } catch (error) {
          console.error("Error updating settings:", error);
          return false;
      }
  };

  // File Upload Helper (Local)
  const uploadFile = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const user = JSON.parse(localStorage.getItem('diadem_currentUser'));
      const token = user?.token;

      const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
      });
      if (!res.ok) throw new Error('Upload failed: ' + res.statusText);
      return await res.json();
  };

  // View Increment Helper
  const incrementViews = async () => {
      try {
          await fetch(`${API_URL}/views/increment`, { method: 'POST' });
      } catch (err) {
          console.error("View increment failed", err);
      }
  };

  // Auth
  const login = async (username, password) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
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
      banners,
      siteViews,
      settings,
      currentUser,
      loading,
      addInquiry,
      addUser,
      deleteUser,
      addBanner,
      deleteBanner,
      updateSettings,
      uploadFile,
      incrementViews,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};
