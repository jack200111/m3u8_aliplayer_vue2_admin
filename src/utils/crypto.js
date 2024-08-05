const internalKey = 'AES-GCM';

// 加密函数
function encrypt(data) {
  const jsonStr = JSON.stringify(data);
  const encryptedData = btoa(jsonStr + internalKey);
  return encryptedData;
}

// 解密函数
function decrypt(encryptedData) {
  const decryptedData = atob(encryptedData);
  const jsonStr = decryptedData.slice(0, -internalKey.length);
  return JSON.parse(jsonStr);
}

export default { encrypt, decrypt }
