async function run() {
  const res = await fetch('http://127.0.0.1:3000/api/auth/roblox/avatar/1');
  console.log(res.status, await res.text());
}
run();
