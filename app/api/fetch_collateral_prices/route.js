import { COINGECKO_API_URL, HARDCODED_PRICE } from "../../constant/general_app";

export async function GET() {
    try {
        const response = await fetch(COINGECKO_API_URL);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
    });
    } catch (error) {
        console.error('Get hardcoded prices:', error);
        return new Response(JSON.stringify(HARDCODED_PRICE), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}  