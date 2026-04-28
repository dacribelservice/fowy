import fs from 'fs';

async function run() {
  const url = "https://exkyplxnyglpwomkunzk.supabase.co/rest/v1/businesses?select=id,name,plan,status,created_at";
  const key = "sb_publishable_r5ITSRvbmBKX41O21szELg_R_1XXPq3";
  const res = await fetch(url, {
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
