import api from '../../../services/axios'

export async function getAllProperties() {
  const { data } = await api.get('/pms/properties')
  return data?.data ?? data ?? []
}
