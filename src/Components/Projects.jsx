import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';

function Projects() {
  const [projectToEdit, setProjectToEdit] = useState(null);

  const handleEditProject = (project) => {
    setProjectToEdit(project);
  };

  const handleProjectSaved = () => {
    setProjectToEdit(null); // Reset form after saving
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Projects</h1>
      <ProjectForm onProjectSaved={handleProjectSaved} projectToEdit={projectToEdit} />
      <ProjectList onEditProject={handleEditProject} />
    </div>
  );
}

export default Projects;
