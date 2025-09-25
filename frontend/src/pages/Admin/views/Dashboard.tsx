import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Badge,
  Table,
  Button
} from "react-bootstrap";
import { 
  Car, 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock,
  MapPin,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { bookingAPI } from "@/services/api";

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

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  averageBookingValue: number;
  revenueChange: number;
  bookingsChange: number;
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    averageBookingValue: 0,
    revenueChange: 0,
    bookingsChange: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('7days');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAll({ 
        limit: 100, // Get more bookings for stats
        page: 1 
      });
      
      const bookings = response.data.bookings || [];
      calculateStats(bookings);
      setRecentBookings(bookings.slice(0, 5)); // Show latest 5 bookings
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings: Booking[]) => {
    const now = new Date();
    const previousPeriodStart = subDays(now, getDaysFromRange(timeRange) * 2);
    const currentPeriodStart = subDays(now, getDaysFromRange(timeRange));
    
    const currentPeriodBookings = bookings.filter(booking => 
      new Date(booking.created_at) >= currentPeriodStart
    );
    
    const previousPeriodBookings = bookings.filter(booking => 
      new Date(booking.created_at) >= previousPeriodStart && 
      new Date(booking.created_at) < currentPeriodStart
    );

    const totalRevenue = currentPeriodBookings.reduce((sum, booking) => sum + booking.total_price, 0);
    const previousRevenue = previousPeriodBookings.reduce((sum, booking) => sum + booking.total_price, 0);
    
    const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const bookingsChange = previousPeriodBookings.length > 0 ? 
      ((currentPeriodBookings.length - previousPeriodBookings.length) / previousPeriodBookings.length) * 100 : 0;

    setStats({
      totalBookings: currentPeriodBookings.length,
      totalRevenue,
      pendingBookings: currentPeriodBookings.filter(b => b.status === 'pending').length,
      completedBookings: currentPeriodBookings.filter(b => b.status === 'completed').length,
      averageBookingValue: currentPeriodBookings.length > 0 ? totalRevenue / currentPeriodBookings.length : 0,
      revenueChange,
      bookingsChange
    });
  };

  const getDaysFromRange = (range: string) => {
    switch (range) {
      case '7days': return 7;
      case '30days': return 30;
      case '90days': return 90;
      default: return 7;
    }
  };

  const getRevenueData = () => {
    const days = getDaysFromRange(timeRange);
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayBookings = recentBookings.filter(booking => 
        format(new Date(booking.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      data.push({
        name: format(date, 'MMM dd'),
        revenue: dayBookings.reduce((sum, booking) => sum + booking.total_price, 0),
        bookings: dayBookings.length
      });
    }
    
    return data;
  };

  const getVehicleTypeData = () => {
    const types: { [key: string]: number } = {};
    
    recentBookings.forEach(booking => {
      types[booking.vehicle_type] = (types[booking.vehicle_type] || 0) + 1;
    });
    
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  };

  const getStatusData = () => {
    const statusCounts: { [key: string]: number } = {};
    
    recentBookings.forEach(booking => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, icon: Icon, change, changeType, subtitle }: any) => (
    <Card className="card-stats">
      <Card.Body>
        <Row>
          <Col xs="5">
            <div className="icon-big text-center">
              <Icon size={40} className={changeType === 'positive' ? 'text-success' : 'text-danger'} />
            </div>
          </Col>
          <Col xs="7">
            <div className="numbers">
              <p className="card-category">{title}</p>
              <Card.Title as="h4">{value}</Card.Title>
              <p className="card-category">
                <small>
                  {changeType === 'positive' ? <ArrowUp size={12} className="text-success" /> : <ArrowDown size={12} className="text-danger" />}
                  {Math.abs(change).toFixed(1)}% {subtitle}
                </small>
              </p>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid>
        {/* Time Range Selector */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-end">
              <Button
                variant={timeRange === '7days' ? 'primary' : 'outline-primary'}
                size="sm"
                className="me-2"
                onClick={() => setTimeRange('7days')}
              >
                7 Days
              </Button>
              <Button
                variant={timeRange === '30days' ? 'primary' : 'outline-primary'}
                size="sm"
                className="me-2"
                onClick={() => setTimeRange('30days')}
              >
                30 Days
              </Button>
              <Button
                variant={timeRange === '90days' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setTimeRange('90days')}
              >
                90 Days
              </Button>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row>
          <Col lg="3" sm="6" className="mb-4">
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={Calendar}
              change={stats.bookingsChange}
              changeType={stats.bookingsChange >= 0 ? 'positive' : 'negative'}
              subtitle="from previous period"
            />
          </Col>
          <Col lg="3" sm="6" className="mb-4">
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              change={stats.revenueChange}
              changeType={stats.revenueChange >= 0 ? 'positive' : 'negative'}
              subtitle="from previous period"
            />
          </Col>
          <Col lg="3" sm="6" className="mb-4">
            <StatCard
              title="Pending"
              value={stats.pendingBookings}
              icon={Clock}
              change={0}
              changeType="positive"
              subtitle="awaiting confirmation"
            />
          </Col>
          <Col lg="3" sm="6" className="mb-4">
            <StatCard
              title="Avg. Booking Value"
              value={`$${stats.averageBookingValue.toFixed(0)}`}
              icon={TrendingUp}
              change={0}
              changeType="positive"
              subtitle="per booking"
            />
          </Col>
        </Row>

        {/* Charts Row */}
        <Row className="mb-4">
          <Col lg="8" className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Revenue & Bookings Trend</Card.Title>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      name="Revenue ($)"
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#82ca9d" 
                      name="Bookings"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg="4" className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Vehicle Type Distribution</Card.Title>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getVehicleTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getVehicleTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Bookings & Status Chart */}
        <Row>
          <Col lg="8" className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Recent Bookings</Card.Title>
              </Card.Header>
              <Card.Body className="table-responsive">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Pickup</th>
                      <th>Date/Time</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No recent bookings found
                        </td>
                      </tr>
                    ) : (
                      recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div>
                              <strong>{booking.customer_name}</strong>
                              <br />
                              <small className="text-muted">{booking.customer_email}</small>
                            </div>
                          </td>
                          <td className="text-capitalize">{booking.vehicle_type}</td>
                          <td>
                            <small>
                              <MapPin size={12} className="me-1" />
                              {booking.pickup_address.split(',')[0]}
                            </small>
                          </td>
                          <td>
                            <small>
                              {format(new Date(booking.pickup_date), 'MMM dd')}
                              <br />
                              {booking.pickup_time}
                            </small>
                          </td>
                          <td>${booking.total_price}</td>
                          <td>
                            <Badge bg={getStatusVariant(booking.status)}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg="4" className="mb-4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Booking Status</Card.Title>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getStatusData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-3">
                  {getStatusData().map((status, index) => (
                    <div key={status.name} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-capitalize">{status.name}</span>
                      <Badge bg={getStatusVariant(status.name)}>{status.value}</Badge>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Stats Row */}
        {/* <Row>
          <Col md="4" className="mb-4">
            <Card className="bg-gradient-primary text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{stats.completedBookings}</h3>
                    <p className="mb-0">Completed Rides</p>
                  </div>
                  <Car size={40} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md="4" className="mb-4">
            <Card className="bg-gradient-success text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{stats.pendingBookings}</h3>
                    <p className="mb-0">Pending Confirmation</p>
                  </div>
                  <Clock size={40} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md="4" className="mb-4">
            <Card className="bg-gradient-info text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{Math.round(stats.averageBookingValue)}</h3>
                    <p className="mb-0">Avg. Ride Value</p>
                  </div>
                  <DollarSign size={40} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}
      </Container>
    </>
  );
}

export default Dashboard;