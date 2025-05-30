import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertEquipmentSchema, insertServiceCallSchema, insertMaintenanceScheduleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const customers = await storage.searchCustomers(q);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validation = insertCustomerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid customer data", errors: validation.error.errors });
      }
      const customer = await storage.createCustomer(validation.data);
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertCustomerSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid customer data", errors: validation.error.errors });
      }
      const customer = await storage.updateCustomer(id, validation.data);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCustomer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Equipment routes
  app.get("/api/equipment", async (req, res) => {
    try {
      const equipment = await storage.getEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.get("/api/equipment/customer/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const equipment = await storage.getEquipmentByCustomer(customerId);
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer equipment" });
    }
  });

  app.get("/api/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const equipment = await storage.getEquipmentById(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.post("/api/equipment", async (req, res) => {
    try {
      const validation = insertEquipmentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid equipment data", errors: validation.error.errors });
      }
      const equipment = await storage.createEquipment(validation.data);
      res.status(201).json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });

  app.put("/api/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertEquipmentSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid equipment data", errors: validation.error.errors });
      }
      const equipment = await storage.updateEquipment(id, validation.data);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });

  app.delete("/api/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEquipment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete equipment" });
    }
  });

  // Service Call routes
  app.get("/api/service-calls", async (req, res) => {
    try {
      const serviceCalls = await storage.getServiceCalls();
      res.json(serviceCalls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service calls" });
    }
  });

  app.get("/api/service-calls/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const serviceCalls = await storage.getRecentServiceCalls(limit);
      res.json(serviceCalls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent service calls" });
    }
  });

  app.get("/api/service-calls/customer/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const serviceCalls = await storage.getServiceCallsByCustomer(customerId);
      res.json(serviceCalls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer service calls" });
    }
  });

  app.get("/api/service-calls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceCall = await storage.getServiceCall(id);
      if (!serviceCall) {
        return res.status(404).json({ message: "Service call not found" });
      }
      res.json(serviceCall);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service call" });
    }
  });

  app.post("/api/service-calls", async (req, res) => {
    try {
      const validation = insertServiceCallSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid service call data", errors: validation.error.errors });
      }
      const serviceCall = await storage.createServiceCall(validation.data);
      res.status(201).json(serviceCall);
    } catch (error) {
      res.status(500).json({ message: "Failed to create service call" });
    }
  });

  app.put("/api/service-calls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertServiceCallSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid service call data", errors: validation.error.errors });
      }
      const serviceCall = await storage.updateServiceCall(id, validation.data);
      if (!serviceCall) {
        return res.status(404).json({ message: "Service call not found" });
      }
      res.json(serviceCall);
    } catch (error) {
      res.status(500).json({ message: "Failed to update service call" });
    }
  });

  app.delete("/api/service-calls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteServiceCall(id);
      if (!deleted) {
        return res.status(404).json({ message: "Service call not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service call" });
    }
  });

  // Maintenance Schedule routes
  app.get("/api/maintenance-schedules", async (req, res) => {
    try {
      const schedules = await storage.getMaintenanceSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance schedules" });
    }
  });

  app.get("/api/maintenance-schedules/overdue", async (req, res) => {
    try {
      const overdueSchedules = await storage.getOverdueMaintenanceSchedules();
      res.json(overdueSchedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overdue maintenance schedules" });
    }
  });

  app.post("/api/maintenance-schedules", async (req, res) => {
    try {
      const validation = insertMaintenanceScheduleSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid maintenance schedule data", errors: validation.error.errors });
      }
      const schedule = await storage.createMaintenanceSchedule(validation.data);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to create maintenance schedule" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
