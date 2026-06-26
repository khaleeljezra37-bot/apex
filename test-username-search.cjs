async function run() {
  const res = await fetch('https://users.roblox.com/v1/users/search?keyword=Khaleeljezra37&limit=10');
  console.log(res.status, await res.text());
}
run();
