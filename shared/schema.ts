import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  preferredContact: text("preferred_contact").default("phone"),
  notes: text("notes"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  type: text("type").notNull(), // AC, Heat Pump, Furnace, etc.
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  serialNumber: text("serial_number"),
  installationDate: timestamp("installation_date"),
  warrantyExpiry: timestamp("warranty_expiry"),
  location: text("location"), // e.g., "Main floor", "Basement"
  notes: text("notes"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const serviceCalls = pgTable("service_calls", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  equipmentId: integer("equipment_id"),
  type: text("type").notNull(), // maintenance, repair, installation, emergency
  priority: text("priority").default("medium"), // low, medium, high, urgent
  status: text("status").default("scheduled"), // scheduled, in_progress, completed, cancelled
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  description: text("description").notNull(),
  workPerformed: text("work_performed"),
  partsUsed: text("parts_used"),
  laborHours: decimal("labor_hours", { precision: 4, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  technician: text("technician"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  type: text("type").notNull(), // annual, seasonal, filter_change
  frequency: text("frequency").notNull(), // monthly, quarterly, annually
  lastPerformed: timestamp("last_performed"),
  nextDue: timestamp("next_due").notNull(),
  isActive: boolean("is_active").default(true),
  reminderSent: boolean("reminder_sent").default(false),
  autoReminder: boolean("auto_reminder").default(true),
  reminderDays: integer("reminder_days").default(7),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  equipmentId: integer("equipment_id"),
  serviceCallId: integer("service_call_id"),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  technician: text("technician"),
  status: text("status").default("scheduled"), // scheduled, confirmed, in_progress, completed, cancelled
  googleEventId: text("google_event_id"),
  reminderSent: boolean("reminder_sent").default(false),
  customerNotified: boolean("customer_notified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // maintenance_due, appointment_reminder, warranty_expiring
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  customerId: integer("customer_id"),
  equipmentId: integer("equipment_id"),
  appointmentId: integer("appointment_id"),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  createdAt: true,
});

export const insertServiceCallSchema = createInsertSchema(serviceCalls).omit({
  id: true,
  createdAt: true,
});

export const insertMaintenanceScheduleSchema = createInsertSchema(maintenanceSchedules).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;

export type ServiceCall = typeof serviceCalls.$inferSelect;
export type InsertServiceCall = z.infer<typeof insertServiceCallSchema>;

export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type InsertMaintenanceSchedule = z.infer<typeof insertMaintenanceScheduleSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
