import { useEffect, useState, useCallback, memo } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { userService } from '../../services/userService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { SkeletonList } from '../../components/Skeleton';
import { SwipeableItem } from '../../components/SwipeableItem';
import { PullToRefresh } from '../../components/PullToRefresh';
import { format } from 'date-fns';
import { Calendar, Clock, User, X } from 'lucide-react';

// Memoized appointment card for performance
const AppointmentCard = memo(({ appointment, onCancel, getStatusColor }) => (
  <CardContent className="pt-6">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold">
            Dr. {appointment.doctor?.name}
          </span>
          {appointment.doctor?.specialization && (
            <span className="text-sm text-muted-foreground">
              - {appointment.doctor.specialization}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-5 w-5" />
            <span>{format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-5 w-5" />
            <span>{appointment.appointmentTime}</span>
          </div>
        </div>
        {appointment.reason && (
          <p className="text-sm">{appointment.reason}</p>
        )}
        {appointment.symptoms && (
          <p className="text-sm text-muted-foreground">
            Symptoms: {appointment.symptoms}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end space-y-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(appointment._id)}
            className="hidden md:flex"
            aria-label="Cancel appointment"
          >
            <X className="h-5 w-5 mr-1" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  </CardContent>
));

AppointmentCard.displayName = 'AppointmentCard';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openSwipeId, setOpenSwipeId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    symptoms: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      }
      const { appointments: data } = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    await fetchAppointments(true);
  }, [fetchAppointments]);

  const fetchDoctors = async () => {
    try {
      const { users } = await userService.getAll({ role: 'doctor' });
      setDoctors(users);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create(formData);
      setShowForm(false);
      setFormData({
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        symptoms: '',
      });
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handleCancel = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.update(id, { status: 'cancelled' });
        setOpenSwipeId(null);
        fetchAppointments();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel appointment');
      }
    }
  }, [fetchAppointments]);

  const handleSwipeOpenChange = useCallback((id, isOpen) => {
    setOpenSwipeId(isOpen ? id : null);
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground mt-2">Manage your medical appointments</p>
          </div>
        </div>
        <SkeletonList count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground mt-2">Manage your medical appointments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          Book Appointment
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Book New Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <select
                    id="doctor"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Date</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentTime">Time</Label>
                  <Input
                    id="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Brief reason for visit"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms (Optional)</Label>
                <textarea
                  id="symptoms"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Describe your symptoms..."
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Book Appointment</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No appointments found</p>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => {
              const canCancel = appointment.status !== 'cancelled' && appointment.status !== 'completed';
              return (
                <SwipeableItem
                  key={appointment._id}
                  isOpen={openSwipeId === appointment._id}
                  onOpenChange={(isOpen) => handleSwipeOpenChange(appointment._id, isOpen)}
                  onDelete={() => handleCancel(appointment._id)}
                  disabled={!canCancel}
                >
                  <Card>
                    <AppointmentCard
                      appointment={appointment}
                      onCancel={handleCancel}
                      getStatusColor={getStatusColor}
                    />
                  </Card>
                </SwipeableItem>
              );
            })
          )}
        </div>
      </PullToRefresh>
    </div>
  );
};

