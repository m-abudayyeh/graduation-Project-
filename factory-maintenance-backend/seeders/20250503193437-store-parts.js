'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('StoreParts', [
      {
        name: 'Hydraulic Cylinder',
        partNumber: 'HC-2045',
        category: 'Hydraulic Components',
        description: 'Heavy-duty hydraulic cylinder with 2000 PSI rating, suitable for industrial machinery.',
        image: 'hydraulic_cylinder.jpg',
        location: 'Warehouse A, Shelf 3',
        quantity: 15,
        notes: 'Compatible with XYZ series machinery',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Electric Motor',
        partNumber: 'EM-5500',
        category: 'Electrical Components',
        description: '5.5kW three-phase electric motor, 1450 RPM, IP55 protection.',
        image: 'electric_motor.jpg',
        location: 'Warehouse B, Shelf 1',
        quantity: 8,
        notes: 'Used in conveyor systems',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Oil Filter',
        partNumber: 'OF-1020',
        category: 'Filters',
        description: 'High-efficiency oil filter for hydraulic systems, 10 micron filtration.',
        image: 'oil_filter.jpg',
        location: 'Warehouse A, Shelf 5',
        quantity: 35,
        notes: 'Regular replacement recommended every 500 hours',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Control Panel',
        partNumber: 'CP-3200',
        category: 'Control Systems',
        description: 'Touch-screen control panel with PLC integration, 10-inch display.',
        image: 'control_panel.jpg',
        location: 'Secure Storage, Room 2',
        quantity: 4,
        notes: 'Pre-programmed for production line 3',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bearing Assembly',
        partNumber: 'BA-4560',
        category: 'Mechanical Components',
        description: 'Sealed ball bearing assembly, suitable for high-speed applications.',
        image: 'bearing_assembly.jpg',
        location: 'Warehouse C, Cabinet 7',
        quantity: 50,
        notes: 'Greased and ready for installation',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pneumatic Valve',
        partNumber: 'PV-7800',
        category: 'Pneumatic Components',
        description: 'Solenoid-controlled pneumatic valve, 5/2 way, 24V DC.',
        image: 'pneumatic_valve.jpg',
        location: 'Warehouse A, Shelf 2',
        quantity: 12,
        notes: 'Compatible with standard pneumatic fittings',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Circuit Breaker',
        partNumber: 'CB-0032',
        category: 'Electrical Components',
        description: '32A three-phase circuit breaker with thermal and magnetic protection.',
        image: 'circuit_breaker.jpg',
        location: 'Warehouse B, Cabinet 3',
        quantity: 20,
        notes: 'DIN rail mountable',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Timing Belt',
        partNumber: 'TB-8550',
        category: 'Drive Components',
        description: 'Reinforced rubber timing belt, 85mm width, 5000mm length.',
        image: 'timing_belt.jpg',
        location: 'Warehouse C, Drawer 4',
        quantity: 7,
        notes: 'Used on packaging machines',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pressure Sensor',
        partNumber: 'PS-4200',
        category: 'Sensors',
        description: 'Digital pressure sensor with 4-20mA output, 0-100 bar range.',
        image: 'pressure_sensor.jpg',
        location: 'Clean Room, Cabinet 1',
        quantity: 15,
        notes: 'Calibration certificate included',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'PLC Module',
        partNumber: 'PLC-5560',
        category: 'Control Systems',
        description: 'Programmable Logic Controller module with 16 digital inputs and 8 digital outputs.',
        image: 'plc_module.jpg',
        location: 'Secure Storage, Room 2',
        quantity: 6,
        notes: 'Siemens compatible',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gear Reducer',
        partNumber: 'GR-1040',
        category: 'Mechanical Components',
        description: 'Worm gear reducer, 10:1 ratio, cast iron housing.',
        image: 'gear_reducer.jpg',
        location: 'Warehouse C, Shelf 8',
        quantity: 5,
        notes: 'Oil-filled, maintenance-free design',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Air Filter',
        partNumber: 'AF-2030',
        category: 'Filters',
        description: 'Compressed air filter element, 5 micron filtration, aluminum housing.',
        image: 'air_filter.jpg',
        location: 'Warehouse A, Shelf 5',
        quantity: 25,
        notes: 'Used in pneumatic systems',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Temperature Controller',
        partNumber: 'TC-9800',
        category: 'Control Systems',
        description: 'Digital temperature controller with PID functionality, range -50°C to 450°C.',
        image: 'temp_controller.jpg',
        location: 'Warehouse B, Cabinet 5',
        quantity: 10,
        notes: 'Includes K-type thermocouple',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Safety Relay',
        partNumber: 'SR-6070',
        category: 'Electrical Components',
        description: 'Safety relay for emergency stop circuits, dual-channel monitoring.',
        image: 'safety_relay.jpg',
        location: 'Warehouse B, Shelf 2',
        quantity: 14,
        notes: 'EN ISO 13849-1 compliant',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gasket Set',
        partNumber: 'GS-3590',
        category: 'Sealing Components',
        description: 'Complete gasket set for hydraulic pump assembly, includes O-rings and seals.',
        image: 'gasket_set.jpg',
        location: 'Warehouse A, Drawer 6',
        quantity: 18,
        notes: 'Heat and oil resistant materials',
        isDeleted: false,
        companyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StoreParts', null, {});
  }
};