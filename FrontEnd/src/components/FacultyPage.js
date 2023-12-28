import React, { useState, useEffect, useContext } from 'react';
import DocumentCard from './DocumentCard';
import axios from 'axios';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { RouteParamsContext } from './context/RouteParamsContext';
import { jwtDecode } from 'jwt-decode'; 
import { CSSTransition } from 'react-transition-group';

const FacultyPage = ({ searchTerm }) => {
  const { setRouteParams } = useContext(RouteParamsContext);
  const location = useLocation();
  const facultyName = location.state?.facultyName || 'Faculty'; 
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]); // State for filtered resources
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();
  const backendURL = 'http://localhost:3002';
  const { facultyId } = useParams();
  const { authToken, refreshTokenFunc } = useContext(AuthContext);

  const facultyImageFilename = facultyName.toLowerCase().replace(/ /g, '-');
  const backgroundImage = `/images/${facultyImageFilename}.png`;
  const pageStyle = {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed', // This will keep the background fixed during scrolling
    minHeight: '100vh',
    transform: 'scale(1.0)',
    backgroundAttachment: 'fixed',
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';

    return () => {
      document.body.style.background = '';
      document.body.style.overflow = '';
    };
  }, [backgroundImage]);

  useEffect(() => {
    setRouteParams({ facultyId });
  }, [facultyId, setRouteParams]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendURL}/api_resource/faculty/${facultyId}`);
        setResources(response.data.resource_list);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching faculty resources:', err);
        setError(err.response?.data?.error || 'An error occurred while fetching resources.');
        setLoading(false);
      }
    };

    fetchResources();
  }, [facultyId, backendURL]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (authToken) {
        try {
          const profileResponse = await axios.get(`${backendURL}/api_user/profile`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUserFavorites(profileResponse.data.userFavorites.map(fav => fav.Resource._id));
        } catch (err) {
          console.error('Error fetching user favorites:', err);
        }
      }
    };

    if (authToken) {
      fetchFavorites();
    }
  }, [authToken, backendURL]);

  useEffect(() => {
    const term = searchTerm ? searchTerm.toString().toLowerCase() : '';
    const filtered = term
      ? resources.filter(resource => resource.Title.toLowerCase().includes(term))
      : resources;
    setFilteredResources(filtered);
  }, [searchTerm, resources]);

  const isResourceFavorited = resourceId => authToken && userFavorites.includes(resourceId);

  const handleCardClick = resourceId => {
    history.push(`/resource/${resourceId}`);
  };

  const toggleFavorite = async (resourceId) => {
    if (jwtDecode(authToken).exp < Date.now() / 1000) {
      await refreshTokenFunc();
    }
    const isAlreadyFavorited = userFavorites.includes(resourceId);
    const endpoint = isAlreadyFavorited ? 'unfavorite' : 'favorite';
    const method = isAlreadyFavorited ? axios.delete : axios.post;

    try {
      await method(`${backendURL}/api/resources/${resourceId}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setUserFavorites(currentFavorites =>
        isAlreadyFavorited ? currentFavorites.filter(id => id !== resourceId) : [...currentFavorites, resourceId]
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <CSSTransition in={true} appear={true} timeout={300} classNames="fade">
      <div style={pageStyle} className="faculty-page">
        <div className="faculty-container">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <DocumentCard
                cardType="faculty"
                key={resource._id}
                document={resource}
                onClick={() => handleCardClick(resource._id)}
                isFavorited={isResourceFavorited(resource._id)}
                onToggleFavorite={() => toggleFavorite(resource._id)}
              />
            ))
          ) : (
            <p>No resources found for this faculty.</p>
          )}
        </div>
      </div>
    </CSSTransition>
  );
};

export default FacultyPage;
