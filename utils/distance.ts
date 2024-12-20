interface PostcodeData {
  latitude: number;
  longitude: number;
}

// Haversine formula to calculate distance between two points
export function calculateDistance(start: PostcodeData, end: PostcodeData): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(end.latitude - start.latitude);
  const dLon = toRad(end.longitude - start.longitude);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(start.latitude)) * Math.cos(toRad(end.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value: number): number {
  return value * Math.PI / 180;
} 