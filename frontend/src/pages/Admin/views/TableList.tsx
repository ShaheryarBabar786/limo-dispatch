import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
  Form,
  Pagination,
  Spinner,
  Alert,
  Modal
} from "react-bootstrap";
import { bookingAPI } from "@/services/api";
import { MessageCircle, Copy, CheckCircle, Eye, Trash2 } from "lucide-react";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_address: string;
  destination_address: string;
  pickup_date: string;
  pickup_time: string;
  vehicle_type: string;
  passengers: number;
  special_requests: string;
  total_price: number;
  status: string;
  created_at: string;
}

function TableList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  const fetchBookings = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      setError("");
      const response = await bookingAPI.getAll({
        page,
        limit: 10,
        status: status === "all" ? undefined : status,
        search: search || undefined,
      });
      
      setBookings(response.data.bookings || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalBookings(response.data.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
      fetchBookings(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update booking status.");
    }
  };

  const generateWhatsAppMessage = (booking: Booking) => {
    const message = `🚗 *NEW BOOKING REQUEST* 🚗

*CUSTOMER DETAILS:*
👤 Name: ${booking.customer_name}
📧 Email: ${booking.customer_email}
📞 Phone: ${booking.customer_phone}

*TRIP DETAILS:*
📍 Pickup: ${booking.pickup_address}
🎯 Destination: ${booking.destination_address}
📅 Date: ${new Date(booking.pickup_date).toLocaleDateString()}
⏰ Time: ${booking.pickup_time}

*VEHICLE REQUIREMENTS:*
🚘 Type: ${booking.vehicle_type}
👥 Passengers: ${booking.passengers}
💰 Price: $${booking.total_price}

${booking.special_requests ? `*SPECIAL REQUESTS:*\n${booking.special_requests}` : ''}

*Status:* ${booking.status.toUpperCase()}
*Booking ID:* ${booking.id.slice(-8).toUpperCase()}
*Received:* ${new Date(booking.created_at).toLocaleString()}`;

    return message;
  };

  const handleWhatsAppClick = async (booking: Booking) => {
    try {
      const message = generateWhatsAppMessage(booking);
      await navigator.clipboard.writeText(message);
      setCopiedBookingId(booking.id);
      
      setTimeout(() => {
        setCopiedBookingId(null);
      }, 2000);
      
      // Optional: Auto-open WhatsApp
      const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      // Fallback: show message in alert
      const message = generateWhatsAppMessage(booking);
      alert("Booking details:\n\n" + message);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await bookingAPI.delete(bookingId);
        fetchBookings(currentPage, searchTerm, statusFilter);
      } catch (error) {
        console.error("Error deleting booking:", error);
        setError("Failed to delete booking.");
      }
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && bookings.length === 0) {
    return (
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body className="text-center py-5">
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading bookings...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">
                  Booking Management
                  {totalBookings > 0 && (
                    <Badge bg="primary" className="ms-2">
                      {totalBookings} Total
                    </Badge>
                  )}
                </Card.Title>
                <p className="card-category">
                  Manage all customer bookings and send to WhatsApp
                </p>
                
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}

                {/* Filters and Search */}
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Search by customer name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            fetchBookings(1, searchTerm, statusFilter);
                          }
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          fetchBookings(1, searchTerm, e.target.value);
                        }}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary"
                        onClick={() => fetchBookings(1, searchTerm, statusFilter)}
                      >
                        Search
                      </Button>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          fetchBookings(1, "", "all");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Booking ID</th>
                      <th className="border-0">Customer</th>
                      <th className="border-0">Contact</th>
                      <th className="border-0">Pickup → Destination</th>
                      <th className="border-0">Date & Time</th>
                      <th className="border-0">Vehicle</th>
                      <th className="border-0">Price</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-4">
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "No bookings found"
                          )}
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <small className="text-muted">#{booking.id.slice(-8).toUpperCase()}</small>
                            <br />
                            <small>{formatDateTime(booking.created_at)}</small>
                          </td>
                          <td>
                            <strong>{booking.customer_name}</strong>
                            <br />
                            <small className="text-muted">{booking.customer_email}</small>
                          </td>
                          <td>{booking.customer_phone}</td>
                          <td>
                            <div>
                              <small>
                                <strong>From:</strong> {booking.pickup_address}
                              </small>
                              <br />
                              <small>
                                <strong>To:</strong> {booking.destination_address}
                              </small>
                            </div>
                          </td>
                          <td>
                            {formatDate(booking.pickup_date)}
                            <br />
                            <small className="text-muted">{booking.pickup_time}</small>
                          </td>
                          <td>
                            <span className="text-capitalize">{booking.vehicle_type}</span>
                            <br />
                            <small>👥 {booking.passengers} passengers</small>
                          </td>
                          <td>
                            <strong>${booking.total_price}</strong>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(booking.status)}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1 flex-wrap">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleWhatsAppClick(booking)}
                                title="Send to WhatsApp"
                                className="mb-1"
                              >
                                {copiedBookingId === booking.id ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <MessageCircle size={14} />
                                )}
                              </Button>
                              
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleViewDetails(booking)}
                                title="View Details"
                                className="mb-1"
                              >
                                <Eye size={14} />
                              </Button>
                              
                              <Form.Select
                                size="sm"
                                style={{width: '120px'}}
                                value={booking.status}
                                onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                className="mb-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </Form.Select>
                              
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteBooking(booking.id)}
                                title="Delete Booking"
                                className="mb-1"
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
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <small className="text-muted">
                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalBookings)} of {totalBookings} bookings
                      </small>
                    </div>
                    <Pagination>
                      <Pagination.First 
                        disabled={currentPage === 1}
                        onClick={() => fetchBookings(1, searchTerm, statusFilter)}
                      />
                      <Pagination.Prev 
                        disabled={currentPage === 1}
                        onClick={() => fetchBookings(currentPage - 1, searchTerm, statusFilter)}
                      />
                      
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = index + 1;
                        } else if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }
                        
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => fetchBookings(pageNum, searchTerm, statusFilter)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      })}
                      
                      <Pagination.Next 
                        disabled={currentPage === totalPages}
                        onClick={() => fetchBookings(currentPage + 1, searchTerm, statusFilter)}
                      />
                      <Pagination.Last 
                        disabled={currentPage === totalPages}
                        onClick={() => fetchBookings(totalPages, searchTerm, statusFilter)}
                      />
                    </Pagination>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Booking Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <h6>Customer Information</h6>
                <p><strong>Name:</strong> {selectedBooking.customer_name}</p>
                <p><strong>Email:</strong> {selectedBooking.customer_email}</p>
                <p><strong>Phone:</strong> {selectedBooking.customer_phone}</p>
                
                <h6 className="mt-3">Trip Details</h6>
                <p><strong>Pickup:</strong> {selectedBooking.pickup_address}</p>
                <p><strong>Destination:</strong> {selectedBooking.destination_address}</p>
                <p><strong>Date:</strong> {formatDate(selectedBooking.pickup_date)}</p>
                <p><strong>Time:</strong> {selectedBooking.pickup_time}</p>
              </Col>
              <Col md={6}>
                <h6>Vehicle Information</h6>
                <p><strong>Type:</strong> {selectedBooking.vehicle_type}</p>
                <p><strong>Passengers:</strong> {selectedBooking.passengers}</p>
                <p><strong>Total Price:</strong> ${selectedBooking.total_price}</p>
                
                <h6 className="mt-3">Status & Timing</h6>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge bg={getStatusVariant(selectedBooking.status)}>
                    {selectedBooking.status.toUpperCase()}
                  </Badge>
                </p>
                <p><strong>Booking Created:</strong> {formatDateTime(selectedBooking.created_at)}</p>
                
                {selectedBooking.special_requests && (
                  <>
                    <h6 className="mt-3">Special Requests</h6>
                    <p>{selectedBooking.special_requests}</p>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={() => selectedBooking && handleWhatsAppClick(selectedBooking)}>
            <MessageCircle size={16} className="me-2" />
            Send to WhatsApp
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TableList;