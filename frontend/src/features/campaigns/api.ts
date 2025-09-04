import { api } from ' @/lib/apiClient '
import type { Campaign } from './types'


export async function listCampaigns(): Promise<Campaign[]> {
    const { data } = await api.get('/campaigns')
    return data
}