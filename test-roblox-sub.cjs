async function run() {
  const res = await fetch('https://apex-rblx.vercel.app/api/auth/roblox/avatar/3571560454');
  console.log(res.status, await res.text());
}
run();
