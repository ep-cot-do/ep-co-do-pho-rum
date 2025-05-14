const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1`

export async function getProfile() {
  return await fetch(`${endpoint}/accounts/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}
