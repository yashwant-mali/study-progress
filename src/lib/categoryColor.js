const PALETTE = [
  { hex: '#6366F1', text: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10', border: 'border-[#6366F1]/30' }, // indigo
  { hex: '#22D3EE', text: 'text-[#22D3EE]', bg: 'bg-[#22D3EE]/10', border: 'border-[#22D3EE]/30' }, // cyan
  { hex: '#34D399', text: 'text-[#34D399]', bg: 'bg-[#34D399]/10', border: 'border-[#34D399]/30' }, // emerald
  { hex: '#F59E0B', text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30' }, // amber
  { hex: '#F472B6', text: 'text-[#F472B6]', bg: 'bg-[#F472B6]/10', border: 'border-[#F472B6]/30' }, // pink
  { hex: '#A78BFA', text: 'text-[#A78BFA]', bg: 'bg-[#A78BFA]/10', border: 'border-[#A78BFA]/30' }, // violet
  { hex: '#38BDF8', text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', border: 'border-[#38BDF8]/30' }, // sky
  { hex: '#FB7185', text: 'text-[#FB7185]', bg: 'bg-[#FB7185]/10', border: 'border-[#FB7185]/30' }, // rose
];

// Deterministic hash so the same category always gets the same color,
// without needing to store a color on the topic itself.
export function getCategoryColor(category) {
  const key = (category || 'General').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
