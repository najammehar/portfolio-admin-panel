import React, { useState, useEffect } from 'react';
import projectService from '../Appwrite/ProjectService';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import CustomNotification from './Notification';

function ProjectList({ onEditProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectService.getProjects(10, 0);
      setProjects(response);
    } catch (error) {
      console.log('Error in fetching projects:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (projectID) => {
    setLoading(true);
    try {
      await projectService.deleteProject(projectID);
      setProjects((prevProjects) => prevProjects.filter((project) => project.$id !== projectID));
      setNotification({ message: 'Project successfully deleted!', type: 'success' });
    } catch (error) {
      console.log('Error in deleting project:', error);
      setNotification({ message: 'Failed to delete project.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
        {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {projects.map((project) => (
        <div key={project.$id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Project Image */}
            {project.Image && (
              <img
                src={project.Image}
                alt={project.Project_Name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-800">{project.Project_Name}</h3>
              <p className="text-gray-600">{project.Description}</p>
              <div className="flex space-x-4 mt-2">
                {/* GitHub Link */}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                  >
                    GitHub
                  </a>
                )}
                {/* Live Preview Link */}
                {project.preview && (
                  <a
                    href={project.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 transition-colors duration-300"
                  >
                    Live Preview
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEditProject(project)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              <FiEdit className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleDelete(project.$id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-300"
            >
              <FiTrash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
