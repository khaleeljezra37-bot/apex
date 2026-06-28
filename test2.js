import fetch from 'node-fetch';

const pass = "8#Fw!Q2$Xp7^Zm4&Lc9@Tr5*Hv1%KdRgB!5rQ@9Yx#2mLp7^Vz8$Nk4&Hs1*Cf6JwQ7#Lz9!N2@vFp8$Rx1^Km6&Hu4*Ta3%R@8m!Vx3#Qp7$Tk2^Hs9&Lf5*Zw1%NcDJ7$hQ!v2^Mp8#Rx4&Tk9*Lc1%Zw5@FsN";

fetch('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: pass })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
