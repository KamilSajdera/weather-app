export async function getCurrentPosition(
  longitude: number,
  latitude: number
): Promise<{ geonames: Array<{ name: string }> }> {
  const response = await fetch(
    `https://secure.geonames.org/findNearbyJSON?lat=${latitude}&lng=${longitude}&username=saydi`
  );
  const data = await response.json();

  return data;
}
