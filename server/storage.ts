import { 
  Customer, 
  InsertCustomer, 
  Equipment, 
  InsertEquipment, 
  ServiceCall, 
  InsertServiceCall,
  MaintenanceSchedule,
  InsertMaintenanceSchedule
} from "@shared/schema";

export interface IStorage {
  // Customer methods
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  searchCustomers(searchTerm: string): Promise<Customer[]>;

  // Equipment methods
  getEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: number): Promise<Equipment | undefined>;
  getEquipmentByCustomer(customerId: number): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number): Promise<boolean>;

  // Service Call methods
  getServiceCalls(): Promise<ServiceCall[]>;
  getServiceCall(id: number): Promise<ServiceCall | undefined>;
  getServiceCallsByCustomer(customerId: number): Promise<ServiceCall[]>;
  getServiceCallsByEquipment(equipmentId: number): Promise<ServiceCall[]>;
  createServiceCall(serviceCall: InsertServiceCall): Promise<ServiceCall>;
  updateServiceCall(id: number, serviceCall: Partial<InsertServiceCall>): Promise<ServiceCall | undefined>;
  deleteServiceCall(id: number): Promise<boolean>;
  getRecentServiceCalls(limit?: number): Promise<ServiceCall[]>;

  // Maintenance Schedule methods
  getMaintenanceSchedules(): Promise<MaintenanceSchedule[]>;
  getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined>;
  getMaintenanceSchedulesByEquipment(equipmentId: number): Promise<MaintenanceSchedule[]>;
  createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule>;
  updateMaintenanceSchedule(id: number, schedule: Partial<InsertMaintenanceSchedule>): Promise<MaintenanceSchedule | undefined>;
  deleteMaintenanceSchedule(id: number): Promise<boolean>;
  getOverdueMaintenanceSchedules(): Promise<MaintenanceSchedule[]>;

  // Dashboard/Analytics methods
  getDashboardStats(): Promise<{
    totalCustomers: number;
    activeEquipment: number;
    monthlyServiceCalls: number;
    pendingMaintenance: number;
  }>;
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer> = new Map();
  private equipment: Map<number, Equipment> = new Map();
  private serviceCalls: Map<number, ServiceCall> = new Map();
  private maintenanceSchedules: Map<number, MaintenanceSchedule> = new Map();
  private currentCustomerId = 1;
  private currentEquipmentId = 1;
  private currentServiceCallId = 1;
  private currentMaintenanceScheduleId = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample customers
    const customer1: Customer = {
      id: this.currentCustomerId++,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      address: "123 Oak Street",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      preferredContact: "phone",
      notes: "Prefers morning appointments",
      status: "active",
      createdAt: new Date(),
    };

    const customer2: Customer = {
      id: this.currentCustomerId++,
      firstName: "Mike",
      lastName: "Rodriguez",
      email: "mike.rodriguez@email.com",
      phone: "(555) 987-6543",
      address: "456 Pine Avenue",
      city: "Plano",
      state: "TX",
      zipCode: "75024",
      preferredContact: "email",
      notes: "Commercial property",
      status: "active",
      createdAt: new Date(),
    };

    this.customers.set(customer1.id, customer1);
    this.customers.set(customer2.id, customer2);

    // Sample equipment
    const equipment1: Equipment = {
      id: this.currentEquipmentId++,
      customerId: customer1.id,
      type: "Heat Pump",
      brand: "Carrier",
      model: "XYZ123",
      serialNumber: "HP123456",
      installationDate: new Date("2019-05-15"),
      warrantyExpiry: new Date("2024-05-15"),
      location: "Main floor",
      notes: "3-ton unit",
      status: "active",
      createdAt: new Date(),
    };

    this.equipment.set(equipment1.id, equipment1);

    // Sample service call
    const serviceCall1: ServiceCall = {
      id: this.currentServiceCallId++,
      customerId: customer1.id,
      equipmentId: equipment1.id,
      type: "maintenance",
      priority: "medium",
      status: "completed",
      scheduledDate: new Date("2024-03-15T14:30:00"),
      completedDate: new Date("2024-03-15T16:00:00"),
      description: "Annual maintenance check",
      workPerformed: "Filter replacement, system inspection, refrigerant check",
      partsUsed: "Air filter",
      laborHours: "1.5",
      totalCost: "150.00",
      technician: "John Smith",
      notes: "All systems operating normally",
      createdAt: new Date(),
    };

    this.serviceCalls.set(serviceCall1.id, serviceCall1);
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const customer: Customer = {
      ...customerData,
      id: this.currentCustomerId++,
      createdAt: new Date(),
    };
    this.customers.set(customer.id, customer);
    return customer;
  }

  async updateCustomer(id: number, customerData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existing = this.customers.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...customerData };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  async searchCustomers(searchTerm: string): Promise<Customer[]> {
    const term = searchTerm.toLowerCase();
    return Array.from(this.customers.values()).filter(customer =>
      customer.firstName.toLowerCase().includes(term) ||
      customer.lastName.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone.includes(term) ||
      customer.address.toLowerCase().includes(term)
    );
  }

  // Equipment methods
  async getEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipmentById(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async getEquipmentByCustomer(customerId: number): Promise<Equipment[]> {
    return Array.from(this.equipment.values()).filter(eq => eq.customerId === customerId);
  }

  async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
    const equipment: Equipment = {
      ...equipmentData,
      id: this.currentEquipmentId++,
      createdAt: new Date(),
    };
    this.equipment.set(equipment.id, equipment);
    return equipment;
  }

  async updateEquipment(id: number, equipmentData: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const existing = this.equipment.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...equipmentData };
    this.equipment.set(id, updated);
    return updated;
  }

  async deleteEquipment(id: number): Promise<boolean> {
    return this.equipment.delete(id);
  }

  // Service Call methods
  async getServiceCalls(): Promise<ServiceCall[]> {
    return Array.from(this.serviceCalls.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getServiceCall(id: number): Promise<ServiceCall | undefined> {
    return this.serviceCalls.get(id);
  }

  async getServiceCallsByCustomer(customerId: number): Promise<ServiceCall[]> {
    return Array.from(this.serviceCalls.values()).filter(sc => sc.customerId === customerId);
  }

  async getServiceCallsByEquipment(equipmentId: number): Promise<ServiceCall[]> {
    return Array.from(this.serviceCalls.values()).filter(sc => sc.equipmentId === equipmentId);
  }

  async createServiceCall(serviceCallData: InsertServiceCall): Promise<ServiceCall> {
    const serviceCall: ServiceCall = {
      ...serviceCallData,
      id: this.currentServiceCallId++,
      createdAt: new Date(),
    };
    this.serviceCalls.set(serviceCall.id, serviceCall);
    return serviceCall;
  }

  async updateServiceCall(id: number, serviceCallData: Partial<InsertServiceCall>): Promise<ServiceCall | undefined> {
    const existing = this.serviceCalls.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...serviceCallData };
    this.serviceCalls.set(id, updated);
    return updated;
  }

  async deleteServiceCall(id: number): Promise<boolean> {
    return this.serviceCalls.delete(id);
  }

  async getRecentServiceCalls(limit: number = 10): Promise<ServiceCall[]> {
    const calls = await this.getServiceCalls();
    return calls.slice(0, limit);
  }

  // Maintenance Schedule methods
  async getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
    return Array.from(this.maintenanceSchedules.values());
  }

  async getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined> {
    return this.maintenanceSchedules.get(id);
  }

  async getMaintenanceSchedulesByEquipment(equipmentId: number): Promise<MaintenanceSchedule[]> {
    return Array.from(this.maintenanceSchedules.values()).filter(ms => ms.equipmentId === equipmentId);
  }

  async createMaintenanceSchedule(scheduleData: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    const schedule: MaintenanceSchedule = {
      ...scheduleData,
      id: this.currentMaintenanceScheduleId++,
      createdAt: new Date(),
    };
    this.maintenanceSchedules.set(schedule.id, schedule);
    return schedule;
  }

  async updateMaintenanceSchedule(id: number, scheduleData: Partial<InsertMaintenanceSchedule>): Promise<MaintenanceSchedule | undefined> {
    const existing = this.maintenanceSchedules.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...scheduleData };
    this.maintenanceSchedules.set(id, updated);
    return updated;
  }

  async deleteMaintenanceSchedule(id: number): Promise<boolean> {
    return this.maintenanceSchedules.delete(id);
  }

  async getOverdueMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
    const now = new Date();
    return Array.from(this.maintenanceSchedules.values()).filter(ms => 
      ms.isActive && new Date(ms.nextDue) < now
    );
  }

  // Dashboard/Analytics methods
  async getDashboardStats(): Promise<{
    totalCustomers: number;
    activeEquipment: number;
    monthlyServiceCalls: number;
    pendingMaintenance: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalCustomers = this.customers.size;
    const activeEquipment = Array.from(this.equipment.values()).filter(eq => eq.status === "active").length;
    const monthlyServiceCalls = Array.from(this.serviceCalls.values()).filter(sc => 
      new Date(sc.createdAt) >= startOfMonth
    ).length;
    const pendingMaintenance = (await this.getOverdueMaintenanceSchedules()).length;

    return {
      totalCustomers,
      activeEquipment,
      monthlyServiceCalls,
      pendingMaintenance,
    };
  }
}

export const storage = new MemStorage();
