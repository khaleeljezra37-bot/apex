async function run() {
  const searchRes = await fetch(`https://users.roblox.com/v1/users/search?keyword=khaleeljezra37&limit=10`);
  const searchData = await searchRes.json();
  console.log(searchData);
}
run();
