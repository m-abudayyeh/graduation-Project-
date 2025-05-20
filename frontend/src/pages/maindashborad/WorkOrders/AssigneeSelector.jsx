useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/users`, {
        withCredentials: true
      });
      
      if (response.data && response.data.data) {
        const filteredUsers = response.data.data.rows.filter(
          user => ['technician', 'supervisor'].includes(user.role?.toLowerCase())
        );
        setUsers(filteredUsers || []);
      }
    } catch (err) {
      setError('Error loading users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);
