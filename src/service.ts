import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function fetchDataFromUrl(url: string): Promise<any> {
    try {
        const response = await axios.get(url, { responseType: 'text' });

        try {
            const jsonData = JSON.parse(response.data);
            return jsonData;
        } catch (error) {
            const xmlData = await parseStringPromise(response.data);
            return xmlData;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch or parse data');
    }
}
