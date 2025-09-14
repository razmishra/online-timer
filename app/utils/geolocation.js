// app/utils/geolocation.js
export async function getUserCurrency() {
    try {
      const response = await fetch(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY}`,
        { cache: "no-store" } // Ensure fresh data
      );
      const data = await response.json();
      return data.country_code2 === "IN" ? "INR" : "USD";
    } catch (error) {
      console.error("Geolocation error:", error);
      return "USD"; // Fallback to USD for international
    }
  }
  
  export function convertToUSD(inrAmount) {
    const exchangeRate = 83; // 1 USD = 83 INR (update as needed or use an API)
    return Math.round(inrAmount / exchangeRate); // Convert to USD cents
  }