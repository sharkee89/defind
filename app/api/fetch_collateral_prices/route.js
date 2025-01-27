import { COINGECKO_API_URL } from "../../constant/general_app";

export async function GET() {
    try {
        const response = await fetch(COINGECKO_API_URL);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
    });
    } catch (error) {
        console.error('Error fetching collateral prices:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch collateral prices' + error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}  