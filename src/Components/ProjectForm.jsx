import React, { useState, useEffect } from 'react';
import projectService from '../Appwrite/ProjectService';
import CustomNotification from './Notification';

function ProjectForm({ onProjectSaved, projectToEdit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [category, setCategory] = useState('');
  const [previousImageID, setPreviousImageID] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.Project_Name);
      setDescription(projectToEdit.Description);
      setGithubLink(projectToEdit.github);
      setLiveLink(projectToEdit.preview);
      setCategory(projectToEdit.category);
      setPreviousImageID(projectToEdit.ImageID); // Assuming `ImageID` is stored in your database
    }
  }, [projectToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageURL = projectToEdit ? projectToEdit.Image : '';

      // Handle image upload and deletion
      if (image) {
        // Delete the previous image if there's a new one uploaded
        if (previousImageID) {
          await projectService.deleteImage(previousImageID);
        }

        const imageUploadResponse = await projectService.uploadImage(image);
        imageURL = await projectService.getImageURL(imageUploadResponse.$id);

        // Update the previous image ID with the new one
        setPreviousImageID(imageUploadResponse.$id);
      }

      if (projectToEdit) {
        // Update the project with the new or existing image
        await projectService.updateProject(
          projectToEdit.$id,
          name,
          description,
          imageURL.href, // Use the updated image URL
          githubLink,
          liveLink,
          category
        );
      } else {
        await projectService.createProject(
          name,
          description,
          imageURL.href,
          githubLink,
          liveLink,
          category
        );
      }
      onProjectSaved(); // Trigger re-fetch of projects after saving
      resetForm();
    } catch (error) {
      console.log('Error in saving project:', error);
        setNotification({ message: 'Failed to save project.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage(null);
    setGithubLink('');
    setLiveLink('');
    setCategory('');
    setPreviousImageID('');
  };

  return (
    <>
    {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    {loading && <p className="text-center text-blue-500">Loading...</p>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Project Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Image
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required={!projectToEdit} // Only required if adding a new project
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="githubLink">
          GitHub Link
        </label>
        <input
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          type="url"
          id="githubLink"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="liveLink">
          Live Link
        </label>
        <input
          value={liveLink}
          onChange={(e) => setLiveLink(e.target.value)}
          type="url"
          id="liveLink"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Category
        </label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          type="text"
          id="category"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {projectToEdit ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
    </>
  );
}

export default ProjectForm;
