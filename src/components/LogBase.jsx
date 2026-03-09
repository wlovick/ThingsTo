import "./LogBase.css";
import { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";

// Helper to get current user
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default function LogBase() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [inputs, setInputs] = useState({
        name: "",
        description: "",
        location: "",
        quantity: "",
        tags: "",
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [logs, setLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editInputs, setEditInputs] = useState({
        name: "",
        description: "",
        location: "",
        quantity: "",
        tags: "",
    });
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    // Handle delete
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this log entry?');
        if (!confirmed) return;
        setDeleteLoadingId(id);
        const user = await getCurrentUser();
        const { error } = await supabase
            .from('LogsShared')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        if (!error) {
            setLogs((prev) => prev.filter((log) => log.id !== id));
        }
        setDeleteLoadingId(null);
    };

    // Handle edit start
    const handleEditStart = (log) => {
        setEditId(log.id);
        setEditInputs({
            name: log.name || "",
            description: log.description || "",
            location: log.location || "",
            quantity: log.quantity || "",
            tags: log.tags || "",
        });
    };

    // Handle edit input change
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditInputs((prev) => ({ ...prev, [name]: value }));
    };

    // Handle edit submit
    const handleEditSubmit = async (e, id) => {
        e.preventDefault();
        setEditLoading(true);
        const user = await getCurrentUser();
        const { error } = await supabase
            .from('LogsShared')
            .update({
                name: editInputs.name,
                description: editInputs.description,
                location: editInputs.location,
                quantity: editInputs.quantity,
                tags: editInputs.tags,
            })
            .eq('id', id)
            .eq('user_id', user.id);
        if (!error) {
            setLogs((prev) => prev.map((log) => log.id === id ? { ...log, ...editInputs } : log));
            setEditId(null);
        }
        setEditLoading(false);
    };

    // Handle edit cancel
    const handleEditCancel = () => {
        setEditId(null);
    };

    // Get logged in user
    // If using supabase.auth.getUser() async, you may need to adjust
    // const user = getCurrentUser();

    const handleImageChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError("");
        setSuccess("");
        const user = await getCurrentUser();
        if (!image) {
            setError("Please select an image.");
            setUploading(false);
            return;
        }
        try {
            // Upload image to Supabase Storage
            const filePath = `${user?.id || 'temp'}/${Date.now()}_${image.name}`;
            const { error: uploadError } = await supabase.storage
                .from('LogsPhotos')
                .upload(filePath, image);
            if (uploadError) throw uploadError;
            // Get public URL
            const { data: urlData } = supabase.storage
                .from('LogsPhotos')
                .getPublicUrl(filePath);
            const imageUrl = urlData?.publicUrl;
            // Save details to Supabase table
            const { error: insertError } = await supabase
                .from('LogsShared')
                .insert([
                    {
                        user_id: user?.id || null,
                        name: inputs.name,
                        description: inputs.description,
                        location: inputs.location,
                        quantity: inputs.quantity,
                        tags: inputs.tags,
                        image_url: imageUrl,
                    },
                ]);
            if (insertError) throw insertError;
            setSuccess('Photo and details uploaded successfully!');
            e.target.value = null; // Reset file input
            setImage(null);
            setPreview(null);
            setInputs({ name: '', description: '', location: '', quantity: '', tags: '' });
        } catch (err) {
            setError(err.message || 'Upload failed.');
        }
        setUploading(false);
    };

    // Fetch logs for logged-in user
    useEffect(() => {
        let isMounted = true;
        async function fetchLogs() {
            setLoadingLogs(true);
            const user = await getCurrentUser();
            if (!user) {
                setLogs([]);
                setLoadingLogs(false);
                return;
            }
            const { data, error } = await supabase
                .from('LogsShared')
                .select('*')
                .eq('user_id', user.id)
                .order('id', { ascending: false });
            if (isMounted) {
                if (error) {
                    setLogs([]);
                } else {
                    setLogs(data || []);
                }
                setLoadingLogs(false);
            }
        }
        fetchLogs();
        return () => { isMounted = false; };
    }, [success]); // refetch on upload success

    return (
        <div className="logbase-container">

            {/* input form */}
            <div className="logbase-upload-box">
                <form className="logForm" onSubmit={handleSubmit}>
                    {preview && (
                        <div style={{ margin: '10px 0' }}>
                            <img src={preview} alt="Preview" className="preview" />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Photo:</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input name="name" value={inputs.name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input name="description" value={inputs.description} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input name="location" value={inputs.location} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Quantity:</label>
                        <input name="quantity" type="number" value={inputs.quantity} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Tags:</label>
                        <input name="tags" value={inputs.tags} onChange={handleInputChange} />
                    </div>
                    <button type="submit" disabled={uploading}>Upload</button>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                </form>
            </div>

            {/* logged entries */}
            <div className="logbase-logged-box">
                {loadingLogs ? (
                    <div>Loading logs...</div>
                ) : logs.length === 0 ? (
                    <div>No logs found.</div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {logs.map(log => (
                            <li key={log.id} style={{ borderBottom: '1px solid #ccc', margin: '10px 0', padding: '10px', width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
                                {log.image_url && (
                                    <div style={{ marginBottom: 10, textAlign: 'center' }}>
                                    <img src={log.image_url} alt={log.name} className="LoggedItemImage" />
                                    </div>
                                )}
                                {editId === log.id ? (
                                    <form onSubmit={(e) => handleEditSubmit(e, log.id)}>
                                        <div>
                                            <label>Name:</label>
                                            <input name="name" value={editInputs.name} onChange={handleEditInputChange} />
                                        </div>
                                        <div>
                                            <label>Description:</label>
                                            <input name="description" value={editInputs.description} onChange={handleEditInputChange} />
                                        </div>
                                        <div>
                                            <label>Location:</label>
                                            <input name="location" value={editInputs.location} onChange={handleEditInputChange} />
                                        </div>
                                        <div>
                                            <label>Quantity:</label>
                                            <input name="quantity" type="number" value={editInputs.quantity} onChange={handleEditInputChange} />
                                        </div>
                                        <div>
                                            <label>Tags:</label>
                                            <input name="tags" value={editInputs.tags} onChange={handleEditInputChange} />
                                        </div>
                                        <button type="submit" disabled={editLoading}>Save</button>
                                        <button type="button" onClick={handleEditCancel} disabled={editLoading}>Cancel</button>
                                    </form>
                                ) : (
                                    <div className="LoggedItem">
                                        <div className="LoggedItemAtr"><strong>Name:</strong> {log.name}</div>
                                        <div className="LoggedItemAtr"><strong>Description:</strong> {log.description}</div>
                                        <div className="LoggedItemAtr"><strong>Location:</strong> {log.location}</div>
                                        <div className="LoggedItemAtr"><strong>Quantity:</strong> {log.quantity}</div>
                                        <div className="LoggedItemAtr"><strong>Tags:</strong> {log.tags}</div>
                                        <button className="LoggedItemButton edit-btn" onClick={() => handleEditStart(log)} disabled={editLoading}>Edit</button>
                                        <button className="LoggedItemButton delete-btn" onClick={() => handleDelete(log.id)} disabled={deleteLoadingId === log.id}>Delete</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
        </div>
    );
};
