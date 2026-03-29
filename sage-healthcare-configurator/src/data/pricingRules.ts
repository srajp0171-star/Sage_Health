export const PRICING_RULES = {
  bundles: [
    {
      id:        'starter_bundle',
      name:      'Starter Clinic Bundle',
      moduleIds: ['base_digital_presence', 'online_booking', 'admin_panel'],
      discountPct: 5,
      label:     '5% off — Complete Core Setup (Under ₹50k)',
    },
    {
      id:        'digital_clinic',
      name:      'Digital Clinic Package',
      moduleIds: ['base_digital_presence', 'online_booking', 'admin_panel', 'billing_invoicing', 'digital_rx'],
      discountPct: 15,
      label:     '15% off — Full Digital Clinic Plus Pack',
    },
    {
      id:        'telemedicine_bundle',
      name:      'Telemedicine Bundle',
      moduleIds: ['teleconsultation', 'digital_rx', 'patient_portal'],
      discountPct: 10,
      label:     '10% off — Complete Telemedicine Suite',
    },
  ],

  volumeDiscounts: [
    { minTotal: 100000, maxTotal: 149999,   discountPct: 5,  label: '5% for projects above ₹1L' },
    { minTotal: 150000, maxTotal: 249999,   discountPct: 8,  label: '8% for projects above ₹1.5L' },
    { minTotal: 250000, maxTotal: Infinity,  discountPct: 12, label: '12% for projects above ₹2.5L' },
  ],

  gstPct: 18,
  showGstSeparately: true,
  defaultAmortizationMonths: 36,
}
