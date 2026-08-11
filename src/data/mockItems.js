/**
 * mockItems.js – Realistic sample data for Lost & Found items.
 *
 * Shape of each item mirrors the future Supabase `items` table.
 * When Supabase is connected, replace these imports with real API calls.
 *
 * Fields:
 *   id          – unique identifier (will be UUID in DB)
 *   type        – 'found' | 'lost'
 *   title       – short item name
 *   category    – item category
 *   description – longer description
 *   location    – where it was found/lost
 *   date        – ISO date string
 *   status      – 'open' | 'claimed' | 'returned'
 *   imageUrl    – placeholder image (use Supabase Storage URL later)
 *   reportedBy  – display name of the reporter
 */

export const mockItems = [
  {
    id: '1',
    type: 'found',
    title: 'Black Wallet',
    category: 'Accessories',
    description:
      'Found a black leather bifold wallet near the main canteen. Contains some cash and a few cards. No ID visible.',
    location: 'Main Canteen, Block A',
    date: '2026-08-10',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=400&q=80',
    reportedBy: 'Arjun M.',
  },
  {
    id: '2',
    type: 'found',
    title: 'Wireless Earbuds',
    category: 'Electronics',
    description:
      'Found a pair of white wireless earbuds (looks like AirPods Pro) on a bench near the library entrance. Case included.',
    location: 'Library, Ground Floor',
    date: '2026-08-09',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&q=80',
    reportedBy: 'Priya K.',
  },
  {
    id: '3',
    type: 'found',
    title: 'Scientific Calculator',
    category: 'Stationery',
    description:
      'Casio FX-991EX found in Classroom 204, Block C after a lab session. Name is not written on it.',
    location: 'Classroom 204, Block C',
    date: '2026-08-08',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
    reportedBy: 'Rohit S.',
  },
  {
    id: '4',
    type: 'found',
    title: 'Blue Water Bottle',
    category: 'Personal Items',
    description:
      'A steel blue Milton water bottle found at the basketball court. Has a small MIT sticker on the side.',
    location: 'Basketball Court',
    date: '2026-08-07',
    status: 'claimed',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    reportedBy: 'Sneha R.',
  },
  {
    id: '5',
    type: 'lost',
    title: 'Student ID Card',
    category: 'Documents',
    description:
      'Lost my MIT Bengaluru student ID card somewhere between the hostel and the admin block. Very urgent – need for exams.',
    location: 'Hostel → Admin Block',
    date: '2026-08-11',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&q=80',
    reportedBy: 'Karan T.',
  },
  {
    id: '6',
    type: 'lost',
    title: 'Laptop Charger (Dell)',
    category: 'Electronics',
    description:
      'Lost a Dell 65W laptop charger (black, brick-style) in the CS lab. Has a small piece of yellow tape near the plug.',
    location: 'CS Lab, Block B',
    date: '2026-08-10',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
    reportedBy: 'Divya N.',
  },
  {
    id: '7',
    type: 'found',
    title: 'Spiral Notebook',
    category: 'Stationery',
    description:
      'Found a red spiral notebook with Physics notes. Left in the seminar hall after the guest lecture.',
    location: 'Seminar Hall, Block D',
    date: '2026-08-06',
    status: 'returned',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80',
    reportedBy: 'Aditya V.',
  },
  {
    id: '8',
    type: 'lost',
    title: 'Prescription Glasses',
    category: 'Accessories',
    description:
      'Lost my glasses with a black rectangular frame. They are in a brown hard case with a cloth inside.',
    location: 'Near Parking Lot',
    date: '2026-08-09',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
    reportedBy: 'Meera J.',
  },
]

/** Categories for use in search filters */
export const categories = [
  'All',
  'Electronics',
  'Accessories',
  'Stationery',
  'Documents',
  'Personal Items',
  'Clothing',
  'Other',
]
