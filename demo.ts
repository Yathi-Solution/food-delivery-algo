import { deliveryOrchestrator } from './main.js';
import { Order, Pilot } from './interfaces/order.interface.js';

// Sample data for demonstration
const sampleOrders: Order[] = [
  {
    id: 'order-1',
    block: 'A',
    tower: 'A1',
    type: 'hot',
    readyInMinutes: 5
  },
  {
    id: 'order-2',
    block: 'A',
    tower: 'A2',
    type: 'icecream',
    readyInMinutes: 8
  },
  {
    id: 'order-3',
    block: 'B',
    tower: 'B1',
    type: 'frozen',
    readyInMinutes: 12
  },
  {
    id: 'order-4',
    block: 'C',
    tower: 'C1',
    type: 'packed',
    readyInMinutes: 15
  }
];

const samplePilots: Pilot[] = [
  {
    id: 'pilot-1',
    capacity: 3,
    currentBatch: [],
    location: 'A-A1'
  },
  {
    id: 'pilot-2',
    capacity: 2,
    currentBatch: [],
    location: 'B-B1'
  }
];

async function runDemo() {
  console.log('🚀 Delivery App Demo');
  console.log('==================');
  
  console.log('\n📦 Sample Orders:');
  sampleOrders.forEach(order => {
    console.log(`  - ${order.id}: ${order.type} at ${order.block}-${order.tower} (ready in ${order.readyInMinutes}min)`);
  });
  
  console.log('\n👨‍✈️ Available Pilots:');
  samplePilots.forEach(pilot => {
    console.log(`  - ${pilot.id}: capacity ${pilot.capacity}, location ${pilot.location}`);
  });
  
  console.log('\n⚙️ Running Delivery Orchestrator...');
  
  try {
    const results = await deliveryOrchestrator(
      sampleOrders,
      samplePilots,
      20, // 20 minute time window
      0   // current time = 0
    );
    
    console.log('\n✅ Delivery Results:');
    console.log('===================');
    
    console.log('\n📋 Pilot Assignments:');
    Object.entries(results.assignments).forEach(([pilotId, batchKey]) => {
      console.log(`  - ${pilotId} → ${batchKey}`);
    });
    
    console.log('\n🗺️ Pilot Routes:');
    Object.entries(results.pilotRoutes).forEach(([pilotId, orderIds]) => {
      console.log(`  - ${pilotId}: ${orderIds.join(' → ')}`);
    });
    
    console.log('\n🎯 Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running demo:', error);
  }
}

// Run the demo
runDemo();
