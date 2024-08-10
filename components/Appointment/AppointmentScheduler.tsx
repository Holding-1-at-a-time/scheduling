import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const appointments = useQuery(api.appointments.getAppointments, {
    date: format(selectedDate, "yyyy-MM-dd"),
  });
  const createAppointment = useMutation(api.appointments.createAppointment);
  const updateAppointment = useMutation(api.appointments.updateAppointment);
  const cancelAppointment = useMutation(api.appointments.cancelAppointment);

  const sortedAppointments = useMemo(() => {
    return (
      appointments?.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      ) || []
    );
  }, [appointments]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAppointmentCreate = async () => {
    try {
      await createAppointment({
        date: format(selectedDate, "yyyy-MM-dd"),
        time: "10:00 AM", // Default time, you might want to let the user choose
        service: "Full Detail",
        status: "Scheduled",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleAppointmentUpdate = async (appointment) => {
    try {
      await updateAppointment({
        id: appointment._id,
        status: "Completed",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleAppointmentCancel = async (appointment) => {
    try {
      await cancelAppointment({ id: appointment._id });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button variant="secondary" onClick={handleAppointmentCreate}>
          Create Appointment
        </Button>
      </header>
      <div className="flex-1 grid grid-cols-[1fr_2fr] gap-4 p-4">
        <div className="bg-background rounded-lg shadow-md p-4">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full"
          />
        </div>
        <div className="bg-background rounded-lg shadow-md p-4">
          <div className="mb-4">
            <span className="font-bold">Showing appointments for </span>
            {format(selectedDate, "MMMM d, yyyy")}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "Scheduled"
                          ? "secondary"
                          : appointment.status === "Completed"
                            ? "success"
                            : "destructive"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAppointmentUpdate(appointment)}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAppointmentCancel(appointment)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
