```jsx
// ... Existing imports and setup

function ProjectForm({ onProjectSaved, projectToEdit }) {
    // ... Existing states
    const [isPinned, setIsPinned] = useState(false);
    const [pinnedOrder, setPinnedOrder] = useState('');

    useEffect(() => {
        if (projectToEdit) {
            // ... Existing initializations
            setIsPinned(projectToEdit.isPinned || false);
            setPinnedOrder(projectToEdit.pinnedOrder || '');
        }
    }, [projectToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate pinned order
        if (isPinned && (pinnedOrder < 1 || pinnedOrder > 4)) {
            setNotification({ message: 'Pinned order must be between 1-4.', type: 'error' });
            return;
        }

        try {
            // ... Existing image handling

            if (projectToEdit) {
                await projectService.updateProject(
                    projectToEdit.$id,
                    name,
                    description,
                    imageURL.href,
                    githubLink,
                    liveLink,
                    category,
                    isPinned,
                    pinnedOrder
                );
            } else {
                await projectService.createProject(
                    name,
                    description,
                    imageURL.href,
                    githubLink,
                    liveLink,
                    category,
                    isPinned,
                    pinnedOrder
                );
            }
            // ... Rest of the submission logic
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
    };

    return (
        <>
            {/* ... Existing form elements */}
            
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    <input
                        type="checkbox"
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                        className="mr-2"
                    />
                    Pin this project (Max 4)
                </label>
            </div>

            {isPinned && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Pinned Position (1-4)
                    </label>
                    <select
                        value={pinnedOrder}
                        onChange={(e) => setPinnedOrder(parseInt(e.target.value))}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                        required
                    >
                        <option value="">Select position</option>
                        {[1, 2, 3, 4].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* ... Rest of the form */}
        </>
    );
}

export default ProjectForm;