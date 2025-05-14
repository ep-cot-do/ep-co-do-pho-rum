import { Account } from "@/app/_libs/types";

const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1`;

export async function Login(username: string, password: string) {
  return await fetch(`${endpoint}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
}

export async function Signup(
  account: Account
) {
  const { ...signupData } = account;

  return await fetch(`${endpoint}/accounts/members/register/full`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });
}
