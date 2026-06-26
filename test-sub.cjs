async function run() {
  const sub = "1"; // Test user ID
  const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${sub}&size=420x420&format=Png&isCircular=true`);
  console.log(thumbRes.status, await thumbRes.json());
}
run();
