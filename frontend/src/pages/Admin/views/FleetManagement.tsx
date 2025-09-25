import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Spinner
} from "react-bootstrap";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Car, 
  Users, 
  Luggage, 
  DollarSign,
  Save,
  X
} from "lucide-react";
import { fleetAPI } from "../../../services/api";

interface Vehicle {
  id: number;
  name: string;
  type: string;
  image_url: string;
  base_price: number;
  capacity: number;
  luggage_capacity: number;
  transfer_types: string[];
  description: string;
  features: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const FleetManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "sedan",
    image_url: "",
    base_price: 0,
    capacity: 4,
    luggage_capacity: 2,
    transfer_types: [] as string[],
    description: "",
    features: [""],
    is_active: true
  });

  // Load vehicles from API
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await fleetAPI.getAll({ active: true });
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      setError("Failed to load vehicles");
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (vehicle: Vehicle | null = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        name: vehicle.name,
        type: vehicle.type,
        image_url: vehicle.image_url,
        base_price: vehicle.base_price,
        capacity: vehicle.capacity,
        luggage_capacity: vehicle.luggage_capacity,
        transfer_types: [...vehicle.transfer_types],
        description: vehicle.description,
        features: vehicle.features.length > 0 ? [...vehicle.features] : [""],
        is_active: vehicle.is_active
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        name: "",
        type: "sedan",
        image_url: "",
        base_price: 0,
        capacity: 4,
        luggage_capacity: 2,
        transfer_types: [],
        description: "",
        features: [""],
        is_active: true
      });
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'base_price' || name === 'capacity' || name === 'luggage_capacity' ? Number(value) : value
    }));
  };

  const handleTransferTypeChange = (transferType: string) => {
    setFormData(prev => ({
      ...prev,
      transfer_types: prev.transfer_types.includes(transferType)
        ? prev.transfer_types.filter(t => t !== transferType)
        : [...prev.transfer_types, transferType]
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const removeFeatureField = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!formData.name.trim() || !formData.description.trim()) {
        setError("Name and description are required");
        return;
      }

      if (formData.base_price <= 0) {
        setError("Base price must be greater than 0");
        return;
      }

      const vehicleData = {
        name: formData.name,
        type: formData.type,
        image_url: formData.image_url,
        base_price: formData.base_price,
        capacity: formData.capacity,
        luggage_capacity: formData.luggage_capacity,
        transfer_types: formData.transfer_types,
        description: formData.description,
        features: formData.features.filter(f => f.trim() !== ""),
        is_active: formData.is_active
      };

      if (editingVehicle) {
        // Update existing vehicle
        await fleetAPI.update(editingVehicle.id.toString(), vehicleData);
        setSuccess("Vehicle updated successfully!");
      } else {
        // Add new vehicle
        await fleetAPI.create(vehicleData);
        setSuccess("Vehicle added successfully!");
      }

      // Reload vehicles
      await loadVehicles();
      
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
      
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to save vehicle");
      console.error('Error saving vehicle:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await fleetAPI.delete(id.toString());
        setSuccess("Vehicle deleted successfully!");
        await loadVehicles();
      } catch (error: any) {
        setError(error.response?.data?.error || "Failed to delete vehicle");
      }
    }
  };

  const toggleVehicleStatus = async (id: number) => {
    try {
      await fleetAPI.toggleStatus(id.toString());
      setSuccess("Vehicle status updated!");
      await loadVehicles();
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to update vehicle status");
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'sedan': return 'primary';
      case 'suv': return 'success';
      case 'limousine': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading fleet data...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>Fleet Management</h2>
                <p className="text-muted">Manage your vehicle fleet and pricing</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => handleShowModal()}
                className="d-flex align-items-center"
              >
                <Plus size={20} className="me-2" />
                Add Vehicle
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alerts */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center text-primary">
                      <Car size={30} />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Vehicles</p>
                      <Card.Title as="h4">{vehicles.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center text-success">
                      <Users size={30} />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Active Vehicles</p>
                      <Card.Title as="h4">{vehicles.filter(v => v.is_active).length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center text-warning">
                      <DollarSign size={30} />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Avg. Price</p>
                      <Card.Title as="h4">
                        ${vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.base_price, 0) / vehicles.length) : 0}
                      </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center text-info">
                      <Luggage size={30} />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Capacity</p>
                      <Card.Title as="h4">{vehicles.reduce((sum, v) => sum + v.capacity, 0)}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Vehicles Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h4">Vehicle List</Card.Title>
              </Card.Header>
              <Card.Body className="table-responsive">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Type</th>
                      <th>Capacity</th>
                      <th>Luggage</th>
                      <th>Price</th>
                      <th>Transfer Types</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          No vehicles found. Add your first vehicle to get started.
                        </td>
                      </tr>
                    ) : (
                      vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={vehicle.image_url} 
                                alt={vehicle.name}
                                className="rounded me-3"
                                style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/lovable-uploads/hero-home.jpg';
                                }}
                              />
                              <div>
                                <strong>{vehicle.name}</strong>
                                <br />
                                <small className="text-muted">{vehicle.description}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg={getTypeBadgeVariant(vehicle.type)} className="text-capitalize">
                              {vehicle.type}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Users size={16} className="me-2" />
                              {vehicle.capacity}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Luggage size={16} className="me-2" />
                              {vehicle.luggage_capacity}
                            </div>
                          </td>
                          <td>${vehicle.base_price}/hr</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {vehicle.transfer_types.map(type => (
                                <Badge key={type} bg="outline-secondary" className="text-capitalize">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td>
                            <Badge bg={vehicle.is_active ? 'success' : 'secondary'}>
                              {vehicle.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleShowModal(vehicle)}
                                title="Edit Vehicle"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => toggleVehicleStatus(vehicle.id)}
                                title={vehicle.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {vehicle.is_active ? '✓' : '✗'}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(vehicle.id)}
                                title="Delete Vehicle"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add/Edit Vehicle Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury Sedan"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="limousine">Limousine</option>
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price ($/hour) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Passenger Capacity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Luggage Capacity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="luggage_capacity"
                    value={formData.luggage_capacity}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/vehicle-image.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the vehicle features and benefits..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Transfer Types</Form.Label>
              <div>
                {['one-way', 'round-trip', 'hourly'].map(type => (
                  <Form.Check
                    key={type}
                    type="checkbox"
                    id={`transfer-${type}`}
                    label={type.replace('-', ' ').toUpperCase()}
                    checked={formData.transfer_types.includes(type)}
                    onChange={() => handleTransferTypeChange(type)}
                    className="mb-2"
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Features {' '}
                <Button variant="outline-primary" size="sm" onClick={addFeatureField}>
                  <Plus size={14} />
                </Button>
              </Form.Label>
              {formData.features.map((feature, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFeatureField(index)}
                      className="ms-2"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </Form.Group>

            <Form.Check
              type="checkbox"
              id="is_active"
              label="Active Vehicle"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="me-2" />
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default FleetManagement;