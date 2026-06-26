async function run() {
  const res = await fetch('https://users.roblox.com/v1/usernames/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernames: ['khaleeljezra'], excludeBannedUsers: false })
  });
  console.log(res.status, await res.text());
}
run();
