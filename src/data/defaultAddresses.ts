import { SavedAddress, CustomerAccount } from '../types';

export const DEFAULT_CUSTOMER: CustomerAccount = {
  id: 'cust-royal-01',
  name: 'Rafiqul Islam',
  phone: '01711223344',
  email: 'rafiqul.islam@royalessence.com',
  isLoggedIn: true,
};

export const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-01',
    customerId: 'cust-royal-01',
    label: 'Home',
    fullName: 'Rafiqul Islam',
    phone: '01711223344',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Banani',
    area: 'Block C, Near Banani Club',
    roadVillageHouse: 'House 14, Road 7, Flat 4A',
    postalCode: '1213',
    instructions: 'Ring bell 4A or call upon arrival. Fragile perfume flacon inside.',
    isDefault: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'addr-02',
    customerId: 'cust-royal-01',
    label: 'Office',
    fullName: 'Rafiqul Islam',
    phone: '01711223344',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Gulshan',
    area: 'Gulshan-1 Circle',
    roadVillageHouse: 'Crystal Palace, Level 5, SE(F) 9 Gulshan South Avenue',
    postalCode: '1212',
    instructions: 'Deliver to Level 5 Executive Reception during office hours (9 AM – 6 PM).',
    isDefault: false,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];
