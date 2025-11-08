import React, { useState, useEffect } from 'react';
import { FiUpload, FiTrash2, FiEdit2, FiX, FiCheck, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { apiGet, apiPostForm, apiPatchForm, apiDelete } from '../lib/api';

const ClientForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialData?.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('url', url);
    if (image) {
      formData.append('image', image);
    }

    try {
      await onSubmit(formData);
      setName('');
      setUrl('');
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo Image {!initialData && '*'}
        </label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="logo-upload"
              required={!initialData}
            />
            <label
              htmlFor="logo-upload"
              className="flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-md hover:border-blue-500 cursor-pointer"
            >
              <FiUpload className="mr-2" />
              {image ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
          {preview && (
            <div className="relative w-20 h-20">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-md border"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Update Client' : 'Add Client'}
        </button>
      </div>
    </form>
  );
};

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    try {
      const response = await apiGet('/clients');
      setClients(response.data || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (formData) => {
    try {
      await apiPostForm('/clients', formData);
      await fetchClients();
      toast.success('Client added successfully');
    } catch (error) {
      console.error('Add client failed:', error);
      toast.error(error.message || 'Failed to add client');
      throw error;
    }
  };

  const handleUpdateClient = async (clientId, formData) => {
    try {
      await apiPatchForm(`/clients/${clientId}`, formData);
      setEditingClient(null);
      await fetchClients();
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Update client failed:', error);
      toast.error(error.message || 'Failed to update client');
      throw error;
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      await apiDelete(`/clients/${clientId}`);
      await fetchClients();
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Delete client failed:', error);
      toast.error('Failed to delete client');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl bg-white mx-auto">
      <h1 className="text-2xl font-bold mb-8">Client Management</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Client</h2>
        <ClientForm onSubmit={handleAddClient} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Clients</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {editingClient === client._id ? (
                <ClientForm
                  initialData={client}
                  onSubmit={(formData) => handleUpdateClient(client._id, formData)}
                  onCancel={() => setEditingClient(null)}
                />
              ) : (
                <div className="p-4">
                  <div className="aspect-video relative mb-4">
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      {client.url && (
                        <a
                          href={client.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <FiLink size={14} />
                          Visit Website
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingClient(client._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {clients.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No clients added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;