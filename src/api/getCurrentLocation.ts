export async function getCurrentPosition(
  longitude: number,
  latitude: number
) {
  try {
    const response = await fetch(
      `https://secure.geonames.org/findNearbyJSON?lat=${latitude}&lng=${longitude}&username=saydi`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.warn(error);
    return "We have problem with define name of your current location."
  }
}
